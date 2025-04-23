export const fetchChatResponse = async (userMessage: string): Promise<string> => {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input: userMessage }),
    });
  
    const data = await res.json();
    return data.response || "⚠️ Unable to respond.";
  };
  


  