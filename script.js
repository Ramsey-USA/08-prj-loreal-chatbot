// Frontend JavaScript to connect to your Cloudflare Worker
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's message
  const message = userInput.value;
  chatWindow.innerHTML += `<div><b>You:</b> ${message}</div>`;

  // Prepare the messages array for OpenAI API
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: message },
  ];

  try {
    // Send the messages to your Cloudflare Worker endpoint
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
    chatWindow.innerHTML += `<div><b>Bot:</b> ${reply}</div>`;
  } catch (error) {
    chatWindow.innerHTML += `<div style='color:red'><b>Error:</b> Could not connect to the bot.</div>`;
  }
  userInput.value = "";
});
