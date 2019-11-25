defmodule ChatServer.SocketHandler do
  # specifies that the module must use all these functions
  @behaviour :cowboy_websocket

  def init(request, _state) do
    state = %{registry_key: request.path}

    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    Registry.ChatServer
    |> Registry.register(state.registry_key, {})

    {:ok, state}
  end

  def websocket_handle({:text, json}, state) do
    payload = Jason.decode!(json)
    message = payload["data"]["message"]
    name = payload["data"]["name"]

    reply = "#{name} #{message}"

    Registry.ChatServer
    |> Registry.dispatch(state.registry_key, fn entries ->
      for {pid, _} <- entries do
        if pid != self() do
          Process.send(pid, message, [])
        end
      end
    end)

    {:reply, {:text, reply}, state}
  end

  def websocket_info(info, state) do
    {:reply, {:text, info}, state}
  end
end
