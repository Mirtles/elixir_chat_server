(() => {
  class myWebsocketHandler {
    setupSocket() {
      // initialises connection to socket
      console.log("setting up socket")
      this.socket = new WebSocket("ws://localhost:4001/ws/chat")

      // when a message arrives, a p tag is made and appended to the chat element
      this.socket.addEventListener("message", (event) => {
        const pTag = document.createElement("p")
        pTag.innerHTML = event.data

        document.getElementById("main").append(pTag)
      })

      // if the websocket is closed, this reopens it
      this.socket.addEventListener("close", () => {
        this.setupSocket()
      })
    }

    submit(event) {
      console.log("submitting")
      event.preventDefault()
      const input = document.getElementById("message")
      const message = input.value
      input.value = ""

      // sends to socket
      this.socket.send(
        JSON.stringify({
          data: { message: message },
        })
      )
    }
  }

  const websocketClass = new myWebsocketHandler()
  websocketClass.setupSocket()

  document.getElementById("button").addEventListener("click", (event) => websocketClass.submit(event))
})()