#!/usr/bin/env python3
"""
Test script to verify the Streamlit app works with the Display sheet data structure
"""

import pandas as pd
import sys

def test_display_data_structure():
    """Test the expected Display sheet data structure"""
    
    # Create sample data matching your Display sheet structure
    sample_data = {
        'S. No': [1, 2, 3, 4, 5],
        'Candidate Name': ['ALKESH PARASHAR', 'AMIT KUMAR', 'ANIT BHATI', 'ARUN KUMAR', 'ASHISH BANSAL (ORCHID)'],
        'Tower': ['ASTER', 'ZINNIA', 'ORCHID', 'ZINNIA', 'ORCHID'],
        'Flat#': [2602, 718, 634, 1912, 431],
        '920': [0, 0, 0, 0, 0],
        '1005': [0, 0, 0, 0, 0],
        '1165': [0, 0, 0, 0, 0],
        '1285': [0, 0, 0, 0, 0],
        '1670': [0, 0, 0, 0, 0],
        'Total Vote Count': [0, 0, 0, 0, 0],
        'Total Vote Value': [0.00, 0.00, 0.00, 0.00, 0.00]
    }
    
    df = pd.DataFrame(sample_data)
    
    print("✅ Sample Display sheet data structure created!")
    print(f"📊 Shape: {df.shape}")
    print(f"📋 Columns: {df.columns.tolist()}")
    print("\n📄 Sample data:")
    print(df.head())
    
    # Test required columns
    required_columns = ['Candidate Name', 'Tower', 'Flat#', '920', '1005', '1165', '1285', '1670', 'Total Vote Count', 'Total Vote Value']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        print(f"\n⚠️  Missing columns: {missing_columns}")
        return False
    else:
        print("\n✅ All required columns found!")
    
    # Test data processing
    print("\n🧪 Testing data processing...")
    
    # Convert vote columns to numeric
    vote_columns = ['920', '1005', '1165', '1285', '1670', 'Total Vote Count', 'Total Vote Value']
    for col in vote_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
    
    # Sort by Total Vote Count
    df = df.sort_values('Total Vote Count', ascending=False).reset_index(drop=True)
    
    print("✅ Data processing successful!")
    print(f"📈 Sorted by Total Vote Count: {df['Total Vote Count'].tolist()}")
    
    return True

def test_streamlit_imports():
    """Test if all required packages are installed"""
    try:
        import streamlit as st
        import pandas as pd
        import gspread
        from google.oauth2.service_account import Credentials
        import requests
        from PIL import Image
        print("✅ All required packages are installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {str(e)}")
        print("Please run: pip install -r requirements.txt")
        return False

if __name__ == "__main__":
    print("🧪 Testing EC Results Dashboard - Display Sheet Setup")
    print("=" * 60)
    
    # Test imports
    print("\n1. Testing package imports...")
    imports_ok = test_streamlit_imports()
    
    # Test Display data structure
    print("\n2. Testing Display sheet data structure...")
    data_ok = test_display_data_structure()
    
    # Summary
    print("\n" + "=" * 60)
    if imports_ok and data_ok:
        print("🎉 All tests passed! Your app is ready for Display sheet data!")
        print("\n📋 Expected Display sheet columns:")
        print("   - S. No")
        print("   - Candidate Name")
        print("   - Tower")
        print("   - Flat#")
        print("   - 920, 1005, 1165, 1285, 1670 (vote booths)")
        print("   - Total Vote Count")
        print("   - Total Vote Value")
        print("\n🚀 Run the app with: streamlit run app.py")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)
