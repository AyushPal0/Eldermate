]# 🧓 Eldermate

**Eldermate** is a community-powered platform that connects elderly individuals who need day-to-day assistance with young adults willing to offer help. Built for compassion, accessibility, and impact, Eldermate aims to bridge the generational gap through meaningful service and technology.

---

## 📌 Table of Contents

- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [⚙️ Installation](#️-installation)
- [📂 Project Structure](#-project-structure)
- [💻 Usage](#-usage)
- [🔒 Environment Variables](#-environment-variables)
- [📈 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Authors](#-authors)

---

## 🚀 Features

- 👵 Elder and Volunteer user roles with secure login
- 📋 Request and fulfill task-based assistance
- 💬 Real-time or scheduled communication
- 🎙️ Voice support for accessibility (WIP)
- 📍 Location-aware task filtering
- 📦 Scalable backend with modular API routes

---

## 🛠 Tech Stack

| Layer        | Tech                           |
|--------------|--------------------------------|
| Frontend     | React.js, Tailwind CSS, Vite   |
| Backend      | Python (Flask), Beanie ODM     |
| Database     | CockroachDB                    |
| Voice Support| Web Speech API / Custom STT    |
| Hosting      | Vercel (Frontend), Render/Fly.io (Backend) |
| Versioning   | Git & GitHub                   |

---

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/AyushPal0/Eldermate.git
cd Eldermate
Install backend dependencies

bash
Copy
Edit
cd backend
pip install -r requirements.txt
Install frontend dependencies

bash
Copy
Edit
cd ../frontend
npm install
Run the app

Backend (Flask)

bash
Copy
Edit
python app.py
Frontend (React)

bash
Copy
Edit
npm run dev
📂 Project Structure
bash
Copy
Edit
Eldermate/
├── frontend/             # React-based frontend
│   └── src/
│       └── components/
├── backend/              # Flask backend with Beanie ODM
│   ├── models/
│   ├── routes/
│   ├── utils/
├── blockchain_routes.py  # Optional blockchain-based features
├── README.md
└── .env                  # Environment variables
💻 Usage
Elders can:

Sign up and request help

Track responses from volunteers

Communicate via chat/voice

Volunteers can:

Browse nearby requests

Offer help and manage accepted tasks

Maintain history of contributions

🔒 Environment Variables
Create a .env file in both /backend and /frontend folders and add:

env
Copy
Edit
# Backend
DATABASE_URL="your_cockroachdb_url"
JWT_SECRET="your_jwt_secret"

# Frontend (Vite)
VITE_BACKEND_URL="http://localhost:5000"
📈 Roadmap
 Basic user flows

 Role-based authentication

 Voice command support

 Volunteer recommendation system

 Blockchain integration for proof-of-help

🤝 Contributing
We welcome contributions from everyone!
To get started:

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -am 'feat: add new feature')

Push to the branch (git push origin feature-name)

Create a Pull Request

Please follow the Contributor's Guide and code of conduct.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for more details.

👥 Authors
Ayush Pal – GitHub

Amogh Sharma – GitHub

