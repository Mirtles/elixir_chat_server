defmodule ChatServer do
  use Application

  # this defines the supervisor, which will start the application
  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: ChatServer.Router,
        options: [
          dispatch: dispatch(),
          port: 4001
        ]
      ),
      Registry.child_spec(
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
