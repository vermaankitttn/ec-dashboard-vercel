#!/usr/bin/env python3
"""
Test script to verify the Streamlit app works with the provided Excel file
"""

import pandas as pd
import sys

def test_excel_loading():
    """Test loading the Excel file"""
    try:
        # Load the Excel file
        df = pd.read_excel('File.xlsx', sheet_name='Sheet1')
        
        print("✅ Successfully loaded Excel file!")
        print(f"📊 Shape: {df.shape}")
        print(f"📋 Columns: {df.columns.tolist()}")
        print("\n📄 First 5 rows:")
        print(df.head())
        
        # Check if required columns exist
        required_columns = ['CANDIDATE NAME', 'CANDIDATE TOWER', 'CANDIDATE FLAT NO.']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            print(f"\n⚠️  Missing columns: {missing_columns}")
            print("Available columns:", df.columns.tolist())
        else:
            print("\n✅ All required columns found!")
        
        # Check data quality
        print(f"\n📈 Total candidates: {len(df)}")
        print(f"🏢 Unique towers: {df['CANDIDATE TOWER'].nunique()}")
        print(f"🏠 Unique flat numbers: {df['CANDIDATE FLAT NO.'].nunique()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error loading Excel file: {str(e)}")
        return False

def test_streamlit_imports():
    """Test if all required packages are installed"""
    try:
        import streamlit as st
        import pandas as pd
        import gspread
        from google.oauth2.service_account import Credentials
        print("✅ All required packages are installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {str(e)}")
        print("Please run: pip install -r requirements.txt")
        return False

if __name__ == "__main__":
    print("🧪 Testing EC Results Dashboard Setup")
    print("=" * 50)
    
    # Test imports
    print("\n1. Testing package imports...")
    imports_ok = test_streamlit_imports()
    
    # Test Excel loading
    print("\n2. Testing Excel file loading...")
    excel_ok = test_excel_loading()
    
    # Summary
    print("\n" + "=" * 50)
    if imports_ok and excel_ok:
        print("🎉 All tests passed! You can now run:")
        print("   streamlit run app.py")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)
