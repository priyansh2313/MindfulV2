from flask import Flask, request, jsonify
from flask_cors import CORS 
from ollama_chat import chat_with_ollama  # ✅ your chatbot logic

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://localhost:5173"}})


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")
    if not user_input:
        return jsonify({"response": "Please provide a valid input."}), 400

    reply = chat_with_ollama(user_input)
    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(port=5000)
