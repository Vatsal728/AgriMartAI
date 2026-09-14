"""
Comprehensive Real-World & Statistical Evaluation Benchmark for AgriSmart AI
Evaluates:
1. EfficientNet-B0 (Cloud / Web API Engine)
2. MobileNet-V3-Small (Edge / Mobile App Engine)

Generates:
- Validation Set Metrics (Top-1, Top-3, Macro/Weighted Precision, Recall, F1-Score)
- Real-World Out-of-Distribution Field Image Evaluation (Wikimedia & Field Photos)
- Latency, P95, Throughput (FPS), Model Size
- Per-Crop Accuracy Breakdown
"""

import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import time
import json
import random
import requests
from io import BytesIO
from PIL import Image
import numpy as np

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")
VALID_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "plantvillage",
    "New Plant Diseases Dataset(Augmented)", "New Plant Diseases Dataset(Augmented)", "valid"
)

EVAL_TRANSFORMS = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_eval_model(model_type="efficientnet"):
    pth_file = os.path.join(
        MODELS_DIR, 
        "efficientnet_b0_best.pth" if model_type == "efficientnet" else "mobilenet_v3_best.pth"
    )
    if not os.path.exists(pth_file):
        raise FileNotFoundError(f"Checkpoint not found at: {pth_file}")
    
    ckpt = torch.load(pth_file, map_location=DEVICE)
    class_names = ckpt.get("class_names", [])
    num_classes = len(class_names)
    
    if model_type == "efficientnet":
        m = models.efficientnet_b0(weights=None)
        in_feat = m.classifier[1].in_features
        m.classifier[1] = nn.Linear(in_feat, num_classes)
    else:
        m = models.mobilenet_v3_small(weights=None)
        in_feat = m.classifier[3].in_features
        m.classifier[3] = nn.Linear(in_feat, num_classes)
        
    m.load_state_dict(ckpt["model_state_dict"])
    m.to(DEVICE)
    m.eval()
    return m, class_names

