defmodule ChatServer do
  use Application
  @port 4000

  # this defines the supervisor, which will start the application
  @spec start(any, any) :: {:error, any} | {:ok, pid}
  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: ChatServer.Router,
        options: [
          dispatch: dispatch(),
          port: @port
        ]
      ),
      Registry.child_spec(
        #  will save all pids connected to socket
        keys: :duplicate,
        name: Registry.ChatServer
      )
    ]

    opts = [strategy: :one_for_one, name: ChatServer.Application]

    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/[...]", ChatServer.SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {ChatServer.Router, []}}
       ]}
    ]
  end
end
