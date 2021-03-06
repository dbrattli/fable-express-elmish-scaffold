module Backend

open Fable.Import
open Fable.Core.JsInterop
open Fable.Import.express

let serveStatic path (app : Express) =
    let staticPath = express.``static``
    app.``use`` (staticPath.Invoke path)

type PortInfo = { Port : int }

let startServer { Port = port } =
    let app = express.Invoke ()

    app.get (!^ "/api/sayHello", fun (req : Request) (res : Response) _ ->
        res.send "hello world" |> box)
    |> ignore

    app |> serveStatic "public" |> ignore

    app.listen(port, unbox (fun () ->
        printfn "Server started: http://localhost:%i/" port))
    |> ignore

[<EntryPoint>]
let main _args =
    startServer { Port = 8080 }
    0
