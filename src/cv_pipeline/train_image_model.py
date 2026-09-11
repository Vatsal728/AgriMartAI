"""
Image Model Training Pipeline for AgriSmart AI (SIH-2026)
Supports:
1. YOLOv8 Classifier Training (Ultralytics)
2. PyTorch EfficientNet-B0 / MobileNetV3 Transfer Learning
3. Automatic dataset discovery, evaluation metrics, and saving weights to models/
"""

import os
import sys

# Prevent Windows Intel OpenMP multiple runtime conflict
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import glob
import time
import argparse
from pathlib import Path
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

def get_device():
    """Detects best available compute hardware (CUDA GPU or CPU)."""
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
        torch.backends.cudnn.benchmark = True
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.backends.cudnn.allow_tf32 = True
        print(f"🚀 Using GPU Acceleration: {torch.cuda.get_device_name(0)}")
        print("⚡ Enabled Tensor Core TF32 & cuDNN Kernel Auto-Tuner for Maximum Speed!")
    else:
        device = torch.device("cpu")
        print("⚙️ Using CPU Compute (Multi-threading enabled)")
    return device

def find_plantvillage_dataset():
    """Locates the extracted PlantVillage dataset path automatically."""
    candidates = [
        r"e:\AgriMartAI\data\plantvillage\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)",
        r"e:\AgriMartAI\data\plantvillage\New Plant Diseases Dataset(Augmented)",
        r"e:\AgriMartAI\data\plantvillage"
    ]
    for c in candidates:
        train_path = os.path.join(c, "train")
        valid_path = os.path.join(c, "valid")
        if os.path.exists(train_path) and os.path.exists(valid_path):
            return train_path, valid_path
    raise FileNotFoundError("Could not locate valid train and valid directories in data/plantvillage")

# ==========================================
# 1. PYTORCH EFFICIENTNET / RESNET TRAINING
# ==========================================
def train_efficientnet(epochs=5, batch_size=64, lr=0.001, model_name="efficientnet_b0"):
    """
    Trains a high-accuracy transfer learning classifier on the plant dataset.
    Optimized for memory efficiency and fast convergence.
    """
    train_dir, valid_dir = find_plantvillage_dataset()
    device = get_device()
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)

    print(f"\n📂 Train Directory: {train_dir}")
    print(f"📂 Valid Directory: {valid_dir}")

    # Data Augmentation & Normalization (Standard ImageNet statistics)
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'valid': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    # Load Datasets using torchvision ImageFolder
    print("🔄 Loading dataset folders...")
    image_datasets = {
        'train': datasets.ImageFolder(train_dir, data_transforms['train']),
        'valid': datasets.ImageFolder(valid_dir, data_transforms['valid'])
    }

    # High-Throughput DataLoader (Maximizes RTX 3050 GPU Tensor Core Utilization)
    dataloaders = {
        'train': DataLoader(
            image_datasets['train'], 
            batch_size=batch_size, 
            shuffle=True, 
            num_workers=4, 
            pin_memory=True,
            persistent_workers=True,
            prefetch_factor=2
        ),
        'valid': DataLoader(
            image_datasets['valid'], 
            batch_size=batch_size, 
            shuffle=False, 
            num_workers=4, 
            pin_memory=True,
            persistent_workers=True,
            prefetch_factor=2
        )
    }

    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'valid']}
    class_names = image_datasets['train'].classes
    num_classes = len(class_names)
    print(f"📊 Classes Detected ({num_classes}): {class_names[:5]} ... (total {num_classes})")
    print(f"📈 Total Samples: Train={dataset_sizes['train']}, Valid={dataset_sizes['valid']}")

    # Build Model Backbone
    print(f"\n🧠 Initializing {model_name} Backbone with Pretrained ImageNet Weights...")
    if model_name == "efficientnet_b0":
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    elif model_name == "mobilenet_v3":
        model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        in_features = model.classifier[3].in_features
        model.classifier[3] = nn.Linear(in_features, num_classes)
    elif model_name == "resnet18":
        model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)

    model = model.to(device)

    # Loss, Optimizer & AMP Scaler
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    scaler = torch.amp.GradScaler('cuda', enabled=(device.type == 'cuda'))

    best_acc = 0.0
    best_weights_path = models_dir / f"{model_name}_best.pth"

    # Training Loop
    print("\n🚀 Starting Training Loop...")
    start_time = time.time()

    for epoch in range(epochs):
        print(f"\n--- Epoch {epoch+1}/{epochs} ---")
        
        # Each epoch has a training and validation phase
        for phase in ['train', 'valid']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0
            total_processed = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)

                optimizer.zero_grad(set_to_none=True)

                with torch.set_grad_enabled(phase == 'train'):
                    with torch.amp.autocast(device_type=device.type, enabled=(device.type == 'cuda')):
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)

                    if phase == 'train':
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
                total_processed += inputs.size(0)

                # Batch progress indicator
                if total_processed % (batch_size * 50) == 0:
                    print(f"[{phase.upper()}] Processed {total_processed}/{dataset_sizes[phase]} samples...", end="\r")

            if phase == 'train':
                scheduler.step()

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = (running_corrects.double() / dataset_sizes[phase]).item()

            print(f"\n{phase.capitalize()} Loss: {epoch_loss:.4f} | Accuracy: {epoch_acc*100:.2f}%")

            # Save best model
            if phase == 'valid' and epoch_acc > best_acc:
                best_acc = epoch_acc
                torch.save({
                    'epoch': epoch,
                    'model_state_dict': model.state_dict(),
                    'optimizer_state_dict': optimizer.state_dict(),
                    'class_names': class_names,
                    'val_accuracy': best_acc,
                }, best_weights_path)
                print(f"⭐ New Best Model Saved -> {best_weights_path} (Acc: {best_acc*100:.2f}%)")

    total_time = time.time() - start_time
    print(f"\n✅ Training Complete in {total_time/60:.2f} minutes!")
    print(f"🏆 Best Validation Accuracy: {best_acc*100:.2f}%")
    return str(best_weights_path)


