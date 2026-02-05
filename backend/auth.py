from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from config import supabase
from roles import role_required
import bcrypt

# --------------------
# Blueprint
# --------------------
auth_bp = Blueprint("auth", __name__)

# --------------------
# REGISTER (use once)
# --------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    # Check if email already exists
    existing_user = supabase.table("users") \
        .select("id") \
        .eq("email", data["email"]) \
        .execute()
    
    if existing_user.data:
        return jsonify({"msg": "Email already exists - you already signed up now sign in"}), 400

    hashed_password = bcrypt.hashpw(
        data["password"].encode(),
        bcrypt.gensalt()
    )

    try:
        supabase.table("users").insert({
            "name": data["name"],
            "email": data["email"],
            "password": hashed_password.decode(),
            "role": data["role"]   # super_admin / clothes_admin
        }).execute()
    except Exception as e:
        return jsonify({"msg": "Registration failed: " + str(e)}), 400

    return jsonify({"msg": "User registered successfully"}), 201


# --------------------
# LOGIN
# --------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    result = supabase.table("users") \
        .select("*") \
        .eq("email", data["email"]) \
        .execute()

    if not result.data:
        return jsonify({"msg": "User not found - first sign up"}), 401

    user = result.data[0]

    if not bcrypt.checkpw(
        data["password"].encode(),
        user["password"].encode()
    ):
        return jsonify({"msg": "Invalid password"}), 401

    access_token = create_access_token(identity={
        "id": user["id"],
        "role": user["role"]
    })

    return jsonify({
        "token": access_token,
        "role": user["role"]
    }), 200


# --------------------
# PROTECTED ROUTE
# --------------------
@auth_bp.route("/clothes/dashboard", methods=["GET"])
@role_required("clothes_admin")
def clothes_dashboard():
    return jsonify({"msg": "Welcome Clothes Admin"}), 200
