from flask import Flask, jsonify, render_template_string
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from auth import auth_bp
from config import supabase

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = "super-secret-key"

# Enable CORS for all routes (allows frontend to communicate with backend)
CORS(app, resources={r"/*": {"origins": "*"}})

jwt = JWTManager(app)

app.register_blueprint(auth_bp)

# ==================== ROOT ROUTES ====================

@app.route("/", methods=["GET"])
def home():
    """Backend homepage - shows status and data"""
    try:
        users_response = supabase.table("users").select("*").execute()
        users_count = len(users_response.data) if users_response.data else 0
        
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>School Uniform Business - Backend Dashboard</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .container {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    padding: 40px;
                    max-width: 800px;
                    width: 100%;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 20px;
                }
                h1 { 
                    color: #333;
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                .status {
                    display: inline-block;
                    background: #22c55e;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: bold;
                }
                .stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 30px 0;
                }
                .stat-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }
                .stat-number {
                    font-size: 36px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .stat-label {
                    font-size: 14px;
                    opacity: 0.9;
                }
                .endpoints {
                    background: #f5f5f5;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .endpoint {
                    background: white;
                    padding: 12px;
                    margin: 10px 0;
                    border-left: 4px solid #667eea;
                    border-radius: 4px;
                    font-family: monospace;
                }
                .button {
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin: 5px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                }
                .button:hover { background: #764ba2; }
                .button-group {
                    text-align: center;
                    margin: 20px 0;
                }
                .success { color: #22c55e; }
                .info { color: #3b82f6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 School Uniform Business</h1>
                    <h2 style="color: #666; font-size: 16px; font-weight: normal;">Backend API Dashboard</h2>
                    <span class="status">✓ Running</span>
                </div>
                
                <div class="stats">
                    <div class="stat-box">
                        <div class="stat-label">Total Users</div>
                        <div class="stat-number">""" + str(users_count) + """</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Database</div>
                        <div class="stat-number" style="font-size: 20px;">Supabase</div>
                    </div>
                </div>
                
                <div class="endpoints">
                    <h3 style="margin-bottom: 15px;">📡 Available API Endpoints:</h3>
                    <div class="endpoint"><span class="info">POST</span> /register - Create new user</div>
                    <div class="endpoint"><span class="info">POST</span> /login - User login (get JWT)</div>
                    <div class="endpoint"><span class="info">GET</span> /api/users - View all users</div>
                </div>
                
                <div class="button-group">
                    <a href="/api/users" class="button">View All Users</a>
                    <a href="/api/status" class="button">API Status</a>
                </div>
                
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #3b82f6;">
                    <h4 style="margin-bottom: 10px; color: #0369a1;">📝 Test Login:</h4>
                    <p style="font-size: 13px; color: #666;">
                        <strong>Email:</strong> sarver@gmail.com<br>
                        <strong>Password:</strong> (Try any password - backend validates it)<br>
                        <br>
                        <strong>Other test emails:</strong><br>
                        - gs@gmail.com<br>
                        - testuser@example.com
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return render_template_string(html)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/users", methods=["GET"])
def get_users():
    """Get all users from database"""
    try:
        response = supabase.table("users").select("*").execute()
        users = response.data if response.data else []
        
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Users Database</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f5f5f5;
                    padding: 20px;
                }
                .container { max-width: 1200px; margin: 0 auto; }
                h1 { color: #333; margin-bottom: 10px; }
                .stats { 
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }
                td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #eee;
                }
                tr:hover { background: #f9f9f9; }
                .role-super { background: #dbeafe; color: #0c4a6e; padding: 4px 8px; border-radius: 4px; }
                .role-clothes { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; }
                .password { font-family: monospace; font-size: 11px; color: #999; }
                a { color: #667eea; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 User Database</h1>
                <div class="stats">
                    <strong>Total Users:</strong> """ + str(len(users)) + """
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Password (Hashed)</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
        """
        
        if len(users) == 0:
            html += "<tr><td colspan='6' style='text-align:center; padding: 30px;'>No users found</td></tr>"
        else:
            for user in users:
                role_class = "role-super" if user.get('role') == 'super_admin' else "role-clothes"
                role_text = user.get('role', 'N/A').replace('_', ' ').title()
                created = user.get('created_at', 'N/A')[:10]
                
                html += f"""
                    <tr>
                        <td>{user.get('id', 'N/A')[:8]}...</td>
                        <td>{user.get('name', 'N/A')}</td>
                        <td>{user.get('email', 'N/A')}</td>
                        <td><span class="{role_class}">{role_text}</span></td>
                        <td><span class="password">{user.get('password', 'N/A')[:20]}...</span></td>
                        <td>{created}</td>
                    </tr>
                """
        
        html += """
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="/" style="background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">← Back to Dashboard</a>
                </div>
            </div>
        </body>
        </html>
        """
        return render_template_string(html)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/status", methods=["GET"])
def api_status():
    """API status check"""
    try:
        users_response = supabase.table("users").select("*").execute()
        users_count = len(users_response.data) if users_response.data else 0
        
        return jsonify({
            "status": "running",
            "backend": "Flask",
            "database": "Supabase",
            "users_count": users_count,
            "endpoints": {
                "register": "POST /register",
                "login": "POST /login",
                "get_users": "GET /api/users",
                "status": "GET /api/status",
                "dashboard": "GET /"
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
