import os
import time  # Added for mock API delays
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# -------------------------------
# 1. Environment & Configuration
# -------------------------------
print("🔄 Loading environment variables...")
found_env = load_dotenv(verbose=True)

if not found_env:
    print("⚠️  WARNING: No .env file found. Ensure GOOGLE_API_KEY is set.")
else:
    print("✅ .env file loaded successfully.")

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise Exception("❌ ERROR: GOOGLE_API_KEY not found in environment variables.")
else:
    print("✅ Found GOOGLE_API_KEY.")

# -------------------------------
# 2. Flask App Initialization
# -------------------------------
app = Flask(__name__)
CORS(app)
print("🚀 Flask server initialized with CORS enabled.")

# -------------------------------
# 3. Configure Google Generative AI
# -------------------------------
try:
    genai.configure(api_key=api_key)
    print("✅ Google Generative AI configured successfully.")
except Exception as e:
    print(f"❌ CRITICAL: Failed to configure Generative AI: {e}")
    raise

# -------------------------------
# 4. Model Setup and Prompt
# -------------------------------

# <-- FIX #1: The prompt is defined here
MEDICAL_PROMPT = """
You are "JoyDeb AI," a friendly, empathetic, and professional medical AI assistant from ForexCure.
Your primary purpose is to act as a preliminary symptom checker.

**Your instructions:**
1.  Always introduce yourself (JoyDeb AI from ForexCure) and ask how the user is feeling or what symptoms they are experiencing.
2.  Ask one clear, probing question at a time to gather more details about the symptoms. Examples: "How long have you had this symptom?", "Can you describe the pain?", "Is it constant or does it come and go?", "Do you have a fever?".
3.  Logically follow up on the user's answers to build a clearer picture of their condition.
4.  After gathering sufficient details (usually 3-5 exchanges), try to identify a potential disease or condition that might be related to the symptoms.
5.  **CRITICAL:** Immediately after stating any potential condition, you MUST provide a disclaimer.
    * **Disclaimer Example:** "Based on the symptoms you've described, one possibility could be [Potential Disease]. However, I am just an AI assistant and not a medical professional. This is not a diagnosis. It is very important that you consult a doctor or a qualified healthcare provider for an accurate diagnosis and treatment plan. Please do not rely on this for medical advice."
6.  If the user asks for a diagnosis directly, gently decline and remind them of your role, then continue to ask about symptoms or provide the disclaimer.
7.  Maintain a friendly, empathetic, and professional tone at all times.
"""

try:
    # <-- FIX #2: Set the prompt as a 'system_instruction'
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',  # Corrected from 2.0-flash
        system_instruction=MEDICAL_PROMPT
    )
    print("✅ Gemini model 'gemini-1.5-flash' initialized.")
except Exception as e:
    print(f"⚠️ 'gemini-1.5-flash' initialization failed: {e}")
    print("➡️ Falling back to 'gemini-pro'.")
    # <-- FIX #2: Also apply the system_instruction to the fallback
    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=MEDICAL_PROMPT
    )
    print("✅ Gemini model 'gemini-pro' initialized.")


# -------------------------------
# 5. MOCK DATABASE (NEW!)
# -------------------------------
# In a real app, this would be a SQL database (e.g., PostgreSQL, MySQL)
FAKE_DB = {
    "users": {
        # Hardcoded Patient User
        "patient@test.com": {
            "password": "password123",
            "role": "Patient",
            "name": "Test Patient"
        },
        # Hardcoded Organisation User
        "org@test.com": {
            "password": "password123",
            "role": "Organisation",
            "name": "Test Hospital Inc."
        }
    },
    "doctors": [
        {
            "id": 1,
            "name": "Dr. Emily White",
            "specialty": "Cardiology",
            "bio": "Dr. White has over 15 years of experience in cardiac care.",
            "org": "Test Hospital Inc.",
            "image": "https://images.unsplash.com/photo-1537368910025-70035079f17d?w=400"
        },
        {
            "id": 2,
            "name": "Dr. John Smith",
            "specialty": "Neurology",
            "bio": "Specialist in neurological disorders and stroke recovery.",
            "org": "Test Hospital Inc.",
            "image": "https://images.unsplash.com/photo-1622253692010-33352f90e0d5?w=400"
        }
    ],
    "products": [
        {
            "id": 101,
            "name": "Paracetamol 500mg (16 Pack)",
            "price": "5.99",
            "description": "For mild to moderate pain relief.",
            "org": "Test Hospital Inc.",
            "image": "https://images.unsplash.com/photo-1625760844743-40e830f5c1d6?w=400"
        },
        {
            "id": 102,
            "name": "Sterile Band-Aids (20 Pack)",
            "price": "3.49",
            "description": "Waterproof assorted sterile bandages.",
            "org": "Test Hospital Inc.",
            "image": "https://images.unsplash.com/photo-1606016159999-3e3f603c3e3c?w=400"
        }
    ],
    "blog_posts": [
        {
            "id": 1,
            "title": "The 5 Benefits of a Balanced Diet",
            "date": "October 28, 2025",
            "author": "Dr. Emily White",
            "excerpt": "A balanced diet is crucial for good health. It provides the nutrients your body needs to function effectively..."
        },
        {
            "id": 2,
            "title": "Understanding and Managing Stress",
            "date": "October 25, 2025",
            "author": "Dr. John Smith",
            "excerpt": "Stress is a normal part of life, but chronic stress can take a toll on your health. Learn to recognize the signs..."
        }
    ]
}


