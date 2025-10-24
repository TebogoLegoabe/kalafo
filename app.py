from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
import bcrypt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///kalafo.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

CORS(app,
    origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://kalafo.com",
        "https://www.kalafo.com",
        "https://kalafo.vercel.app",
        "https://*.vercel.app"
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

# Models

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='patient')  # admin, doctor, patient
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
       self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
       return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
       return {
          'id': self.id,
          'email': self.email,
          'role': self.role,
          'first_name': self.first_name,
          'last_name': self.last_name,
          'created_at': self.created_at.isoformat(),
          'is_active': self.is_active
       }


class Consultation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    notes = db.Column(db.Text)
    diagnosis = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship('User', foreign_keys=[patient_id], backref='patient_consultations')
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='doctor_consultations')

    def to_dict(self):
       return {
          'id': self.id,
          'patient_id': self.patient_id,
          'doctor_id': self.doctor_id,
          'patient_name': f"{self.patient.first_name} {self.patient.last_name}" if self.patient else None,
          'doctor_name': f"Dr. {self.doctor.first_name} {self.doctor.last_name}" if self.doctor else None,
          'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
          'status': self.status,
          'notes': self.notes,
          'diagnosis': self.diagnosis,
          'created_at': self.created_at.isoformat() if self.created_at else None
       }

# Helpers

def get_current_user():
    identity = get_jwt_identity()
    try:
       user_id = int(identity)
    except (TypeError, ValueError):
       user_id = None
    if user_id is None:
       return None
    return User.query.get(user_id)

def role_required(*allowed_roles):
    def decorator(fn):
       @wraps(fn)
       @jwt_required()
       def wrapper(*args, **kwargs):
          user = get_current_user()
          if not user:
             return jsonify({'error': 'User not found'}), 404
          if user.role not in allowed_roles:
             return jsonify({'error': 'Access denied'}), 403
          return fn(user, *args, **kwargs)
       return wrapper
    return decorator

# Routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
       data = request.get_json() or {}
       required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
       if not all(field in data for field in required_fields):
          return jsonify({'error': 'Missing required fields'}), 400

       if data['role'] not in ['admin', 'doctor', 'patient']:
          return jsonify({'error': 'Invalid role'}), 400

       if User.query.filter_by(email=data['email']).first():
          return jsonify({'error': 'Email already registered'}), 400

       user = User(
          email=data['email'],
          role=data['role'],
          first_name=data['first_name'],
          last_name=data['last_name']
       )
       user.set_password(data['password'])
       db.session.add(user)
       db.session.commit()
       return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201
    except Exception:
       db.session.rollback()
       app.logger.exception("Register error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
       data = request.get_json() or {}
       email = data.get('email')
       password = data.get('password')
       if not email or not password:
          return jsonify({'error': 'Email and password required'}), 400

       user = User.query.filter_by(email=email).first()
       if not user or not user.check_password(password):
          return jsonify({'error': 'Invalid email or password'}), 401
       if not user.is_active:
          return jsonify({'error': 'Account is deactivated'}), 401

       access_token = create_access_token(
          identity=str(user.id),  # keep as string for compatibility
          additional_claims={'role': user.role, 'email': user.email}
       )
       return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200
    except Exception:
       app.logger.exception("Login error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/dashboard/admin', methods=['GET'])
@role_required('admin')
def admin_dashboard(current_user):
    try:
       total_doctors = User.query.filter_by(role='doctor').count()
       total_patients = User.query.filter_by(role='patient').count()
       total_consultations = Consultation.query.count()
       active_consultations = Consultation.query.filter_by(status='scheduled').count()

       recent_consultations = Consultation.query.order_by(Consultation.created_at.desc()).limit(10).all()
       recent_data = [c.to_dict() for c in recent_consultations]

       return jsonify({
          'stats': {
             'total_doctors': total_doctors,
             'total_patients': total_patients,
             'total_consultations': total_consultations,
             'active_consultations': active_consultations
          },
          'recent_consultations': recent_data
       }), 200
    except Exception:
       app.logger.exception("Admin dashboard error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/dashboard/patient', methods=['GET'])
@role_required('patient')
def patient_dashboard(current_user):
    try:
       upcoming = Consultation.query.filter_by(patient_id=current_user.id, status='scheduled') \
          .order_by(Consultation.scheduled_time.asc()).all()
       past = Consultation.query.filter_by(patient_id=current_user.id, status='completed') \
          .order_by(Consultation.scheduled_time.desc()).all()

       return jsonify({
          'upcoming_consultations': [c.to_dict() for c in upcoming],
          'past_consultations': [c.to_dict() for c in past],
          'patient_info': current_user.to_dict()
       }), 200
    except Exception:
       app.logger.exception("Patient dashboard error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/dashboard/doctor', methods=['GET'])
@role_required('doctor')
def doctor_dashboard(current_user):
    try:
       upcoming = Consultation.query.filter_by(doctor_id=current_user.id, status='scheduled') \
          .order_by(Consultation.scheduled_time.asc()).all()
       recent = Consultation.query.filter_by(doctor_id=current_user.id, status='completed') \
          .order_by(Consultation.scheduled_time.desc()).limit(10).all()

       return jsonify({
          'upcoming_consultations': [c.to_dict() for c in upcoming],
          'recent_consultations': [c.to_dict() for c in recent],
          'doctor_info': current_user.to_dict()
       }), 200
    except Exception:
       app.logger.exception("Doctor dashboard error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/users', methods=['GET'])
@role_required('admin')
def get_users(current_user):
    try:
       users = User.query.all()
       return jsonify({'users': [u.to_dict() for u in users]}), 200
    except Exception:
       app.logger.exception("Get users error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    try:
       current = get_current_user()
       if not current or current.role not in ['admin', 'doctor']:
          return jsonify({'error': 'Access denied'}), 403

       patients = User.query.filter_by(role='patient').all()
       data = []
       for p in patients:
          consultation_count = Consultation.query.filter_by(patient_id=p.id).count()
          last = Consultation.query.filter_by(patient_id=p.id).order_by(Consultation.scheduled_time.desc()).first()
          info = p.to_dict()
          info['consultation_count'] = consultation_count
          info['last_consultation'] = last.scheduled_time.isoformat() if last else None
          data.append(info)

       return jsonify({'patients': data, 'total_count': len(data)}), 200
    except Exception:
       app.logger.exception("Get patients error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/test-jwt', methods=['GET'])
@jwt_required()
def test_jwt():
    try:
       user = get_current_user()
       claims = get_jwt()
       return jsonify({'success': True, 'user_id': user.id if user else None, 'claims': claims}), 200
    except Exception:
       app.logger.exception("Test JWT error")
       return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/test-no-jwt', methods=['GET'])
def test_no_jwt():
    return jsonify({'message': 'This endpoint works without JWT'}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Kalafo API is running'}), 200

@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    try:
       user = get_current_user()
       if not user:
          return jsonify({'error': 'User not found'}), 404
       return jsonify(user.to_dict()), 200
    except Exception:
       app.logger.exception("/api/me error")
       return jsonify({'error': 'Internal server error'}), 500

# App factory and main

def create_app():
    with app.app_context():
       db.create_all()
       app.logger.info("Database tables ensured")
    return app

if __name__ == '__main__':
    with app.app_context():
       db.create_all()
       app.logger.info("Database tables ensured")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
