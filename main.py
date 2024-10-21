from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Secret key for session
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Simple database for storing users

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User model for database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

# Initialize the database
@app.before_request
def create_tables():
    db.create_all()

# Route for home page
@app.route('/')
def home():
    if 'username' in session:
        return render_template('index.html')
    return redirect(url_for('login'))

# Route for login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            session['username'] = username
            return jsonify({"success": True})
        return jsonify({"success": False})
    return render_template('login.html')  # Optional: To render login page if needed

# Route for registration
# Route for registration
@app.route('/register', methods=['GET','POST'])
def register():
    data = request.get_json()
    logging.debug(f"Request method: {request.method}")

    if data['password'] != data['confirmPassword']:
        return jsonify({"success": False, "message": "Passwords do not match."})

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(first_name=data['firstName'], last_name=data['lastName'], email=data['email'],
                phone=data['phone'], username=data['username'], password=hashed_password)

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        print(e)  # Print error to console for debugging
        return jsonify({"success": False, "message": "Registration failed."})
# Logout route
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)