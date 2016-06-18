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
let webConfig = 
    { 
        defaultConfig with 
            bindings=[ HttpBinding.mk HTTP defaultArgs.IP defaultArgs.Port ] 
            logger = Logging.Loggers.saneDefaultsFor Logging.LogLevel.Verbose
    }

[<EntryPoint>]
let main argv = 
    
    let cts = new CancellationTokenSource()
    let startingServer, shutdownServer = startWebServerAsync webConfig (Successful.OK "Hello World!")

    Async.Start(shutdownServer, cts.Token)

    startingServer |> Async.RunSynchronously |> printfn "started: %A"

    printfn "Press Enter to stop"
    Console.Read() |> ignore

    cts.Cancel()

    0
