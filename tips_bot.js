function sendQuery() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    const chatContainer = document.getElementById("chat-container");

    // Append user message
    chatContainer.innerHTML += `
        <div class="chat-message user">${message}</div>
    `;

    input.value = "";

    fetch("/tips", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" },
        body: JSON.stringify({ query: message })
    })
    .then(res => res.json())
    .then(data => {
        chatContainer.innerHTML += `
            <div class="chat-message bot">${data.response}</div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(err => {
        chatContainer.innerHTML += `
            <div class="chat-message bot">⚠️ Error getting tips. Try again later.</div>
        `;
    });
}
