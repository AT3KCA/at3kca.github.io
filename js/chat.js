document.getElementById("chat-module-submit").addEventListener("click", async function() {
	document.getElementById("chat-module-submit").disabled = true
	const body = {
		name: document.getElementById("chat-module-name").value,
		email: document.getElementById("chat-module-email").value,
		content: document.getElementById("chat-module-content").value,
		timestamp: Date.now(),
	}
	console.log(body)
	var response = await fetch("http://localhost:8000/api/chats/test", {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json"
		}
	})
	var data = await response.json()
	console.log(data)
	document.getElementById("chat-module-submit").disabled = false
})
