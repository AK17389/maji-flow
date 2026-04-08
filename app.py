# ============================================================
# Maji Flow - Smart Water Management System
# Flask Backend - app.py
#
# Run with: python app.py
# ============================================================

from flask import (
    Flask, render_template, request, redirect,
    url_for, session, jsonify, flash
)
from functools import wraps
import os
import random
import string
from datetime import datetime

# ============================================================
# App Configuration
# ============================================================
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'maji-flow-secret-key-2024')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# ============================================================
# Demo Users (hardcoded as per requirements)
# In production: replace with database (SQLAlchemy + PostgreSQL)
# ============================================================
USERS = {
    'resident@majiflow.co.zm': {
        'password': 'water123',
        'role': 'resident',
        'name': 'Chanda Mwale',
        'account_number': 'MF-2024-0042',
        'meter_number': 'MTR-LK-1198',
        'balance': 125.50,
        'zone': 'Lusaka East',
    },
    'utility@lwsc.co.zm': {
        'password': 'lwsc2026',
        'role': 'utility',
        'name': 'Ngosa Banda',
        'zone': 'All Zones',
    },
}

# ============================================================
# Mock kiosk data (simulates database / IoT sensor feed)
# ============================================================
KIOSKS = [
    {'id': 'K001', 'name': 'Kalingalinga Kiosk A', 'location': 'Kalingalinga Market',
     'zone': 'Lusaka East', 'status': 'online', 'flow_rate': 12.4,
     'pressure': 2.8, 'daily_volume': 14880, 'last_updated': '2 min ago'},
    {'id': 'K002', 'name': 'Matero Main Kiosk', 'location': 'Matero Township',
     'zone': 'Lusaka West', 'status': 'online', 'flow_rate': 9.8,
     'pressure': 2.6, 'daily_volume': 11760, 'last_updated': '1 min ago'},
    {'id': 'K003', 'name': 'Chawama Kiosk 1', 'location': 'Chawama Compound',
     'zone': 'Lusaka South', 'status': 'maintenance', 'flow_rate': 0,
     'pressure': 0, 'daily_volume': 0, 'last_updated': '3 hrs ago'},
    {'id': 'K004', 'name': 'Kanyama North Kiosk', 'location': 'Kanyama Township',
     'zone': 'Lusaka West', 'status': 'online', 'flow_rate': 11.2,
     'pressure': 2.9, 'daily_volume': 13440, 'last_updated': '5 min ago'},
    {'id': 'K005', 'name': 'Chelstone Kiosk', 'location': 'Chelstone Road',
     'zone': 'Lusaka East', 'status': 'online', 'flow_rate': 8.6,
     'pressure': 2.5, 'daily_volume': 10320, 'last_updated': '3 min ago'},
    {'id': 'K006', 'name': 'Mtendere Kiosk B', 'location': 'Mtendere East',
     'zone': 'Lusaka East', 'status': 'offline', 'flow_rate': 0,
     'pressure': 0, 'daily_volume': 0, 'last_updated': '2 hrs ago'},
    {'id': 'K007', 'name': "Ng'ombe Kiosk", 'location': "Ng'ombe Compound",
     'zone': 'Lusaka North', 'status': 'online', 'flow_rate': 10.1,
     'pressure': 2.7, 'daily_volume': 12120, 'last_updated': '1 min ago'},
    {'id': 'K008', 'name': 'Misisi Kiosk', 'location': 'Misisi Compound',
     'zone': 'Lusaka South', 'status': 'online', 'flow_rate': 7.9,
     'pressure': 2.4, 'daily_volume': 9480, 'last_updated': '4 min ago'},
]

# ============================================================
# Auth Decorators (Role-based access control)
# ============================================================
def login_required(f):
    """Redirect to login if user is not authenticated."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_email' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


def role_required(role):
    """Restrict access to a specific user role."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if 'user_email' not in session:
                return redirect(url_for('login'))
            user = USERS.get(session['user_email'])
            if not user or user['role'] != role:
                flash('Access denied: insufficient permissions.', 'error')
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated
    return decorator


# ============================================================
# Helper: get current user from session
# ============================================================
def get_current_user():
    email = session.get('user_email')
    if email and email in USERS:
        user = USERS[email].copy()
        user['email'] = email
        return user
    return None


# ============================================================
# ROUTES
# ============================================================

# GET / → Landing page (index.html)
@app.route('/')
def index():
    user = get_current_user()
    if user:
        # Already logged in - redirect to correct dashboard
        if user['role'] == 'utility':
            return redirect(url_for('utility_dashboard'))
        return redirect(url_for('resident_dashboard'))
    return render_template('index.html')


