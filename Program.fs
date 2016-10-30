
open Suave
open Suave.Http
open Suave.Operators
open Suave.Filters
open Suave.Successful
open Suave.Files
open Suave.RequestErrors
open Suave.Logging
open Suave.Utils

open System
open System.Net

open Suave.Sockets
open Suave.Sockets.Control
open Suave.WebSocket

let echo (webSocket : WebSocket) =
  fun cx -> socket {
    let loop = ref true
    while !loop do
      let! msg = webSocket.read()
      match msg with
      | (Text, data, true) ->
        let str = UTF8.toString data
        do! webSocket.send Text (ArraySegment data) true
      | (Ping, _, _) ->
        do! webSocket.send Pong (ArraySegment([||])) true
      | (Close, _, _) ->
        do! webSocket.send Close (ArraySegment([||])) true
        loop := false
      | _ -> ()
  }

let app : WebPart =
  choose [
    path "/websocket" >=> handShake echo
    GET >=> choose [ path "/" >=> file "index.html"; browseHome ];
    Writers.setHeader "Cache-Control" "no-cache, no-store, must-revalidate"
      >=> Writers.setHeader "Pragma" "no-cache"
      >=> Writers.setHeader "Expires" "0"
      >=> browseHome
    NOT_FOUND "Found no handlers."
    ]

[<EntryPoint>]
let main _ =
  startWebServer { defaultConfig with 
                        homeFolder = Some (__SOURCE_DIRECTORY__)
                        logger = Targets.create Verbose
                        listenTimeout = TimeSpan.FromMilliseconds 3000.
                 } app
  0