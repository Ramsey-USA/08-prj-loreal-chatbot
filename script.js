// Frontend JavaScript to connect to your Cloudflare Worker
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store the conversation history for context awareness
const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant for L’Oréal. Only answer questions about L’Oréal products and beauty routines. If a question is unrelated, politely reply: 'Sorry, I can only answer questions about L’Oréal products and routines.'",
  },
];

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's message
  const message = userInput.value;
  // Add user's message to the messages array
  messages.push({ role: "user", content: message });

  // Show only the latest user question above the AI response, styled as a bubble
  chatWindow.innerHTML = `<div class="bubble user">${message}</div>`;

  try {
    // Send the full conversation to your Cloudflare Worker endpoint
    const response = await fetch(
      "https://loreal-wonderbot.mjramse1.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }
    );
    const data = await response.json();
    const reply = data.choices[0].message.content;
    // Add bot's reply to the messages array for context
    messages.push({ role: "assistant", content: reply });
    chatWindow.innerHTML += `<div class="bubble bot">${reply}</div>`;
  } catch (error) {
    chatWindow.innerHTML += `<div style='color:red'><b>Error:</b> Could not connect to the bot.</div>`;
  }
  userInput.value = "";
});