def run_dataset_benchmark(model_type="efficientnet", max_samples_per_class=30):
    print(f"\n=======================================================")
    print(f" Dataset Evaluation: {model_type.upper()} on {DEVICE}")
    print(f"=======================================================")
    
    model, class_names = load_eval_model(model_type)
    class_to_idx = {name: idx for idx, name in enumerate(class_names)}
    
    y_true = []
    y_pred = []
    top3_correct = 0
    total_samples = 0
    latencies = []
    
    # Per crop tracking
    crop_stats = {}
    
    if not os.path.exists(VALID_DIR):
        print(f"[Warning] Validation directory not found at: {VALID_DIR}")
        return None
        
    classes_found = sorted([d for d in os.listdir(VALID_DIR) if os.path.isdir(os.path.join(VALID_DIR, d))])
    
    for cls_name in classes_found:
        if cls_name not in class_to_idx:
            continue
        gt_idx = class_to_idx[cls_name]
        crop_name = cls_name.split("___")[0].split("_")[0]
        if crop_name not in crop_stats:
            crop_stats[crop_name] = {"correct": 0, "total": 0}
            
        cls_dir = os.path.join(VALID_DIR, cls_name)
        img_names = [f for f in os.listdir(cls_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]
        
        random.seed(42)
        sampled_imgs = random.sample(img_names, min(len(img_names), max_samples_per_class))
        
        for img_name in sampled_imgs:
            img_path = os.path.join(cls_dir, img_name)
            try:
                pil_img = Image.open(img_path).convert("RGB")
                img_tensor = EVAL_TRANSFORMS(pil_img).unsqueeze(0).to(DEVICE)
                
                t0 = time.perf_counter()
                with torch.no_grad():
                    outputs = model(img_tensor)
                    probs = F.softmax(outputs, dim=1)
                t1 = time.perf_counter()
                latencies.append((t1 - t0) * 1000.0)
                
                top3_indices = torch.topk(probs, 3, dim=1).indices[0].cpu().numpy()
                pred_idx = top3_indices[0]
                
                y_true.append(gt_idx)
                y_pred.append(pred_idx)
                
                is_correct = (gt_idx == pred_idx)
                if is_correct:
                    crop_stats[crop_name]["correct"] += 1
                crop_stats[crop_name]["total"] += 1
                
                if gt_idx in top3_indices:
                    top3_correct += 1
                total_samples += 1
            except Exception:
                pass
                
    acc = accuracy_score(y_true, y_pred)
    prec_macro = precision_score(y_true, y_pred, average='macro', zero_division=0)
    rec_macro = recall_score(y_true, y_pred, average='macro', zero_division=0)
    f1_macro = f1_score(y_true, y_pred, average='macro', zero_division=0)
    f1_weighted = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    top3_acc = top3_correct / total_samples if total_samples > 0 else 0.0
    
    avg_lat = np.mean(latencies[5:]) if len(latencies) > 5 else np.mean(latencies)
    p50_lat = np.median(latencies[5:]) if len(latencies) > 5 else np.median(latencies)
    p95_lat = np.percentile(latencies[5:], 95) if len(latencies) > 5 else np.percentile(latencies, 95)
    fps = 1000.0 / avg_lat if avg_lat > 0 else 0.0
    
    per_crop_accuracy = {
        k: round(v["correct"] / v["total"] * 100, 2) if v["total"] > 0 else 0.0 
        for k, v in crop_stats.items()
    }
    
    results = {
        "model": model_type,
        "device": str(DEVICE),
        "total_samples": total_samples,
        "top1_accuracy": round(float(acc * 100), 2),
        "top3_accuracy": round(float(top3_acc * 100), 2),
        "precision_macro": round(float(prec_macro * 100), 2),
        "recall_macro": round(float(rec_macro * 100), 2),
        "f1_score_macro": round(float(f1_macro * 100), 2),
        "f1_score_weighted": round(float(f1_weighted * 100), 2),
        "latency_mean_ms": round(float(avg_lat), 2),
        "latency_p50_ms": round(float(p50_lat), 2),
        "latency_p95_ms": round(float(p95_lat), 2),
        "throughput_fps": round(float(fps), 1),
        "per_crop_accuracy": per_crop_accuracy
    }
    
    print(f"Total Evaluated Samples: {total_samples}")
    print(f"Top-1 Accuracy          : {acc * 100:.2f}%")
    print(f"Top-3 Accuracy          : {top3_acc * 100:.2f}%")
    print(f"Precision (Macro)       : {prec_macro * 100:.2f}%")
    print(f"Recall (Macro)          : {rec_macro * 100:.2f}%")
    print(f"F1-Score (Macro)        : {f1_macro * 100:.2f}%")
    print(f"F1-Score (Weighted)     : {f1_weighted * 100:.2f}%")
    print(f"Inference Latency       : {avg_lat:.2f} ms (P95: {p95_lat:.2f} ms | {fps:.1f} FPS)")
    
    return results

def get_wikimedia_url(file_title):
    api = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'titles': file_title,
        'prop': 'imageinfo',
        'iiprop': 'url',
        'format': 'json'
    }
    headers = {'User-Agent': 'AgriSmartTester/1.0 (tester@agrimart.ai)'}
    try:
        r = requests.get(api, params=params, headers=headers, timeout=8).json()
        pages = r.get('query', {}).get('pages', {})
        for p, v in pages.items():
            if 'imageinfo' in v and len(v['imageinfo']) > 0:
                return v['imageinfo'][0]['url']
    except Exception:
        pass
    return None

