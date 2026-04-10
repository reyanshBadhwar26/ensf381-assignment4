"""
Group Members:
1. Reyansh Badhwar (UCID: 30244010)
2. Abdelrahman Attia (UCID: 30240604)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import re


app = Flask(__name__)
CORS(app)

user_database = []

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"})
    
    errors = []
    if len(username) < 3 or len(username) > 20:
        errors.append("Username must be between 3 and 20 characters")

    if not username[0].isalpha():
        errors.append("Username must start with a letter")

    if not re.match(r'^[A-Za-z0-9_-]+$', username):
        errors.append("Username can only contain letters, numbers, underscores, and hyphens")

    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        errors.append("Email must be in a valid format (e.g., example@email.com)")
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")

    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")

    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")

    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        errors.append("Password must contain at least one special character")

    if errors:
        return jsonify({"success": False, "message": " | ".join(errors)})
    
    for user in user_database:
        if user['username'] == username:
            return jsonify({"success": False, "message": "Username is already taken"})
        if user['email'] == email:
            return jsonify({"success": False, "message": "Email is already registered"})

    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    user_database.append({
        "id": len(user_database) + 1,
        "username": username,
        "email": email,
        "password_hash": hashed_password
    })

    return jsonify({"success": True, "message": "Registration successful"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    message = {
        "success" : False, 
        "message" : "Invalid username or password."
    }

    for user in user_database:
        if user["username"] == username:
            if bcrypt.checkpw(password, user["password_hash"]):
                message = {
                    "success" : True, 
                    "message" : "Login successful.", 
                    "userId" : user["id"], 
                    "username" : user["username"]
                }

    return jsonify(message)

@app.route('/reviews', methods=['GET'])
def get_reviews():
    pass

@app.route('/flavors', methods=['GET'])
def get_flavors():
    pass



if __name__ == '__main__':
    app.run()






   

    
