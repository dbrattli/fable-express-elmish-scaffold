module fable

open Fable.Core
open Fable.Helpers.React
open Fable.Helpers.React.Props
open Fable.PowerPack.PromiseImpl
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Elmish
open Elmish.React

type Model = { Counter : int }
type Message = Increment | Decrement

let init () =
  { Counter = 0 }, Cmd.none

let update msg model =
  match msg with
  | Increment -> 
    { model with Counter = model.Counter + 1 }, Cmd.none

  | Decrement -> 
    { model with Counter = model.Counter - 1 }, Cmd.none

let view model dispatch = 
  div 
    []
    [
      button [ OnClick (fun _ -> dispatch Increment) ] [ unbox "Increment" ] 
      div [] [ unbox (string model.Counter) ] 
      button [ OnClick (fun _ -> dispatch Decrement) ] [ unbox "Decrement" ] 
    ]

promise {
  let! resp = fetch "/api/sayHello" []
  let! text = resp.text ()
  Fable.Import.Browser.document.getElementById("testing").innerText <- text
  return ()
}
|> Promise.start

Program.mkProgram init update view
|> Program.withReact "content"
|> Program.run