# -------------------------------
# 6. Chat Endpoint (Unchanged)
# -------------------------------
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "Empty request body"}), 400

        user_message = data.get('text')
        history_raw = data.get('history', [])

        if not user_message or not isinstance(user_message, str):
            return jsonify({"error": "Invalid or missing 'text' field"}), 400

        print(f"\n💬 Received user message: {user_message}")

        # Safely process chat history
        chat_history = []
        for message in history_raw:
            if isinstance(message, dict) and 'text' in message and 'sender' in message:
                role = "user" if message['sender'] == 'user' else "model"
                chat_history.append({
                    "role": role,
                    "parts": [str(message['text'])]
                })

        # <-- FIX #3: The prompt is no longer needed here.
        # The model was already initialized with it.
        # We just send the existing chat history.
        
        print("📤 Sending this conversation history to Gemini API:")
        for msg in chat_history:
            print(msg)

        # Send to Gemini model
        chat_session = model.start_chat(history=chat_history)
        response = chat_session.send_message(user_message)
        ai_response_text = response.text.strip()

        print(f"🤖 AI Response: {ai_response_text}")
        return jsonify({"text": ai_response_text})

    except Exception as e:
        print(f"\n--- 🚨 ERROR in /api/chat ---")
        import traceback
        traceback.print_exc()
        print(f"--- END ERROR ---\n")
        return jsonify({"error": str(e)}), 500

# -------------------------------
# 7. NEW: Auth Endpoints
# -------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    email = data.get('email')
    password = data.get('password')

    # Simulate a database lookup
    user = FAKE_DB["users"].get(email)

    if user and user["password"] == password:
        # In a real app, you would issue a JWT token here.
        # For now, just send user info.
        print(f"✅ Successful login for: {email} (Role: {user['role']})")
        return jsonify({
            "message": "Login successful!",
            "token": "fake-jwt-token-for-" + email, # Mock token
            "user": {
                "name": user["name"],
                "email": email,
                "role": user["role"]
            }
        })
    else:
        print(f"❌ Failed login attempt for: {email}")
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    # This is a mock endpoint. In a real app, you would:
    # 1. Validate the input (name, email, password, role)
    # 2. Check if the email already exists
    # 3. Hash the password
    # 4. Save the new user to the database
    data = request.get_json(force=True)
    email = data.get('email')
    
    if email in FAKE_DB["users"]:
        return jsonify({"error": "User with this email already exists"}), 400

    # Simulate user creation
    print(f"✅ Simulating registration for: {email}")
    # We don't actually add them to the FAKE_DB to keep it simple
    # But we pretend it worked.
    return jsonify({
        "message": "Registration successful! Please log in.",
        # In a real app, you might auto-login and return a token/user
    }), 201


# -------------------------------
# 8. NEW: Content Endpoints
# -------------------------------

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    return jsonify(FAKE_DB["blog_posts"])

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    # Simulate a delay for the preloader
    time.sleep(1) 
    return jsonify(FAKE_DB["doctors"])

@app.route('/api/store', methods=['GET'])
def get_store_products():
     # Simulate a delay for the preloader
    time.sleep(1)
    return jsonify(FAKE_DB["products"])

# -------------------------------
# 9. Health Check Endpoint (Was section 6)
# -------------------------------
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "✅ JoyDeb AI backend is running!"})

# -------------------------------
# 10. Run Server (Was section 7)
# -------------------------------
if __name__ == '__main__':
    print("\n🌐 Starting Flask server at: http://localhost:5001")
    print("🟢 Ready to receive requests from React app on http://localhost:3000\n")
    app.run(debug=True, port=5001)