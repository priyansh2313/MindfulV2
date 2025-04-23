from flask import Flask, request, jsonify
from intent_router import route_user_intent
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def chat_with_ollama(user_input):
    url = "http://127.0.0.1:11434/api/generate"
    prompt = f""" just provide  empathy in 5 or 6 words"""
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False,
        "context": []
    }

    response = requests.post(url, json=payload)

    try:
        response_json = response.json()
        base_reply = response_json.get("response", "No response")

        section = route_user_intent(user_input)
        suggestions = {
    "music": "🎵 Try calming music. It can help reduce stress, regulate emotions, and promote a peaceful state of mind.",
    "community": "💬 Connect in the community chat. Talking to others going through similar experiences can make you feel heard and less alone.",
    "test": "🧠 Take our mental health test. It's a quick, clinically backed way to reflect on how you're doing and track changes over time.",
    "journal": "📔 Write in your journal. Expressing your thoughts privately can help you process emotions and gain clarity.",
    "mindfulness": "🧘‍♂️ Try mindfulness exercises. They promote relaxation, self-awareness, and reduce anxiety through breath and body-based practices.",
    "encyclopedia": "📚 Check out the mental health encyclopedia. Learn about your emotions and conditions in a simple, reliable way.",
    "general": "🤖 I'm here if you need to talk. You can share anything on your mind, and I’ll guide you to support within the app."
}

        final_response = f"{base_reply}\n\n{suggestions.get(section)}"
        return final_response

    except:
        return "Oops! Something went wrong.😢"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")
    response = chat_with_ollama(user_input)
    return jsonify({ "response": response })

if __name__ == "__main__":
    app.run(port=5000)
