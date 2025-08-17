import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
import time
from datetime import datetime, timedelta
import os
from PIL import Image
import requests
from io import BytesIO

# Page configuration
st.set_page_config(
    page_title="EC Results Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        color: #1f77b4;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .card-header {
        height: 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
    }
    .position-badge {
        position: absolute;
        top: 4px;
        left: 4px;
        background: rgba(255,255,255,0.9);
        color: #333;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
    }
    .change-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    .up-arrow {
        color: #00ff00;
        animation: bounce 1s infinite;
    }
    .down-arrow {
        color: #ff4444;
        animation: shake 0.5s infinite;
    }
    .stable-arrow {
        color: #666;
    }
    .new-arrow {
        color: #ffaa00;
    }
    .profile-image {
        position: absolute;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
    }
    .candidate-info {
        padding: 32px 6px 4px 6px;
        text-align: center;
    }
    .candidate-name {
        font-size: 10px;
        font-weight: bold;
        color: #333;
        margin-bottom: 1px;
        line-height: 1.0;
    }
    .candidate-tower {
        font-size: 8px;
        color: #666;
        margin-bottom: 2px;
    }
    .flat-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 3px;
        margin-bottom: 4px;
    }
    .flat-chip {
        background: #f5f7fb;
        border: 1px solid #e7ebf3;
        border-radius: 4px;
        padding: 2px 1px;
        text-align: center;
    }
    .flat-chip .label { font-size: 7px; color: #777; line-height: 1; }
    .flat-chip .value { font-size: 9px; font-weight: 700; color: #333; line-height: 1.0; }

    .stats-container {
        display: flex;
        justify-content: space-around;
        border-top: 1px dashed #e0e0e0;
        padding-top: 4px;
    }
    .stat-item {
        text-align: center;
    }
    .stat-number {
        font-size: 11px;
        font-weight: bold;
        color: #333;
        line-height: 1;
    }
    .stat-label {
        font-size: 7px;
        color: #666;
        margin-top: 1px;
    }
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-3px);}
        60% {transform: translateY(-1px);}
    }
    @keyframes shake {
        0%, 100% {transform: translateX(0);}
        25% {transform: translateX(-2px);}
        75% {transform: translateX(2px);}
    }
    .status-indicator {
        padding: 8px;
        border-radius: 8px;
        margin: 8px 0;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
    }
    .connected {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .disconnected {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    .page-container {
        max-height: 100vh;
        overflow: hidden;
        padding: 10px;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        max-height: calc(100vh - 60px);
        overflow: hidden;
        padding: 8px;
    }
    .projector-mode .grid-container {
        gap: 6px;
    }
    .candidate-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
        overflow: hidden;
        height: 120px;
        position: relative;
    }
    .projector-mode .candidate-card {
        height: 110px;
    }
    .projector-mode .candidate-name {
        font-size: 14px;
    }
    .projector-mode .stat-number {
        font-size: 16px;
    }
    .projector-mode .stat-label {
        font-size: 9px;
    }
    .countdown-timer {
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 14px;
        display: inline-block;
        margin: 10px 0;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'previous_data' not in st.session_state:
    st.session_state.previous_data = None
if 'last_refresh' not in st.session_state:
    st.session_state.last_refresh = None
if 'next_refresh_time' not in st.session_state:
    st.session_state.next_refresh_time = datetime.now() + timedelta(minutes=5)

def load_image_from_url(url):
    """Load image from URL"""
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        return image
    except:
        return None

def load_google_sheets_data(credentials_file, spreadsheet_url):
    """Load data from Google Sheets"""
    try:
        # Set up credentials
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        creds = Credentials.from_service_account_file(credentials_file, scopes=scope)
        client = gspread.authorize(creds)
        
        # Extract spreadsheet ID from URL
        spreadsheet_id = spreadsheet_url.split('/')[5]
        spreadsheet = client.open_by_key(spreadsheet_id)
        
        # Try to get the 'Display' sheet first, then fallback to 'Final', then first sheet
        worksheet = None
        try:
            worksheet = spreadsheet.worksheet('Display')
            print("Display sheet found")
        except:
            try:
                worksheet = spreadsheet.worksheet('Final')
            except:
                worksheet = spreadsheet.get_worksheet(0)
        
        # Get all values
        data = worksheet.get_all_values()
        
        # Convert to DataFrame
        if data and len(data) > 2:
            # Skip first row (title), use second row as headers, data starts from third row
            df = pd.DataFrame(data[2:], columns=data[1])
            df.to_csv('data.csv', index=False)
            # Clean and process the data
            df = df[df['Candidate Name'].notna() & (df['Candidate Name'] != '')]  # Remove empty rows
            df.to_csv('data1.csv', index=False)
            # Convert vote columns to numeric, handling any text values
            vote_columns = ['920', '1005', '1165', '1285', '1670', 'Total Vote Count', 'Total Vote Value']
            for col in vote_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
            return df
        else:
            return None
            
    except Exception as e:
        st.error(f"Error loading Google Sheets data: {str(e)}")
        return None

def load_excel_data(file_path):
    """Load data from Excel file as fallback"""
    try:
        df = pd.read_excel(file_path, sheet_name='Sheet1')
        return df
    except Exception as e:
        st.error(f"Error loading Excel data: {str(e)}")
        return None

def calculate_position_changes(current_data, previous_data):
    """Calculate position changes for candidates"""
    if previous_data is None or current_data is None:
        return {}
    
    changes = {}
    
    # Create mapping of candidate names to their positions
    current_positions = {}
    previous_positions = {}
    
    # Assuming the data is sorted by Total Vote Value in descending order
    for idx, row in current_data.iterrows():
        candidate_name = row.get('Candidate Name', f'Candidate {idx+1}')
        current_positions[candidate_name] = idx + 1
    
    for idx, row in previous_data.iterrows():
        candidate_name = row.get('Candidate Name', f'Candidate {idx+1}')
        previous_positions[candidate_name] = idx + 1
    
    # Calculate changes
    for candidate in current_positions:
        if candidate in previous_positions:
            current_pos = current_positions[candidate]
            previous_pos = previous_positions[candidate]
            
            if current_pos < previous_pos:
                changes[candidate] = 'up'
            elif current_pos > previous_pos:
                changes[candidate] = 'down'
            else:
                changes[candidate] = 'same'
        else:
            changes[candidate] = 'new'
    
    return changes

def get_countdown_text(refresh_interval=5):
    """Get countdown text for next refresh"""
    now = datetime.now()
    time_diff = st.session_state.next_refresh_time - now
    
    if time_diff.total_seconds() <= 0:
        return "Refreshing now..."
    
    minutes = int(time_diff.total_seconds() // 60)
    seconds = int(time_diff.total_seconds() % 60)
    
    if minutes > 0:
        return f"Auto-refresh in {minutes}m {seconds}s (every {refresh_interval}min)"
    else:
        return f"Auto-refresh in {seconds}s (every {refresh_interval}min)"

def display_candidate_card(candidate_name, position, row_data, change, image_url=None):
    """Display a candidate card with photo, name, and vote statistics"""
    
    # Extract vote data
    tower = row_data.get('Tower', 'N/A')
    flat_no = row_data.get('Flat#', 'N/A')
    total_votes = row_data.get('Total Vote Count', 0)
    total_value = row_data.get('Total Vote Value', 0)
    v920 = row_data.get('920', 0)
    v1005 = row_data.get('1005', 0)
    v1165 = row_data.get('1165', 0)
    v1285 = row_data.get('1285', 0)
    v1670 = row_data.get('1670', 0)
    
    # Get initials for profile image
    initials = ''.join([name[0] for name in candidate_name.split()[:2]]).upper()
    
    # Determine card color based on position (first 10 = light green, rest = light red)
    if position <= 10:
        card_bg_color = "#e8f5e8"  # Light green
        border_color = "#2E8B57"   # Dark green border
    else:
        card_bg_color = "#ffe8e8"  # Light red
        border_color = "#dc3545"   # Dark red border
    
    # Create card using Streamlit components with proper styling
    with st.container():
        # Add custom CSS for card styling
        st.markdown(f"""
        <style>
        .candidate-card-{position} {{
            border: 3px solid {border_color};
            border-radius: 8px;
            background: {card_bg_color};
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            margin-bottom: 10px;
            padding: 0;
            overflow: hidden;
            width: 100%;
        }}
        .card-header-{position} {{
            background: {border_color};
            color: white;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
        }}
        .card-body-{position} {{
            padding: 8px;
        }}
        .profile-photo-{position} {{
            width: 120px;
            height: 140px;
            background: #f0f0f0;
            border: 2px solid #ddd;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: #666;
        }}
        .vote-info-{position} {{
            margin-bottom: 5px;
        }}
        .vote-grid-{position} {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
        }}
        .vote-box-{position} {{
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 4px;
            text-align: center;
            font-weight: bold;
            color: #333;
            font-size: 11px;
        }}
        .vote-label-{position} {{
            font-size: 9px;
            color: #666;
            font-weight: bold;
            display: inline;
        }}
        .vote-value-{position} {{
            font-size: 12px;
            color: #333;
            font-weight: normal;
            display: inline;
        }}
        .vote-grid-{position} {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }}
        .vote-box-{position} {{
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            color: #333;
        }}
        </style>
        """, unsafe_allow_html=True)
        
        # Card container
        st.markdown(f'<div class="candidate-card-{position}">', unsafe_allow_html=True)
        
        # Header
        st.markdown(f'<div class="card-header-{position}">{candidate_name.upper()} - Flat {flat_no}</div>', unsafe_allow_html=True)
        
        # Body
        st.markdown(f'<div class="card-body-{position}">', unsafe_allow_html=True)
        
        # Create two columns for layout
        col1, col2 = st.columns([1, 2])
        
        with col1:
            # Profile photo area
            st.markdown(f'<div class="profile-photo-{position}">{initials}</div>', unsafe_allow_html=True)
        
        with col2:
            # Total Count and Value with flat info
            st.markdown(f"**Total Count:** {int(total_votes)} (Flat {flat_no})")
            st.markdown(f"**Total Value:** {total_value}")
            
            # Vote grid with label:value format for compact layout
            st.markdown(f"""
            <div style="margin-top: 5px;">
                <!-- First row -->
                <div class="vote-grid-{position}">
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">920:</span>
                        <span class="vote-value-{position}">{int(v920)}</span>
                    </div>
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">1005:</span>
                        <span class="vote-value-{position}">{int(v1005)}</span>
                    </div>
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">1165:</span>
                        <span class="vote-value-{position}">{int(v1165)}</span>
                    </div>
                </div>
                <!-- Second row -->
                <div class="vote-grid-{position}">
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">1285:</span>
                        <span class="vote-value-{position}">{int(v1285)}</span>
                    </div>
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">1670:</span>
                        <span class="vote-value-{position}">{int(v1670)}</span>
                    </div>
                    <div class="vote-box-{position}">
                        <span class="vote-label-{position}">-</span>
                        <span class="vote-value-{position}">-</span>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Close body and card containers
        st.markdown('</div></div>', unsafe_allow_html=True)

def main():
    # Main header
    st.markdown('<h1 class="main-header">🏆 EC Results Live Dashboard 2025-2026</h1>', unsafe_allow_html=True)
    
    # Sidebar for configuration
    st.sidebar.title("⚙️ Configuration")
    
    # Projector mode toggle
    projector_mode = st.sidebar.checkbox("🎥 Projector Mode", value=True, help="Optimize for projector display")
    
    # Auto-refresh configuration
    refresh_interval = st.sidebar.slider("⏰ Auto-refresh interval (minutes)", min_value=1, max_value=10, value=5, help="How often to automatically refresh data")
    
    # Data source selection
    data_source = st.sidebar.selectbox(
        "Select Data Source",
        ["Google Sheets", "Excel File"],
        help="Choose whether to connect to Google Sheets or use local Excel file"
    )
    
    current_data = None
    
    if data_source == "Google Sheets":
        st.sidebar.subheader("🔗 Google Sheets Connection")
        
        # Google Sheets configuration
        credentials_file = st.sidebar.file_uploader(
            "Upload Service Account JSON",
            type=['json'],
            help="Upload your Google Service Account JSON file"
        )
        
        spreadsheet_url = st.sidebar.text_input(
            "Google Sheets URL",
            placeholder="https://docs.google.com/spreadsheets/d/...",
            help="Paste your Google Sheets URL here"
        )
        
        if credentials_file and spreadsheet_url:
            # Save uploaded file temporarily
            with open("temp_credentials.json", "w") as f:
                f.write(credentials_file.getvalue().decode())
            
            # Load data
            current_data = load_google_sheets_data("temp_credentials.json", spreadsheet_url)
            
            # Clean up
            os.remove("temp_credentials.json")
            
            if current_data is not None:
                st.sidebar.markdown('<div class="status-indicator connected">✅ Connected to Google Sheets</div>', unsafe_allow_html=True)
            else:
                st.sidebar.markdown('<div class="status-indicator disconnected">❌ Connection Failed</div>', unsafe_allow_html=True)
        else:
            st.sidebar.warning("Please upload credentials and provide Google Sheets URL")
    
    else:  # Excel File
        st.sidebar.subheader("📁 Excel File")
        
        uploaded_file = st.sidebar.file_uploader(
            "Upload Excel File",
            type=['xlsx', 'xls'],
            help="Upload your Excel file with candidate data"
        )
        
        if uploaded_file is not None:
            # Save uploaded file temporarily
            with open("temp_file.xlsx", "wb") as f:
                f.write(uploaded_file.getvalue())
            
            # Load data
            current_data = load_excel_data("temp_file.xlsx")
            
            # Clean up
            os.remove("temp_file.xlsx")
            
            if current_data is not None:
                st.sidebar.markdown('<div class="status-indicator connected">✅ Excel file loaded successfully</div>', unsafe_allow_html=True)
            else:
                st.sidebar.markdown('<div class="status-indicator disconnected">❌ Failed to load Excel file</div>', unsafe_allow_html=True)
        else:
            st.sidebar.warning("Please upload an Excel file")
    
    # Main content area
    if current_data is not None:
        # Wrap in page container to prevent scrolling
        st.markdown('<div class="page-container">', unsafe_allow_html=True)
        # Calculate position changes
        position_changes = calculate_position_changes(current_data, st.session_state.previous_data)
        
        # Check if it's time for auto-refresh
        now = datetime.now()
        if now >= st.session_state.next_refresh_time:
            # Auto-refresh
            st.session_state.previous_data = current_data.copy()
            st.session_state.last_refresh = now.strftime("%Y-%m-%d %H:%M:%S")
            st.session_state.next_refresh_time = now + timedelta(minutes=refresh_interval)
            st.rerun()
        
        # Sort by Total Vote Value (primary), then Total Vote Count (secondary) in descending order
        if 'Total Vote Value' in current_data.columns:
            current_data = current_data.sort_values(
                by=['Total Vote Value', 'Total Vote Count'] if 'Total Vote Count' in current_data.columns else ['Total Vote Value'],
                ascending=False
            ).reset_index(drop=True)
        
        
        # Create 3 columns using st.columns
        col1, col2, col3 = st.columns(3)
        
        # Display candidates in 3 columns and 7 rows (21 max)
        for idx, (_, row) in enumerate(current_data.iterrows()):
            if idx >= 21:  # Limit to 21 candidates (3x7 grid)
                break
                
            candidate_name = row.get('Candidate Name', f'Candidate {idx+1}')
            image_url = row.get('Image', None)  # Get image URL if available
            
            # Determine position change
            change = position_changes.get(candidate_name, 'same')
            
            # Determine which column to use (0, 1, or 2)
            col_idx = idx % 3
            
            # Display candidate card in appropriate column
            if col_idx == 0:
                with col1:
                    display_candidate_card(
                        candidate_name=candidate_name,
                        position=idx + 1,
                        row_data=row,
                        change=change,
                        image_url=image_url
                    )
            elif col_idx == 1:
                with col2:
                    display_candidate_card(
                        candidate_name=candidate_name,
                        position=idx + 1,
                        row_data=row,
                        change=change,
                        image_url=image_url
                    )
            else:  # col_idx == 2
                with col3:
                    display_candidate_card(
                        candidate_name=candidate_name,
                        position=idx + 1,
                        row_data=row,
                        change=change,
                        image_url=image_url
                    )
        
        # Store current data for next comparison
        if st.session_state.previous_data is None:
            st.session_state.previous_data = current_data.copy()
            st.session_state.last_refresh = now.strftime("%Y-%m-%d %H:%M:%S")
            st.session_state.next_refresh_time = now + timedelta(minutes=refresh_interval)
        
        # Close page container
        st.markdown('</div>', unsafe_allow_html=True)
        
    else:
        st.warning("⚠️ Please configure your data source in the sidebar to view results.")
        
        # Show sample data structure
        st.subheader("📋 Expected Data Structure")
        st.markdown("""
        Your data should have the following columns:
        - **Candidate Name**: Name of the candidate
        - **Tower**: Tower/Block information (ASTER, ZINNIA, ORCHID, TULIP)
        - **Flat#**: Flat number
        - **920, 1005, 1165, 1285, 1670**: Vote counts from each booth
        - **Total Vote Count**: Sum of all booth votes
        - **Total Vote Value**: Total vote value in rupees
        - **Image**: Image URL for candidate photo (optional)
        
        The data will be automatically sorted by Total Vote Count in descending order.
        """)

if __name__ == "__main__":
    main()
