# run.py - Simple script to run the Flask application
from app import app

if __name__ == '__main__':
    print("🚀 Starting Kalafo Flask Backend")
    print("📍 Server running at: http://localhost:5000")
    print("🔗 API Health Check: http://localhost:5000/api/health")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(
        debug=True,
        host='127.0.0.1',
        port=5000
    )