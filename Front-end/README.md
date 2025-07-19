# Kalafo Telemedicine Platform

A modern, full-stack telemedicine platform that connects patients with healthcare providers through secure remote consultations. Built with React frontend and Flask backend with role-based authentication and real-time dashboard management.

## 🌟 Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Doctor, Patient)
- **Protected routes** with automatic redirection
- **Password hashing** with bcrypt for security

### 👨‍⚕️ Role-Specific Dashboards

#### Admin Dashboard

- System overview with real-time statistics
- User management (doctors, patients)
- Consultation monitoring
- Recent activity tracking

#### Doctor Dashboard

- Upcoming consultation management
- Patient consultation history
- Schedule overview and management
- Quick action tools for appointment handling

#### Patient Dashboard

- Upcoming consultations view
- Medical history and records
- Health data tracking
- Appointment booking interface

### 🏥 Core Functionality

- **Secure consultation scheduling**
- **Medical record management**
- **Multi-role user system**
- **Real-time dashboard updates**
- **Responsive design** for all devices

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Context API** - State management
- **Fetch API** - HTTP client

### Backend

- **Flask** - Python web framework
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Lightweight database (development)
- **bcrypt** - Password hashing

### Development Tools

- **Python Virtual Environment** - Dependency isolation
- **npm** - Package management
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kalafo-telemedicine.git
cd kalafo-telemedicine
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd Back-end

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python init_db.py

# Start Flask server
python run.py
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd Front-end

# Install dependencies
npm install

# Start React development server
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔌 API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/health` - Service health check

### Dashboard APIs (Protected)

- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/doctor` - Doctor dashboard data
- `GET /api/dashboard/patient` - Patient dashboard data

### User Management

- `GET /api/users` - List all users (Admin only)

## 🏃‍♂️ Development Workflow

### Running in Development Mode

1. **Start Backend** (Terminal 1):

```bash
cd Back-end
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

2. **Start Frontend** (Terminal 2):

```bash
cd Front-end
npm start
```

### Database Management

**Reset Database:**

```bash
cd Back-end
rm kalafo.db
python init_db.py
```

### Frontend Configuration

- **API Base URL**: Configured in `AuthContext.js`
- **Routing**: Managed in `App.js`
- **Styling**: Tailwind CSS utilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**[To be updated :)]**

- GitHub: [](https://github.com/yourusername)
- Email:
- LinkedIn: [](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- **Flask Community** for excellent documentation
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful styling utilities
- **JWT.io** for authentication guidance

**⭐ If you find this project helpful, please give it a star on GitHub!**

---

_Last updated: July 2025_
