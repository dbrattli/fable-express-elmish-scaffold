module Backend

open System
open Fable.Core
open Fable.Import
open Fable.Import.express

let serveStatic path (app:Express) = 
  let staticPath = express.``static``  
  app.``use`` (staticPath.Invoke path)

type PortInfo = { Port : int }

let startServer { Port = port } = 
  let app = express.Invoke()

  app.get (U2.Case1 "/api/sayHello", fun (req:express.Request) (res:express.Response) _ -> res.send "hello world" |> box) |> ignore

  app |> serveStatic "public" |> ignore

  app.listen(port, unbox (fun () ->
    printfn "Server started: http://localhost:%i/" port))
  |> ignore



let okayExitCode = 0

[<EntryPoint>]
let main args =
  startServer { Port = 8080 }

  okayExitCode
