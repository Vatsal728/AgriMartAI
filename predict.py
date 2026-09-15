"""
AgriSmart AI — Official Mandatory Predict Interface (SIH 2026 Problem Statement Section 4.1)

Usage:
    python predict.py --image tests/phototest/tomato_early_blight_sample.png
"""

import sys
import os

# Add root directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.cv_pipeline.predict import main, predict

if __name__ == "__main__":
    main()
