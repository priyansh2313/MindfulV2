# intent_router.py

def route_user_intent(user_input: str) -> str:
    user_input = user_input.lower()

    # Mapping user emotions to sections
    if any(word in user_input for word in ["anxious", "panic", "overwhelmed", "worried"]):
        return "mindfulness"
    
    if any(word in user_input for word in ["stress", "stressed", "burnout", "tense"]):
        return "mindfulness"

    if any(word in user_input for word in ["sleep", "insomnia", "can't sleep", "unable to sleep"]):
        return "music"

    if any(word in user_input for word in ["depressed", "hopeless", "worthless", "low"]):
        return "journal"

    if any(word in user_input for word in ["alone", "lonely", "isolated"]):
        return "community"

    if any(word in user_input for word in ["test", "diagnose", "evaluate", "quiz", "assessment"]):
        return "test"

    if any(word in user_input for word in ["learn", "understand", "read about"]):
        return "encyclopedia"

    return "assistant"  # Default fallback
