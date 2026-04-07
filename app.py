"""
Maji Flow - Smart Water Management System
Flask Backend Application
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from functools import wraps
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = "majiflow-secret-key-2026"  # Change this in production

# ---------------------------------------------------------------------------
# Demo Users (hardcoded for prototype)
# ---------------------------------------------------------------------------
USERS = {
    "resident@majiflow.co.zm": {
        "password": "water123",
        "role": "resident",
        "name": "Chanda Mutale",
        "account_number": "MF-2024-00142",
        "balance": 45.50,
        "usage_today": 12.3,
        "usage_month": 340.8,
    },
    "utility@lwsc.co.zm": {
        "password": "lwsc2026",
        "role": "utility",
        "name": "LWSC Admin",
        "account_number": "LWSC-ADMIN-001",
    },
}

# ---------------------------------------------------------------------------
# Sample data for API endpoints
# ---------------------------------------------------------------------------
KIOSKS = [
    {"id": "K001", "name": "Mtendere Kiosk", "location": "Mtendere East", "status": "online",  "pressure": 3.2, "flow_rate": 18.5, "last_updated": "2026-04-07 08:12"},
    {"id": "K002", "name": "Chawama Kiosk",  "location": "Chawama",       "status": "online",  "pressure": 2.9, "flow_rate": 15.1, "last_updated": "2026-04-07 08:10"},
    {"id": "K003", "name": "Kanyama Kiosk",  "location": "Kanyama",       "status": "offline", "pressure": 0.0, "flow_rate": 0.0,  "last_updated": "2026-04-07 07:45"},
    {"id": "K004", "name": "Bauleni Kiosk",  "location": "Bauleni",       "status": "online",  "pressure": 3.5, "flow_rate": 21.0, "last_updated": "2026-04-07 08:14"},
    {"id": "K005", "name": "Chelstone Kiosk","location": "Chelstone",     "status": "warning", "pressure": 1.8, "flow_rate": 8.2,  "last_updated": "2026-04-07 08:00"},
]

USAGE_HISTORY = [
    {"day": "Mon", "usage": 28.4},
    {"day": "Tue", "usage": 31.2},
    {"day": "Wed", "usage": 27.8},
    {"day": "Thu", "usage": 33.5},
    {"day": "Fri", "usage": 29.1},
    {"day": "Sat", "usage": 35.6},
    {"day": "Sun", "usage": 22.3},
]

# ---------------------------------------------------------------------------
# Auth helpers / decorators
# ---------------------------------------------------------------------------

def login_required(f):
    """Redirect to login if user is not authenticated."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_email" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


