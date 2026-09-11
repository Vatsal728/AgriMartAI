"""
Dataset Builder & Preprocessor for AgriSmart AI
Handles:
1. Loading YOLO dataset (FieldPlant)
2. Stratified train/val/test splitting
3. Class mapping between PlantVillage / FieldPlant / SIH shared class list
4. Generating cropped leaf patches for classifier training
"""

import os
import glob
import shutil
import random
from collections import Counter
from PIL import Image
import yaml

CLASS_NAMES_27 = [
    'Cassava Bacterial Blight', 'Cassava Brown Leaf Spot', 'Cassava Healthy',
    'Cassava Mosaic', 'Cassava Root Rot', 'Corn Brown Spots', 'Corn Charcoal',
    'Corn Chlorotic Leaf Spot', 'Corn Gray leaf spot', 'Corn Healthy',
    'Corn Insects Damages', 'Corn Mildew', 'Corn Purple Discoloration',
    'Corn Smut', 'Corn Streak', 'Corn Stripe', 'Corn Violet Decoloration',
    'Corn Yellow Spots', 'Corn Yellowing', 'Corn leaf blight', 'Corn rust leaf',
    'Tomato Brown Spots', 'Tomato bacterial wilt', 'Tomato blight leaf',
    'Tomato healthy', 'Tomato leaf mosaic virus', 'Tomato leaf yellow virus'
]

# PlantVillage folder name to 27-class standard mapping
PLANTVILLAGE_TO_27_MAP = {
    "Tomato___Early_blight": "Tomato Brown Spots",
    "Tomato___Target_Spot": "Tomato Brown Spots",
    "Tomato___Septoria_leaf_spot": "Tomato Brown Spots",
    "Tomato___Bacterial_spot": "Tomato bacterial wilt",
    "Tomato___Late_blight": "Tomato blight leaf",
    "Tomato___healthy": "Tomato healthy",
    "Tomato___Tomato_mosaic_virus": "Tomato leaf mosaic virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Tomato leaf yellow virus",
    "Corn_(maize)___Common_rust_": "Corn rust leaf",
    "Corn_(maize)___Northern_Leaf_Blight": "Corn leaf blight",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Corn Gray leaf spot",
    "Corn_(maize)___healthy": "Corn Healthy",
}

def create_stratified_yolo_splits(
    source_train_dir="archive/train",
    output_dir="data/yolo_dataset",
    train_ratio=0.8,
    val_ratio=0.1,
    test_ratio=0.1,
    seed=42
):
    """
    Creates train, val, and test splits from the single archive/train directory with stratification.
    """
    random.seed(seed)
    images = glob.glob(os.path.join(source_train_dir, "images", "*.*"))
    print(f"Found {len(images)} total images to split...")

    # Index by primary class
    img_by_class = {}
    for img_p in images:
        base = os.path.splitext(os.path.basename(img_p))[0]
        lbl_p = os.path.join(source_train_dir, "labels", f"{base}.txt")
        primary_cls = 0
        if os.path.exists(lbl_p):
            with open(lbl_p, "r") as f:
                first_line = f.readline().strip()
                if first_line:
                    primary_cls = int(first_line.split()[0])
        img_by_class.setdefault(primary_cls, []).append(img_p)

    # Prepare directories
    for split in ["train", "val", "test"]:
        os.makedirs(os.path.join(output_dir, split, "images"), exist_ok=True)
        os.makedirs(os.path.join(output_dir, split, "labels"), exist_ok=True)

    counts = {"train": 0, "val": 0, "test": 0}

    for cls_id, cls_imgs in img_by_class.items():
        random.shuffle(cls_imgs)
        n = len(cls_imgs)
        n_train = int(n * train_ratio)
        n_val = int(n * val_ratio)
        
        splits = {
            "train": cls_imgs[:n_train],
            "val": cls_imgs[n_train:n_train + n_val],
            "test": cls_imgs[n_train + n_val:]
        }
        # If class has only 1 sample, ensure it goes to train
        if n == 1:
            splits["train"] = cls_imgs
            splits["val"] = []
            splits["test"] = []

        for split_name, split_list in splits.items():
            for img_path in split_list:
                base = os.path.splitext(os.path.basename(img_path))[0]
                lbl_path = os.path.join(source_train_dir, "labels", f"{base}.txt")
                
                # Copy image
                dst_img = os.path.join(output_dir, split_name, "images", os.path.basename(img_path))
                shutil.copy2(img_path, dst_img)
                
                # Copy label
                if os.path.exists(lbl_path):
                    dst_lbl = os.path.join(output_dir, split_name, "labels", f"{base}.txt")
                    shutil.copy2(lbl_path, dst_lbl)
                
                counts[split_name] += 1

    # Write data.yaml for YOLO
    yaml_content = {
        "path": os.path.abspath(output_dir),
        "train": "train/images",
        "val": "val/images",
        "test": "test/images",
        "nc": len(CLASS_NAMES_27),
        "names": CLASS_NAMES_27
    }
    with open(os.path.join(output_dir, "data.yaml"), "w") as f:
        yaml.dump(yaml_content, f, default_flow_style=False)

    print(f"Dataset split complete: Train={counts['train']}, Val={counts['val']}, Test={counts['test']}")
    return output_dir

if __name__ == "__main__":
    print("Dataset builder utility loaded. Run functions to split or map datasets.")
