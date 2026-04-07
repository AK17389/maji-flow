# 💧 Maji Flow — Smart Water Management System

A Flask web application for smart water management in Lusaka, Zambia.
Built for LWSC (Lusaka Water & Sewerage Company) community tech initiative.

---

## 📁 Project Structure

```
maji-flow/
├── app.py                        # Flask backend (routes, API, auth)
├── requirements.txt              # Python dependencies
├── README.md
│
├── templates/                    # Jinja2 HTML templates
│   ├── base.html                 # Shared layout (navbar, footer)
│   ├── index.html                # Landing page
│   ├── login.html                # Login form
│   ├── register.html             # Registration form
│   ├── resident_dashboard.html   # Resident portal
│   └── utility_dashboard.html   # Utility ops dashboard
│
└── static/
    ├── css/
    │   └── main.css              # All styles
    └── js/
        └── main.js               # Shared JS utilities
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.8+ installed
- pip available

### Steps

```bash
# 1. Clone or navigate to the project folder
cd maji-flow

# 2. Create a virtual environment (recommended)
python -m venv venv

# Activate it:
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open your browser at: **http://127.0.0.1:5000**

---

## 🔑 Demo Credentials

| Role     | Email                       | Password  |
|----------|-----------------------------|-----------|
| Resident | resident@majiflow.co.zm     | water123  |
| Utility  | utility@lwsc.co.zm          | lwsc2026  |

---

## 📡 API Endpoints

All endpoints require an active session (logged in).

| Method | Endpoint              | Description                         |
|--------|-----------------------|-------------------------------------|
| POST   | `/api/topup`          | Add water credit `{"amount": 20}`   |
| GET    | `/api/kiosks`         | Returns live kiosk JSON data        |
| GET    | `/api/network-stats`  | Returns network health stats        |
| GET    | `/api/usage-history`  | Returns resident's weekly usage     |

---

## 🌐 Deploying to GitHub + Render (Free)

### Step 1: Push to GitHub

```bash
# In the project root
git init
git add .
git commit -m "Initial Maji Flow release"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/maji-flow.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render.com (free tier)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
4. Add to `requirements.txt`: `gunicorn==22.0.0`
5. Click **Deploy**

> ⚠️ Change `app.secret_key` to a strong random string before deploying to production.

---

## 🔒 Security Notes (for production)

- Replace hardcoded users with a real database (SQLite + SQLAlchemy)
- Use `werkzeug.security.generate_password_hash` for passwords
- Set `SECRET_KEY` as an environment variable
- Enable HTTPS (Render handles this automatically)

---

Built with ❤️ using Flask · Python · HTML/CSS/JS
