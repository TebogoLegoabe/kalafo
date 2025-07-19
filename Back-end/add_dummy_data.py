# add_dummy_data.py - Fixed to work with any doctor
from app import app, db, User, Consultation
from datetime import datetime, timedelta
import random

def add_dummy_data():
    with app.app_context():
        print("🔄 Adding dummy data for doctor dashboard...")
        
        # Get the doctor you're logged in as (Tebogo)
        tebogo_doctor = User.query.filter_by(email='tebogo@kalafo.com').first()
        
        if tebogo_doctor:
            doctor = tebogo_doctor
            print(f"👨‍⚕️ Using logged-in doctor: {doctor.first_name} {doctor.last_name}")
        else:
            # Fallback to original sample doctor
            doctor = User.query.filter_by(role='doctor').first()
            if not doctor:
                print("❌ No doctor found! Please run init_db.py first")
                return
            print(f"👨‍⚕️ Using sample doctor: {doctor.first_name} {doctor.last_name}")
        
        # Get existing patient
        existing_patient = User.query.filter_by(role='patient').first()
        
        # Create additional dummy patients
        dummy_patients = [
            {
                'email': 'alice.johnson@email.com',
                'first_name': 'Alice',
                'last_name': 'Johnson',
                'password': 'patient123'
            },
            {
                'email': 'bob.williams@email.com', 
                'first_name': 'Bob',
                'last_name': 'Williams',
                'password': 'patient123'
            },
            {
                'email': 'carol.brown@email.com',
                'first_name': 'Carol', 
                'last_name': 'Brown',
                'password': 'patient123'
            },
            {
                'email': 'david.wilson@email.com',
                'first_name': 'David',
                'last_name': 'Wilson', 
                'password': 'patient123'
            },
            {
                'email': 'emma.davis@email.com',
                'first_name': 'Emma',
                'last_name': 'Davis',
                'password': 'patient123'
            }
        ]
        
        # Add patients if they don't exist
        patients = []
        if existing_patient:
            patients.append(existing_patient)
            
        for patient_data in dummy_patients:
            existing = User.query.filter_by(email=patient_data['email']).first()
            if not existing:
                patient = User(
                    email=patient_data['email'],
                    role='patient',
                    first_name=patient_data['first_name'],
                    last_name=patient_data['last_name']
                )
                patient.set_password(patient_data['password'])
                db.session.add(patient)
                patients.append(patient)
                print(f"👤 Created patient: {patient.first_name} {patient.last_name}")
            else:
                patients.append(existing)
                print(f"👤 Using existing patient: {existing.first_name} {existing.last_name}")
        
        # Commit patients first
        db.session.commit()
        
        # Delete existing consultations for this doctor to avoid duplicates
        existing_consultations = Consultation.query.filter_by(doctor_id=doctor.id).all()
        for consultation in existing_consultations:
            db.session.delete(consultation)
        
        print(f"🗑️  Cleared {len(existing_consultations)} existing consultations for {doctor.first_name}")
        
        # Create dummy consultations
        print("📅 Creating dummy consultations...")
        
        # Get current time
        now = datetime.now()
        
        # Create upcoming consultations (future)
        upcoming_consultations = [
            {
                'patient': patients[0],
                'scheduled_time': now + timedelta(hours=2),
                'status': 'scheduled',
                'notes': 'Regular checkup - patient reports feeling well'
            },
            {
                'patient': patients[1], 
                'scheduled_time': now + timedelta(days=1, hours=9),
                'status': 'scheduled',
                'notes': 'Follow-up consultation for blood pressure monitoring'
            },
            {
                'patient': patients[2],
                'scheduled_time': now + timedelta(days=1, hours=14),
                'status': 'scheduled', 
                'notes': 'Initial consultation for new patient'
            },
            {
                'patient': patients[3],
                'scheduled_time': now + timedelta(days=2, hours=10),
                'status': 'scheduled',
                'notes': 'Prescription renewal and health review'
            },
            {
                'patient': patients[4],
                'scheduled_time': now + timedelta(days=3, hours=11),
                'status': 'scheduled',
                'notes': 'Consultation for chronic condition management'
            },
            {
                'patient': patients[0],
                'scheduled_time': now + timedelta(days=4, hours=15),
                'status': 'scheduled',
                'notes': 'Routine wellness examination'
            }
        ]
        
        # Create past consultations (completed)
        past_consultations = [
            {
                'patient': patients[1],
                'scheduled_time': now - timedelta(days=1, hours=2),
                'status': 'completed',
                'notes': 'Patient complained of headaches. Recommended rest and hydration.',
                'diagnosis': 'Tension headache - stress related'
            },
            {
                'patient': patients[2],
                'scheduled_time': now - timedelta(days=3, hours=5),
                'status': 'completed', 
                'notes': 'Annual physical examination completed. All vitals normal.',
                'diagnosis': 'Annual physical - normal results'
            },
            {
                'patient': patients[3],
                'scheduled_time': now - timedelta(days=7, hours=3),
                'status': 'completed',
                'notes': 'Patient had flu symptoms. Prescribed rest and medication.',
                'diagnosis': 'Viral infection - flu symptoms'
            },
            {
                'patient': patients[4],
                'scheduled_time': now - timedelta(days=10, hours=1),
                'status': 'completed',
                'notes': 'Follow-up for diabetes management. Blood sugar levels stable.',
                'diagnosis': 'Type 2 diabetes - well controlled'
            },
            {
                'patient': patients[0],
                'scheduled_time': now - timedelta(days=14, hours=4),
                'status': 'completed',
                'notes': 'Skin condition examination. Prescribed topical treatment.',
                'diagnosis': 'Eczema - mild case'
            }
        ]
        
        # Add upcoming consultations
        for consult_data in upcoming_consultations:
            consultation = Consultation(
                patient_id=consult_data['patient'].id,
                doctor_id=doctor.id,  # Use the current doctor's ID
                scheduled_time=consult_data['scheduled_time'],
                status=consult_data['status'],
                notes=consult_data['notes']
            )
            db.session.add(consultation)
            
        # Add past consultations
        for consult_data in past_consultations:
            consultation = Consultation(
                patient_id=consult_data['patient'].id,
                doctor_id=doctor.id,  # Use the current doctor's ID
                scheduled_time=consult_data['scheduled_time'],
                status=consult_data['status'],
                notes=consult_data['notes'],
                diagnosis=consult_data.get('diagnosis', '')
            )
            db.session.add(consultation)
            
        # Commit all changes
        db.session.commit()
        
        print("✅ Dummy data added successfully!")
        print(f"📊 Created {len(upcoming_consultations)} upcoming consultations")
        print(f"📋 Created {len(past_consultations)} completed consultations") 
        print(f"👥 Total patients: {len(patients)}")
        print(f"👨‍⚕️ All consultations assigned to: {doctor.first_name} {doctor.last_name}")
        print()
        print("🎯 Dashboard should now show:")
        print(f"   - Upcoming Today: {len([c for c in upcoming_consultations if c['scheduled_time'].date() == now.date()])}")
        print(f"   - Total Patients: {len(patients)}")
        print(f"   - This Week: {len([c for c in upcoming_consultations if c['scheduled_time'] <= now + timedelta(days=7)])}")

if __name__ == '__main__':
    add_dummy_data()