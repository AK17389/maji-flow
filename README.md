# Maji-Flow — Server Version

Smart Water Management for Sustainable Zambian Cities.

## Setup & Run

```bash
# 1. Install Flask
pip install -r requirements.txt

# 2. Run the server
python app.py

# 3. Open your browser
#    http://localhost:5000
```

## Demo Accounts

| Role     | Email                        | Password  |
|----------|------------------------------|-----------|
| Resident | resident@majiflow.co.zm      | water123  |
| Utility  | utility@lwsc.co.zm           | lwsc2026  |

## Project Structure

```
maji-flow/
├── app.py                          # Flask server + routes + API
├── requirements.txt                # Python dependencies (Flask only)
├── templates/
│   ├── base.html                   # Shared navbar + footer
│   ├── index.html                  # Homepage
│   ├── login.html                  # Login page
│   ├── register.html               # Registration page
│   ├── resident_dashboard.html     # Resident portal
│   └── utility_dashboard.html     # Utility ops center
└── static/
    ├── css/main.css                # All styles
    └── js/main.js                  # Animations + interactivity
```

## API Endpoints

| Method | Route              | Description                  |
|--------|--------------------|------------------------------|
| GET    | /                  | Homepage                     |
| GET    | /login             | Login page                   |
| POST   | /login             | Authenticate user            |
| GET    | /register          | Registration page            |
| POST   | /register          | Create new account           |
| GET    | /logout            | Clear session                |
| GET    | /dashboard/resident| Resident portal (protected)  |
| GET    | /dashboard/utility | Utility dashboard (protected)|
| POST   | /api/topup         | Add water credits (JSON)     |
| GET    | /api/kiosks        | List all kiosks (JSON)       |
| GET    | /api/network-stats | Network data (JSON)          |
