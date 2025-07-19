from app import app, db, User
from datetime import datetime

def init_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created")
        
        # Check if admin user already exists
        if User.query.filter_by(email='admin@kalafo.com').first():
            print("⚠️  Sample users already exist")
            return
        
        # Create sample admin user
        admin_user = User(
            email='admin@kalafo.com',
            role='admin',
            first_name='Admin',
            last_name='User'
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        
        # Create sample doctor
        doctor_user = User(
            email='doctor@kalafo.com',
            role='doctor',
            first_name='Dr.',
            last_name='Tebza'
        )
        doctor_user.set_password('doctor123')
        db.session.add(doctor_user)
        
        # Create sample patient
        patient_user = User(
            email='patient@kalafo.com',
            role='patient',
            first_name='karabo',
            last_name='Smith'
        )
        patient_user.set_password('patient123')
        db.session.add(patient_user)
        
        # Commit all changes
        db.session.commit()
        
        print("✅ Sample users created:")
        print("   Admin: admin@kalafo.com / admin123")
        print("   Doctor: doctor@kalafo.com / doctor123") 
        print("   Patient: patient@kalafo.com / patient123")

if __name__ == '__main__':
    init_database()