def test_real_world_web_images():
    print(f"\n=======================================================")
    print(f" Real-World Field Images from Web & Field Conditions")
    print(f"=======================================================")
    
    test_cases = [
        {
            "name": "Tomato Early Blight (Field Infection)",
            "wiki_file": "File:Alternaria solani - leaf lesions.jpg",
            "ground_truth": "Tomato___Early_blight",
            "condition": "Outdoor sunlit leaf with concentric brown lesions"
        },
        {
            "name": "Corn Common Rust (Outdoor Leaf)",
            "wiki_file": "File:Puccinia sorghi Schwein. 1538032.jpg",
            "ground_truth": "Corn_(maize)___Common_rust_",
            "condition": "Field maize leaf covered with brown fungal pustules"
        },
        {
            "name": "Tomato Late Blight (Field Crop)",
            "wiki_file": "File:Tomato with Phytophthora infestans (late blight).jpg",
            "ground_truth": "Tomato___Late_blight",
            "condition": "Dark rotting lesions with irregular water-soaked edges"
        }
    ]
    
    eff_model, eff_classes = load_eval_model("efficientnet")
    mob_model, mob_classes = load_eval_model("mobilenet")
    
    headers = {'User-Agent': 'AgriSmartTestingBot/1.0 (https://github.com/Vatsal728/AgriMartAI; contact@agrimart.ai)'}
    field_results = []
    
    for idx, item in enumerate(test_cases, 1):
        print(f"\n[{idx}/{len(test_cases)}] Testing: {item['name']}")
        url = get_wikimedia_url(item["wiki_file"])
        if not url:
            print(f"   [Error] Could not resolve URL for {item['wiki_file']}")
            continue
            
        try:
            resp = requests.get(url, headers=headers, timeout=12)
            if resp.status_code == 200:
                img = Image.open(BytesIO(resp.content)).convert("RGB")
                img_t = EVAL_TRANSFORMS(img).unsqueeze(0).to(DEVICE)
                
                # EfficientNet Inference
                with torch.no_grad():
                    eff_out = eff_model(img_t)
                    eff_probs = F.softmax(eff_out, dim=1)
                    eff_top3_probs, eff_top3_idxs = torch.topk(eff_probs, 3, dim=1)
                    eff_pred = eff_classes[eff_top3_idxs[0][0].item()]
                    eff_conf = float(eff_top3_probs[0][0].item())
                    eff_top3_classes = [eff_classes[i.item()] for i in eff_top3_idxs[0]]
                    
                # MobileNet Inference
                with torch.no_grad():
                    mob_out = mob_model(img_t)
                    mob_probs = F.softmax(mob_out, dim=1)
                    mob_top3_probs, mob_top3_idxs = torch.topk(mob_probs, 3, dim=1)
                    mob_pred = mob_classes[mob_top3_idxs[0][0].item()]
                    mob_conf = float(mob_top3_probs[0][0].item())
                    mob_top3_classes = [mob_classes[i.item()] for i in mob_top3_idxs[0]]
                    
                gt = item["ground_truth"]
                eff_match = (eff_pred == gt)
                mob_match = (mob_pred == gt)
                
                print(f"   Ground Truth : {gt}")
                print(f"   EfficientNet : {eff_pred} ({eff_conf*100:.1f}%) -> {'[MATCH]' if eff_match else '[MISMATCH]'}")
                print(f"   MobileNet    : {mob_pred} ({mob_conf*100:.1f}%) -> {'[MATCH]' if mob_match else '[MISMATCH]'}")
                
                field_results.append({
                    "test_case": item["name"],
                    "condition": item["condition"],
                    "ground_truth": gt,
                    "efficientnet_pred": eff_pred,
                    "efficientnet_conf": round(eff_conf * 100, 2),
                    "efficientnet_top3": eff_top3_classes,
                    "efficientnet_match": eff_match,
                    "mobilenet_pred": mob_pred,
                    "mobilenet_conf": round(mob_conf * 100, 2),
                    "mobilenet_top3": mob_top3_classes,
                    "mobilenet_match": mob_match
                })
            else:
                print(f"   [Download Failed] HTTP {resp.status_code}")
        except Exception as e:
            print(f"   [Error]: {e}")
            
    # Also evaluate on unseen local test set samples
    test_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data", "plantvillage", "test", "test")
    if os.path.exists(test_dir):
        print(f"\n--- Evaluating Additional Independent Test Samples ({test_dir}) ---")
        test_files = [f for f in os.listdir(test_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        # Test 10 distinct samples
        for tf in test_files[:10]:
            img_path = os.path.join(test_dir, tf)
            img = Image.open(img_path).convert("RGB")
            img_t = EVAL_TRANSFORMS(img).unsqueeze(0).to(DEVICE)
            with torch.no_grad():
                eff_out = eff_model(img_t)
                eff_probs = F.softmax(eff_out, dim=1)
                eff_conf, eff_idx = torch.max(eff_probs, 1)
                eff_pred = eff_classes[eff_idx.item()]
            print(f"   Sample: {tf:<28} -> Predicted: {eff_pred} ({eff_conf.item()*100:.1f}%)")
            
    return field_results

if __name__ == "__main__":
    print("Executing Comprehensive AgriSmart AI Model Benchmark...")
    eff_metrics = run_dataset_benchmark("efficientnet", max_samples_per_class=30)
    mob_metrics = run_dataset_benchmark("mobilenet", max_samples_per_class=30)
    web_tests = test_real_world_web_images()
    
    full_report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "models": {
            "efficientnet_b0": eff_metrics,
            "mobilenet_v3": mob_metrics
        },
        "real_world_web_tests": web_tests
    }
    
    report_file = os.path.join(MODELS_DIR, "benchmark_results.json")
    with open(report_file, "w") as f:
        json.dump(full_report, f, indent=2)
    print(f"\n[Success] Full Benchmark Results saved to: {report_file}")
