"""
app.py — Maji-Flow Flask Server
================================
Run with:  python app.py
Visits:    http://localhost:5000
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from functools import wraps
import json
import os

app = Flask(__name__)
app.secret_key = "majiflow-secret-key-change-in-production"

# ── Simulated in-memory user store (replace with DB in production) ──
USERS = {
    "resident@majiflow.co.zm": {
        "password": "water123",
        "name": "Chanda Mutale",
        "type": "resident",
        "balance_litres": 847,
        "zone": "Matero",
    },
    "utility@lwsc.co.zm": {
        "password": "lwsc2026",
        "name": "LWSC Admin",
        "type": "utility",
        "organisation": "Lusaka Water and Sanitation Company",
    },
}

# ── Simulated kiosk data ──
KIOSKS = [
    {"id": "K02", "name": "Matero Kiosk 02",   "status": "active",      "distance_km": 0.3,  "lat": -15.4166, "lng": 28.2833},
    {"id": "K05", "name": "Chelstone Hub",      "status": "active",      "distance_km": 1.1,  "lat": -15.3900, "lng": 28.3533},
    {"id": "K09", "name": "Northmead Point",    "status": "maintenance", "distance_km": 2.4,  "lat": -15.3800, "lng": 28.3200},
    {"id": "K11", "name": "Woodlands Kiosk 11", "status": "active",      "distance_km": 3.1,  "lat": -15.4000, "lng": 28.3900},
    {"id": "K04", "name": "Matero Kiosk 04",    "status": "alert",       "distance_km": 0.8,  "lat": -15.4100, "lng": 28.2850},
]

# ── Network stats ──
NETWORK_STATS = {
    "efficiency": 91.4,
    "active_kiosks": 14,
    "alert_kiosks": 1,
    "low_flow_kiosks": 1,
    "zones": [
        {"name": "Matero",    "consumption_pct": 87},
        {"name": "Chelstone", "consumption_pct": 72},
        {"name": "Northmead", "consumption_pct": 61},
        {"name": "Woodlands", "consumption_pct": 54},
        {"name": "Kabulonga", "consumption_pct": 44},
    ],
    "alerts": [
        {"level": "danger",  "title": "High Flow Anomaly",      "body": "Kiosk 04, Matero — possible main pipe breach. Flagged 08:47 AM."},
        {"level": "warning", "title": "Low Pressure Warning",   "body": "Kiosk 09, Northmead — pressure below threshold. Crew dispatched."},
    ],
}


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_email" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


# ════════════════════════════════
# PUBLIC ROUTES
# ════════════════════════════════

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        email    = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "").strip()
        user = USERS.get(email)
        if user and user["password"] == password:
            session["user_email"] = email
            session["user_name"]  = user["name"]
            session["user_type"]  = user["type"]
            if user["type"] == "utility":
                return redirect(url_for("utility_dashboard"))
            return redirect(url_for("resident_dashboard"))
        error = "Invalid email or password. Please try again."
    return render_template("login.html", error=error)


@app.route("/register", methods=["GET", "POST"])
def register():
    success = None
    error   = None
    if request.method == "POST":
        name      = request.form.get("name", "").strip()
        email     = request.form.get("email", "").strip().lower()
        phone     = request.form.get("phone", "").strip()
        password  = request.form.get("password", "").strip()
        user_type = request.form.get("user_type", "resident")
        org       = request.form.get("organisation", "").strip()

        if email in USERS:
            error = "An account with this email already exists."
        elif not name or not password:
            error = "Please fill in all required fields."
        else:
            USERS[email] = {
                "password": password,
                "name": name,
                "type": user_type,
                "balance_litres": 0 if user_type == "resident" else None,
                "zone": "Lusaka",
                "organisation": org,
                "phone": phone,
            }
            success = f"Account created for {name}. You can now log in."
    return render_template("register.html", success=success, error=error)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


# ════════════════════════════════
# PROTECTED ROUTES
# ════════════════════════════════

@app.route("/dashboard/resident")
@login_required
def resident_dashboard():
    if session.get("user_type") != "resident":
        return redirect(url_for("utility_dashboard"))
    user  = USERS[session["user_email"]]
    return render_template("resident_dashboard.html", user=user, kiosks=KIOSKS)


@app.route("/dashboard/utility")
@login_required
def utility_dashboard():
    if session.get("user_type") != "utility":
        return redirect(url_for("resident_dashboard"))
    user = USERS[session["user_email"]]
    return render_template("utility_dashboard.html", user=user, stats=NETWORK_STATS)


# ── API endpoints (JSON) ──

@app.route("/api/kiosks")
@login_required
def api_kiosks():
    return jsonify(KIOSKS)


@app.route("/api/topup", methods=["POST"])
@login_required
def api_topup():
    data   = request.get_json()
    amount = float(data.get("amount_zmw", 0))
    litres = round(amount * 18.8)          # ZMW → litres conversion rate
    email  = session["user_email"]
    if email in USERS and USERS[email]["type"] == "resident":
        USERS[email]["balance_litres"] = USERS[email].get("balance_litres", 0) + litres
        return jsonify({"success": True, "litres_added": litres, "new_balance": USERS[email]["balance_litres"]})
    return jsonify({"success": False, "error": "Not a resident account"}), 400


@app.route("/api/network-stats")
@login_required
def api_network_stats():
    return jsonify(NETWORK_STATS)


# ════════════════════════════════

if __name__ == "__main__":
    print("\n🚀  Maji-Flow server starting...")
    print("    Visit: http://localhost:5000\n")
    print("    Demo accounts:")
    print("    Resident → resident@majiflow.co.zm / water123")
    print("    Utility  → utility@lwsc.co.zm      / lwsc2026\n")
    app.run(debug=True, port=5000)
