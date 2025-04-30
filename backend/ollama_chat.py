from flask import Flask, request, jsonify
from intent_router import route_user_intent
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def chat_with_ollama(user_input, source):
    url = "http://127.0.0.1:11434/api/generate"
    base_prompt = """Provide a very short, empathetic reply (5-6 words) like a caring human."""
    
    payload = {
        "model": "mistral",
        "prompt": base_prompt,
        "stream": False,
        "context": []
    }

    response = requests.post(url, json=payload)

    try:
        response_json = response.json()
        base_reply = response_json.get("response", "No response.")

        if source == "evaluation":
            final_response = f"{base_reply}\n\n🚨 Would you like to connect with a nearby mental health professional?"
        else:
            section = route_user_intent(user_input)
            suggestions = {
                "music": "🎵 Try calming music to soothe your mind.",
                "community": "💬 Connect in the community to feel heard.",
                "test": "🧠 Take our evaluation again for reflection.",
                "journal": "📔 Journal your feelings privately.",
                "mindfulness": "🧘‍♂️ Try mindfulness exercises.",
                "encyclopedia": "📚 Learn about emotions in encyclopedia.",
                "general": "🤖 I'm here if you need to talk freely."
            }
            final_response = f"{base_reply}\n\n{suggestions.get(section, suggestions['general'])}"

        return final_response

    except Exception as e:
        return "Oops! Something went wrong. 😢"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")
    source = data.get("source", "dashboard")  # <--- NEW FIELD
    response = chat_with_ollama(user_input, source)
    return jsonify({ "response": response })

if __name__ == "__main__":
    app.run(port=5000)
