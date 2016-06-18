open Suave
open Suave.Web
open Suave.Http
open Suave.Operators
open Suave.Sockets.Control
open Suave.WebSocket
open Suave.Utils
open Suave.Files
open Suave.RequestErrors
open Suave.Filters
open System
open System.Net
open System.Threading

type CmdArgs = { IP: System.Net.IPAddress; Port: Sockets.Port }

let defaultArgs = { IP = System.Net.IPAddress.Loopback; Port = 8083us }
let logger = Logging.Loggers.ConsoleWindowLogger Logging.LogLevel.Verbose

let refreshEvent = new Event<WebSocket>()

let socketHandler (webSocket : WebSocket) =
  fun cx -> socket {
    while true do
      let! refreshed =
        Control.Async.AwaitEvent(refreshEvent.Publish)
        |> Suave.Sockets.SocketOp.ofAsync
      do! webSocket.send Text (ASCII.bytes "refreshed") true
  }

let webConfig = 
    { defaultConfig with 
        homeFolder = Some (__SOURCE_DIRECTORY__)
        bindings=[ HttpBinding.mk HTTP defaultArgs.IP defaultArgs.Port ] 
        logger = logger
        listenTimeout = TimeSpan.FromMilliseconds 3000.
    }

let app : WebPart =
  choose [
    Filters.log logger logFormat >=> never
    Filters.path "/websocket" >=> handShake socketHandler
    Filters.GET >=> Filters.path "/" >=> file "index.html"
    Writers.setHeader "Cache-Control" "no-cache, no-store, must-revalidate"
      >=> Writers.setHeader "Pragma" "no-cache"
      >=> Writers.setHeader "Expires" "0"
      >=> browseHome
    NOT_FOUND "Found no handlers."
  ]

[<EntryPoint>]
let main argv = 
    
    let cts = new CancellationTokenSource()
    (*let startingServer, shutdownServer = startWebServerAsync webConfig (Successful.OK "Hello World!")*)
    let startingServer, shutdownServer = startWebServerAsync webConfig app

    Async.Start(shutdownServer, cts.Token)

    startingServer |> Async.RunSynchronously |> printfn "started: %A"

    printfn "Press Enter to stop"
    Console.Read() |> ignore

    cts.Cancel()

    0