# GET /login → Show login form
# POST /login → Process login
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Already logged in
    user = get_current_user()
    if user:
        return redirect(url_for('resident_dashboard' if user['role'] == 'resident' else 'utility_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        # Validate credentials
        user_data = USERS.get(email)
        if user_data and user_data['password'] == password:
            # Create session
            session['user_email'] = email
            session['user_role'] = user_data['role']
            session['user_name'] = user_data['name']

            # Role-based redirect
            if user_data['role'] == 'utility':
                return redirect(url_for('utility_dashboard'))
            return redirect(url_for('resident_dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'error')

    return render_template('login.html')


# GET /register → Show registration form
# POST /register → Process registration
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm = request.form.get('confirm_password', '')
        role = request.form.get('role', 'resident')

        # Validation
        if not name or not email or not password:
            flash('All fields are required.', 'error')
            return render_template('register.html')

        if password != confirm:
            flash('Passwords do not match.', 'error')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'error')
            return render_template('register.html')

        if email in USERS:
            flash('An account with this email already exists.', 'error')
            return render_template('register.html')

        # Create new user (in production: save to DB)
        USERS[email] = {
            'password': password,
            'role': role,
            'name': name,
            'account_number': f'MF-2024-{random.randint(1000, 9999)}',
            'meter_number': f'MTR-LK-{random.randint(1000, 9999)}',
            'balance': 0.0,
            'zone': 'Lusaka Central',
        }

        # Auto-login after registration
        session['user_email'] = email
        session['user_role'] = role
        session['user_name'] = name

        flash(f'Welcome to Maji Flow, {name}!', 'success')
        return redirect(url_for('utility_dashboard' if role == 'utility' else 'resident_dashboard'))

    return render_template('register.html')


# GET /logout → Clear session and redirect to home
@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))


# GET /dashboard → Resident dashboard (protected)
@app.route('/dashboard')
@login_required
@role_required('resident')
def resident_dashboard():
    user = get_current_user()
    # Get nearby kiosks for this user's zone
    nearby_kiosks = [k for k in KIOSKS if k['zone'] == user.get('zone', '')]
    return render_template(
        'resident_dashboard.html',
        user=user,
        kiosks=nearby_kiosks[:4],
    )


# GET /utility → Utility dashboard (protected, utility role only)
@app.route('/utility')
@login_required
@role_required('utility')
def utility_dashboard():
    user = get_current_user()
    active_kiosks = [k for k in KIOSKS if k['status'] == 'online']
    return render_template(
        'utility_dashboard.html',
        user=user,
        kiosks=KIOSKS,
        active_count=len(active_kiosks),
        total_count=len(KIOSKS),
    )


# ============================================================
# API ENDPOINTS
# ============================================================

# POST /api/topup → Add water credits to resident account
@app.route('/api/topup', methods=['POST'])
@login_required
def api_topup():
    """Simulate adding water credit to a resident's account."""
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    amount = data.get('amount')
    method = data.get('method', 'mobile_money')

    # Validate amount
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'Invalid amount'}), 400

    if amount < 5:
        return jsonify({'success': False, 'error': 'Minimum top-up is ZMW 5.00'}), 400

    if amount > 500:
        return jsonify({'success': False, 'error': 'Maximum top-up is ZMW 500.00'}), 400

    # Update balance in session (in production: update DB)
    email = session.get('user_email')
    if email in USERS:
        USERS[email]['balance'] = USERS[email].get('balance', 0) + amount

    # Generate transaction reference
    reference = 'MF' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))

    return jsonify({
        'success': True,
        'message': f'ZMW {amount:.2f} added successfully',
        'new_balance': USERS[email]['balance'],
        'credits_added': amount,
        'reference': reference,
        'method': method,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    })


# GET /api/kiosks → Return all kiosk data as JSON
@app.route('/api/kiosks')
@login_required
def api_kiosks():
    """Return kiosk network data. Simulates real-time IoT sensor feed."""
    # Add slight random variation to simulate live data
    live_kiosks = []
    for k in KIOSKS:
        kiosk = k.copy()
        if k['status'] == 'online':
            kiosk['flow_rate'] = round(k['flow_rate'] + random.uniform(-0.3, 0.3), 1)
            kiosk['pressure'] = round(k['pressure'] + random.uniform(-0.05, 0.05), 2)
        live_kiosks.append(kiosk)

    return jsonify({
        'success': True,
        'count': len(live_kiosks),
        'kiosks': live_kiosks,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    })


# GET /api/network-stats → Return network statistics
@app.route('/api/network-stats')
@login_required
def api_network_stats():
    """Return aggregated network statistics for the utility dashboard."""
    active = [k for k in KIOSKS if k['status'] == 'online']
    offline = [k for k in KIOSKS if k['status'] == 'offline']
    maintenance = [k for k in KIOSKS if k['status'] == 'maintenance']

    # Calculate aggregates
    total_volume = sum(k['daily_volume'] for k in active)
    avg_pressure = round(sum(k['pressure'] for k in active) / len(active), 2) if active else 0
    avg_flow = round(sum(k['flow_rate'] for k in active) / len(active), 1) if active else 0

    return jsonify({
        'success': True,
        'total_kiosks': len(KIOSKS),
        'active_kiosks': len(active),
        'offline_kiosks': len(offline),
        'maintenance_kiosks': len(maintenance),
        'total_daily_volume': total_volume + random.randint(-500, 500),
        'avg_pressure': avg_pressure,
        'avg_flow_rate': avg_flow,
        'water_quality_index': 94,
        'network_efficiency': round((len(active) / len(KIOSKS)) * 100, 1),
        'alerts': [
            {'id': 'ALT001', 'type': 'warning', 'message': 'Low pressure detected',
             'location': 'Chelstone Kiosk', 'timestamp': '14:32', 'resolved': False},
            {'id': 'ALT002', 'type': 'error', 'message': 'Kiosk offline - no signal',
             'location': 'Mtendere Kiosk B', 'timestamp': '12:15', 'resolved': False},
            {'id': 'ALT003', 'type': 'warning', 'message': 'Scheduled maintenance in progress',
             'location': 'Chawama Kiosk 1', 'timestamp': '09:00', 'resolved': False},
        ],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    })


# ============================================================
# Run the app
# ============================================================
if __name__ == '__main__':
    print('\n' + '='*50)
    print(' Maji Flow - Smart Water Management System')
    print('='*50)
    print(' Running at: http://127.0.0.1:5000')
    print(' Demo Users:')
    print('   Resident: resident@majiflow.co.zm / water123')
    print('   Utility:  utility@lwsc.co.zm / lwsc2026')
    print('='*50 + '\n')
    app.run(debug=True, host='0.0.0.0', port=5000)
