(() => {
  class myWebsocketHandler {
    setupSocket() {
      this.socket = new WebSocket("ws://localhost:4001/ws/chat")

      this.socket.addEventListener("message", (event) => {
        const msgTag = document.createElement("p")
        const nameTag = document.createElement("p")
        const divTag = document.createElement("div")

        const name = event.data.split(" ")[0]
        nameTag.textContent = `${name}:`
        nameTag.setAttribute("style", "font-weight: bold;")

        const message = event.data.substr(event.data.indexOf(" ") + 1)
        msgTag.textContent = message

        divTag.appendChild(nameTag)
        divTag.appendChild(msgTag)
        document.getElementById("main").append(divTag)
      })

      this.socket.addEventListener("close", () => {
        this.setupSocket()
      })
    }

    submit(event) {
      event.preventDefault()

      const nameInput = document.getElementById("name")
      const messageInput = document.getElementById("message")

      const name = nameInput.value
      const message = messageInput.value

      messageInput.value = ""
      nameInput.value = ""

      this.socket.send(
        JSON.stringify({
          data: { message: message, name: name },
        })
      )
    }
  }

  const websocketClass = new myWebsocketHandler()
  websocketClass.setupSocket()

  document.getElementById("button").addEventListener("click", (event) => websocketClass.submit(event))
})()