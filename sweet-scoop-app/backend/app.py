"""
Group Members:
1. Reyansh Badhwar (UCID: 30244010)
2. Abdelrahman Attia (UCID: 30240604)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import re
import json
import random 
from datetime import datetime

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
        return jsonify({"success": False, "message": "All fields are required"}), 400
    
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
        return jsonify({"success": False, "message": " | ".join(errors)}), 400
    
    for user in user_database:
        if user.get('username') == username:
            return jsonify({"success": False, "message": "Username is already taken"}), 400
        if user.get('email') == email:
            return jsonify({"success": False, "message": "Email is already registered"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user_database.append({
        "id": len(user_database) + 1,
        "username": username,
        "email": email,
        "password_hash": hashed_password,
        "cart" : [],
        "orders" : []
    })

    return jsonify({"success": True, "message": "Registration successful"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required."}), 400

    message = {
        "success" : False, 
        "message" : "Invalid username or password."
    }

    for user in user_database:
        if user.get("username") == username:
            if bcrypt.checkpw(password.encode('utf-8'), user.get("password_hash")):
                message = {
                    "success" : True, 
                    "message" : "Login successful.", 
                    "userId" : user.get("id"), 
                    "username" : user.get("username")
                }

                return jsonify(message), 200

    return jsonify(message), 400

@app.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = {}
    
    with open('reviews.json', 'r') as file:
        reviews = json.load(file)

    choose_samples = random.sample(reviews, 2)

    return jsonify({
        "success" : True,
        "message" : "Reviews loaded.",
        "reviews" : choose_samples,
    }), 200

@app.route('/flavors', methods=['GET'])
def get_flavors():
    flavors = {}
    
    with open('flavors.json', 'r') as file:
        flavors = json.load(file)

    return jsonify({
        "success" : True,
        "message" : "Flavors loaded.",
        "flavors" : flavors,
    }), 200

@app.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('userId')

    if user_id is None:
        return jsonify({"success": False, "message": "userId is required."}), 400

    for user in user_database:
        if user.get("id") == int(user_id):
            return jsonify({
                "success" : True,
                "message" : "Cart loaded.",
                "cart" : user.get("cart", [])
            }), 200
        
    return jsonify({"success": False, "message": "User does not exist."}), 404

@app.route('/cart', methods=['POST'])
def add_flavor():
    data = request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    all_flavors = []
    chosen_flavor = {}

    if user_id is None or flavor_id is None:
        return jsonify({"success": False, "message": "userId and flavorId are required."}), 400
    
    with open('flavors.json', 'r') as file:
        all_flavors = json.load(file)

    for flavor_data in all_flavors:
        if flavor_data.get("flavorId") == flavor_id:
            chosen_flavor = flavor_data
            break

    if not chosen_flavor:
        return jsonify({"success": False, "message": "Chosen flavor does not exist."}), 404

    for user_data in user_database:
        if user_data.get("id") == user_id:
            for cart_item in user_data.get("cart", []):
                if cart_item.get("flavorId") == flavor_id:
                    return jsonify({"success": False, "message": "Flavor is already in the cart. Use PUT /cart to update quantity."}), 400
            
            new_item = {
                "flavorId": chosen_flavor.get("flavorId"),
                "name": chosen_flavor.get("name"),
                "price": chosen_flavor.get("price"), 
                "quantity": 1
            }

            user_data.get("cart").append(new_item)
            return jsonify({"success": True, "message": "Flavor added to cart.", "cart": user_data.get("cart")}), 200

    return jsonify({"success": False, "message": "User does not exist."}), 404


@app.route('/cart', methods=['PUT'])
def update_quantity():
    data = request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    quantity = data.get('quantity')

    if user_id is None or flavor_id is None or quantity is None:
        return jsonify({"success": False, "message": "userId, flavorId, and quantity are required."}), 400
    
    if quantity < 1:
        return jsonify({"success": False, "message": "Quantity must be at least 1."}), 400
    
    for user_data in user_database:
        if user_data.get("id") == user_id:
            for cart_item in user_data.get("cart", []):
                if cart_item.get("flavorId") == flavor_id:
                    cart_item["quantity"] = quantity
                    return jsonify({"success": True, "message": "Cart updated successfully.", "cart": user_data.get("cart")}), 200
            
            return jsonify({"success": False, "message": "Flavor does not exist in the cart."}), 404

    return jsonify({"success": False, "message": "User does not exist."}), 404

@app.route('/cart', methods=['DELETE'])
def remove_flavor():
    data = request.get_json()
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')

    if user_id is None or flavor_id is None:
        return jsonify({"success": False, "message": "userId and flavorId are required."}), 400
    
    for user_data in user_database:
        if user_data.get("id") == user_id:
            for cart_item in user_data.get("cart", []):
                if cart_item.get("flavorId") == flavor_id:
                    user_data.get("cart").remove(cart_item)
                    return jsonify({"success": True, "message": "Flavor removed from cart.", "cart": user_data.get("cart")}), 200
            
            return jsonify({"success": False, "message": "Flavor does not exist in the cart."}), 404

    return jsonify({"success": False, "message": "User does not exist."}), 404

@app.route('/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get("userId")

    if user_id is None:
        return jsonify({"success": False, "message": "userId is required."}), 400

    for user_data in user_database:
        if user_data.get("id") == user_id:
            if not user_data.get("cart"):
                return jsonify({"success": False, "message": "Cart is empty. Cannot place order."}), 400
            
            orderId = len(user_data.get("orders")) + 1
            total = 0
            for item in user_data.get("cart"):
                total += item.get("price") * item.get("quantity")

            order = {
                "orderId": orderId,
                "items": [item.copy() for item in user_data.get("cart")],
                "total": total,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            user_data.get("orders").append(order)
            user_data["cart"] = []

            return jsonify({"success": True, "message": "Order placed successfully.", "orderId": orderId}), 200

    return jsonify({"success": False, "message": "User does not exist."}), 404

@app.route('/orders', methods=['GET'])
def get_orders():
    user_id = request.args.get('userId')

    if user_id is None:
        return jsonify({"success": False, "message": "userId is required."}), 400

    for user_data in user_database:
        if user_data.get("id") == int(user_id):
            return jsonify({
                "success" : True,
                "message" : "Order history loaded.",
                "orders" : user_data.get("orders", [])
            }), 200
        
    return jsonify({"success": False, "message": "User does not exist."}), 404

if __name__ == '__main__':
    app.run()