def role_required(role):
    """Restrict a route to a specific role."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if "user_email" not in session:
                return redirect(url_for("login"))
            if session.get("user_role") != role:
                return redirect(url_for("home"))
            return f(*args, **kwargs)
        return decorated
    return decorator


# ---------------------------------------------------------------------------
# Page routes
# ---------------------------------------------------------------------------

@app.route("/")
def home():
    """Landing page — redirect logged-in users to their dashboard."""
    if "user_email" in session:
        if session["user_role"] == "resident":
            return redirect(url_for("resident_dashboard"))
        return redirect(url_for("utility_dashboard"))
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Handle login form submission."""
    error = None

    if request.method == "POST":
        email    = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = USERS.get(email)
        if user and user["password"] == password:
            # Store safe user info in session
            session["user_email"] = email
            session["user_role"]  = user["role"]
            session["user_name"]  = user["name"]

            if user["role"] == "resident":
                return redirect(url_for("resident_dashboard"))
            return redirect(url_for("utility_dashboard"))
        else:
            error = "Invalid email or password. Please try again."

    return render_template("login.html", error=error)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Simple registration page (mock — does not persist data)."""
    success = None
    error   = None

    if request.method == "POST":
        name     = request.form.get("name", "").strip()
        email    = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        role     = request.form.get("role", "resident")

        if not name or not email or not password:
            error = "All fields are required."
        elif email in USERS:
            error = "An account with this email already exists."
        else:
            # In a real app, save to database. Here we just confirm.
            success = f"Account created for {name}! You can now log in with the demo credentials."

    return render_template("register.html", success=success, error=error)


@app.route("/logout")
def logout():
    """Clear session and redirect to home."""
    session.clear()
    return redirect(url_for("home"))


@app.route("/resident")
@role_required("resident")
def resident_dashboard():
    """Resident dashboard — shows personal water usage & balance."""
    user = USERS[session["user_email"]]
    return render_template(
        "resident_dashboard.html",
        user=user,
        usage_history=USAGE_HISTORY,
    )


@app.route("/utility")
@role_required("utility")
def utility_dashboard():
    """Utility dashboard — shows network-wide stats & kiosk map."""
    online  = sum(1 for k in KIOSKS if k["status"] == "online")
    offline = sum(1 for k in KIOSKS if k["status"] == "offline")
    warning = sum(1 for k in KIOSKS if k["status"] == "warning")
    return render_template(
        "utility_dashboard.html",
        kiosks=KIOSKS,
        online=online,
        offline=offline,
        warning=warning,
        total=len(KIOSKS),
    )


# ---------------------------------------------------------------------------
# API endpoints
# ---------------------------------------------------------------------------

@app.route("/api/topup", methods=["POST"])
@login_required
def api_topup():
    """Simulate adding water credit to a resident account."""
    data   = request.get_json(silent=True) or {}
    amount = float(data.get("amount", 0))

    if amount <= 0:
        return jsonify({"success": False, "message": "Amount must be greater than 0."}), 400

    email = session["user_email"]
    if email in USERS and "balance" in USERS[email]:
        USERS[email]["balance"] = round(USERS[email]["balance"] + amount, 2)
        new_balance = USERS[email]["balance"]
        return jsonify({
            "success": True,
            "message": f"Successfully topped up K{amount:.2f}.",
            "new_balance": new_balance,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

    return jsonify({"success": False, "message": "Top-up not available for this account."}), 403


@app.route("/api/kiosks")
@login_required
def api_kiosks():
    """Return all kiosk data as JSON."""
    # Slightly randomise live readings to simulate real-time data
    live = []
    for k in KIOSKS:
        entry = dict(k)
        if entry["status"] == "online":
            entry["pressure"]  = round(entry["pressure"]  + random.uniform(-0.2, 0.2), 2)
            entry["flow_rate"] = round(entry["flow_rate"] + random.uniform(-1.0, 1.0), 1)
        entry["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        live.append(entry)
    return jsonify({"success": True, "kiosks": live})


@app.route("/api/network-stats")
@login_required
def api_network_stats():
    """Return high-level network statistics as JSON."""
    online_count = sum(1 for k in KIOSKS if k["status"] == "online")
    stats = {
        "success": True,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_kiosks": len(KIOSKS),
        "online_kiosks": online_count,
        "offline_kiosks": sum(1 for k in KIOSKS if k["status"] == "offline"),
        "warning_kiosks": sum(1 for k in KIOSKS if k["status"] == "warning"),
        "avg_pressure_bar": round(
            sum(k["pressure"] for k in KIOSKS if k["status"] == "online") / max(online_count, 1), 2
        ),
        "total_flow_lpm": round(
            sum(k["flow_rate"] for k in KIOSKS if k["status"] == "online"), 1
        ),
        "daily_distribution_m3": round(random.uniform(820, 950), 1),
        "network_uptime_pct": round((online_count / len(KIOSKS)) * 100, 1),
        "alerts": [
            {"level": "warning", "message": "Chelstone Kiosk: Low pressure detected", "time": "08:00"},
            {"level": "info",    "message": "Kanyama Kiosk: Scheduled maintenance",   "time": "07:45"},
        ],
    }
    return jsonify(stats)


@app.route("/api/usage-history")
@login_required
def api_usage_history():
    """Return weekly usage history for the logged-in resident."""
    return jsonify({"success": True, "history": USAGE_HISTORY})


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
