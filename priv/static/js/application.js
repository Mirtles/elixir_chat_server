(() => {
  const port = 4000

  class chatServerHandler {
    setupSocket() {
      // initialises connection to socket
      this.socket = new WebSocket(`ws://localhost:${port}/ws/chat`)

      // when a message arrives, a p tag is made and appended to the chat element
      this.socket.addEventListener("message", (event) => {
        const pTag = document.createElement("p")
        pTag.textContent = event.data

        document.getElementById("main").append(pTag)
      })

      this.socket.addEventListener("close", () => {
        this.setupSocket()
      })
    }

    submit(event) {
      event.preventDefault()
      const input = document.getElementById("message")
      const message = input.value
      input.value = ""

      this.socket.send(
        JSON.stringify({
          data: { message: message }
        })
      )
    }
  }

  const websocketClass = new chatServerHandler()
  websocketClass.setupSocket()

  document.getElementById("button").addEventListener("click", (event) => websocketClass.submit(event))
})