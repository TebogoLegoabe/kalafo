from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
import bcrypt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import traceback

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
         "https://*.vercel.app"   
     ],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True
)

# User Model
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

# Consultation Model
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
            'patient_name': f"{self.patient.first_name} {self.patient.last_name}",
            'doctor_name': f"Dr. {self.doctor.first_name} {self.doctor.last_name}",
            'scheduled_time': self.scheduled_time.isoformat(),
            'status': self.status,
            'notes': self.notes,
            'diagnosis': self.diagnosis,
            'created_at': self.created_at.isoformat()
        }

# Routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Validate role
        if data['role'] not in ['admin', 'doctor', 'patient']:
            return jsonify({'error': 'Invalid role'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            role=data['role'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ REGISTER ERROR: {str(e)}")
        print(f"❌ REGISTER TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        print(f"🔄 LOGIN REQUEST RECEIVED")
        data = request.get_json()
        print(f"📧 LOGIN DATA: {data}")
        
        if not data.get('email') or not data.get('password'):
            print("❌ Missing email or password")
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        print(f"👤 USER FOUND: {user.email if user else 'None'}")
        
        if not user or not user.check_password(data['password']):
            print("❌ Invalid credentials")
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            print("❌ Account deactivated")
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Create access token with STRING identity (FIXED!)
        access_token = create_access_token(
            identity=str(user.id),  # Convert to string to fix JWT issue
            additional_claims={
                'role': user.role,
                'email': user.email
            }
        )
        
        print(f"✅ LOGIN SUCCESS: {user.email} (Role: {user.role})")
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ LOGIN ERROR: {str(e)}")
        print(f"❌ LOGIN TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/admin', methods=['GET'])
@jwt_required()
def admin_dashboard():
    try:
        print(f"🔄 ADMIN DASHBOARD REQUEST RECEIVED")
        
        # Get current user from JWT (convert string back to int)
        current_user_id = int(get_jwt_identity())
        print(f"👤 CURRENT USER ID: {current_user_id}")
        
        user = User.query.get(current_user_id)
        print(f"👤 USER FOUND: {user.email if user else 'None'}")
        print(f"👤 USER ROLE: {user.role if user else 'None'}")
        
        if not user:
            print("❌ User not found")
            return jsonify({'error': 'User not found'}), 404
        
        if user.role != 'admin':
            print(f"❌ Access denied. User role: {user.role}")
            return jsonify({'error': 'Admin access required'}), 403
        
        print("📊 Getting dashboard statistics...")
        
        # Get dashboard statistics
        total_doctors = User.query.filter_by(role='doctor').count()
        print(f"👨‍⚕️ Total doctors: {total_doctors}")
        
        total_patients = User.query.filter_by(role='patient').count()
        print(f"🏥 Total patients: {total_patients}")
        
        total_consultations = Consultation.query.count()
        print(f"📅 Total consultations: {total_consultations}")
        
        active_consultations = Consultation.query.filter_by(status='scheduled').count()
        print(f"⏰ Active consultations: {active_consultations}")
        
        # Get recent activity (last 10 consultations)
        print("📋 Getting recent consultations...")
        recent_consultations = Consultation.query.order_by(Consultation.created_at.desc()).limit(10).all()
        print(f"📋 Recent consultations count: {len(recent_consultations)}")
        
        recent_consultations_data = []
        for consultation in recent_consultations:
            try:
                recent_consultations_data.append(consultation.to_dict())
            except Exception as e:
                print(f"❌ Error processing consultation {consultation.id}: {str(e)}")
        
        response_data = {
            'stats': {
                'total_doctors': total_doctors,
                'total_patients': total_patients,
                'total_consultations': total_consultations,
                'active_consultations': active_consultations
            },
            'recent_consultations': recent_consultations_data
        }
        
        print(f"✅ ADMIN DASHBOARD SUCCESS: {response_data}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ ADMIN DASHBOARD ERROR: {str(e)}")
        print(f"❌ ADMIN DASHBOARD TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

# REMOVED THE DUPLICATE @token_required ENDPOINT - THIS WAS THE PROBLEM!

@app.route('/api/dashboard/patient', methods=['GET'])
@jwt_required()
def patient_dashboard():
    try:
        print(f"🔄 PATIENT DASHBOARD REQUEST RECEIVED")
        
        current_user_id = int(get_jwt_identity())
        print(f"👤 CURRENT USER ID: {current_user_id}")
        
        user = User.query.get(current_user_id)
        print(f"👤 USER FOUND: {user.email if user else 'None'}")
        print(f"👤 USER ROLE: {user.role if user else 'None'}")
        
        if not user:
            print("❌ User not found")
            return jsonify({'error': 'User not found'}), 404
        
        if user.role != 'patient':
            print(f"❌ Access denied. User role: {user.role}")
            return jsonify({'error': 'Patient access required'}), 403
        
        # Get patient's consultations
        print("📅 Getting patient consultations...")
        
        upcoming_consultations = Consultation.query.filter_by(
            patient_id=current_user_id,
            status='scheduled'
        ).order_by(Consultation.scheduled_time.asc()).all()
        print(f"⏰ Upcoming consultations: {len(upcoming_consultations)}")
        
        past_consultations = Consultation.query.filter_by(
            patient_id=current_user_id,
            status='completed'
        ).order_by(Consultation.scheduled_time.desc()).all()
        print(f"📋 Past consultations: {len(past_consultations)}")
        
        upcoming_data = []
        for consultation in upcoming_consultations:
            try:
                upcoming_data.append(consultation.to_dict())
            except Exception as e:
                print(f"❌ Error processing upcoming consultation {consultation.id}: {str(e)}")
        
        past_data = []
        for consultation in past_consultations:
            try:
                past_data.append(consultation.to_dict())
            except Exception as e:
                print(f"❌ Error processing past consultation {consultation.id}: {str(e)}")
        
        response_data = {
            'upcoming_consultations': upcoming_data,
            'past_consultations': past_data,
            'patient_info': user.to_dict()
        }
        
        print(f"✅ PATIENT DASHBOARD SUCCESS: {response_data}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ PATIENT DASHBOARD ERROR: {str(e)}")
        print(f"❌ PATIENT DASHBOARD TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/doctor', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    try:
        print(f"🔄 DOCTOR DASHBOARD REQUEST RECEIVED")
        
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        if user.role != 'doctor':
            return jsonify({'error': 'Doctor access required'}), 403
        
        # Get doctor's consultations
        upcoming_consultations = Consultation.query.filter_by(
            doctor_id=current_user_id,
            status='scheduled'
        ).order_by(Consultation.scheduled_time.asc()).all()
        
        completed_consultations = Consultation.query.filter_by(
            doctor_id=current_user_id,
            status='completed'
        ).order_by(Consultation.scheduled_time.desc()).limit(10).all()
        
        print(f"✅ DOCTOR DASHBOARD SUCCESS")
        return jsonify({
            'upcoming_consultations': [consultation.to_dict() for consultation in upcoming_consultations],
            'recent_consultations': [consultation.to_dict() for consultation in completed_consultations],
            'doctor_info': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ DOCTOR DASHBOARD ERROR: {str(e)}")
        print(f"❌ DOCTOR DASHBOARD TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        print(f"❌ GET USERS ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        # Allow doctors and admins to view patients
        if user.role not in ['doctor', 'admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get all patients
        patients = User.query.filter_by(role='patient').all()
        
        patients_data = []
        for patient in patients:
            # Get consultation count for each patient
            consultation_count = Consultation.query.filter_by(patient_id=patient.id).count()
            last_consultation = Consultation.query.filter_by(
                patient_id=patient.id
            ).order_by(Consultation.scheduled_time.desc()).first()
            
            patient_info = patient.to_dict()
            patient_info['consultation_count'] = consultation_count
            patient_info['last_consultation'] = last_consultation.scheduled_time.isoformat() if last_consultation else None
            patients_data.append(patient_info)
        
        return jsonify({
            'patients': patients_data,
            'total_count': len(patients_data)
        }), 200
        
    except Exception as e:
        print(f"❌ GET PATIENTS ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test-jwt', methods=['GET'])
@jwt_required()
def test_jwt():
    try:
        print(f"🔄 JWT TEST REQUEST RECEIVED")
        current_user_id = int(get_jwt_identity())
        print(f"👤 JWT USER ID: {current_user_id}")
        
        # Get additional claims
        claims = get_jwt()
        print(f"🎫 JWT CLAIMS: {claims}")
        
        return jsonify({
            'success': True,
            'user_id': current_user_id,
            'claims': claims
        }), 200
        
    except Exception as e:
        print(f"❌ JWT TEST ERROR: {str(e)}")
        print(f"❌ JWT TEST TRACEBACK: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test-no-jwt', methods=['GET'])
def test_no_jwt():
    print(f"✅ NO JWT TEST - This endpoint works!")
    return jsonify({'message': 'This endpoint works without JWT'}), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Kalafo API is running'}), 200


@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        print(f"❌ /api/me ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Production configuration for Render
def create_app():
    # Create tables when app starts
    with app.app_context():
        db.create_all()
        print("✅ Database tables ensured")
    return app

# For production deployment
if __name__ == '__main__':
    # Create tables when app starts
    with app.app_context():
        db.create_all()
        print("✅ Database tables ensured")
    
    # Use environment PORT for production
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)