# ==========================================
# 2. ULTRALYTICS YOLOV8 CLASSIFIER TRAINING
# ==========================================
def train_yolov8_cls(epochs=10, imgsz=224, batch=32):
    """
    Trains YOLOv8 classification model using Ultralytics framework.
    """
    from ultralytics import YOLO
    
    train_dir, valid_dir = find_plantvillage_dataset()
    dataset_root = str(Path(train_dir).parent)
    
    print(f"\n🚀 Launching YOLOv8-cls on dataset: {dataset_root}")
    model = YOLO("yolov8n-cls.pt")  # Load pretrained nano classifier

    # Train model
    results = model.train(
        data=dataset_root,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        project="runs/classify",
        name="plantvillage_yolov8n",
        exist_ok=True
    )
    
    # Save exported best weights to models/
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    best_yolo = Path(results.save_dir) / "weights" / "best.pt"
    if best_yolo.exists():
        import shutil
        dst = models_dir / "yolov8n_cls_best.pt"
        shutil.copy2(best_yolo, dst)
        print(f"⭐ Saved YOLOv8 model weights -> {dst}")
        return str(dst)
    return str(best_yolo)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AgriSmart AI Image Models")
    parser.add_argument("--engine", choices=["efficientnet", "yolo", "mobilenet", "resnet"], default="efficientnet",
                        help="Choose training engine: efficientnet, yolo, mobilenet, or resnet")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=128, help="Batch size (e.g. 64 or 128 for high GPU utilization)")
    parser.add_argument("--lr", type=float, default=0.001, help="Learning rate")
    args = parser.parse_args()

    if args.engine == "yolo":
        train_yolov8_cls(epochs=args.epochs, batch=args.batch)
    else:
        model_map = {
            "efficientnet": "efficientnet_b0",
            "mobilenet": "mobilenet_v3",
            "resnet": "resnet18"
        }
        train_efficientnet(epochs=args.epochs, batch_size=args.batch, lr=args.lr, model_name=model_map[args.engine])
