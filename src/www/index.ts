import Context from "@krisnye/glass-platform/ui/Context";
import State from "@krisnye/glass-platform/data/State";
import Store from "@krisnye/glass-platform/data/Store";
import Key from "@krisnye/glass-platform/data/Key";
import invoke from "@krisnye/glass-platform/server/invoke";
import HtmlContext from "@krisnye/glass-platform/ui/html/HtmlContext";

invoke("/api/hello", {}).then(serverResponse => {
    //  and then add it to the page state
    Store.default.patch(IndexPageState.key, { serverResponse })
})

//  define main page state
@State.class()
class IndexPageState extends State {

    @State.property()
    serverResponse?: { message: string }

    //  this state object is a singleton so we define the only key we need statically
    static key = Key.create(IndexPageState, "0")
}

//  bind our rendering function to the document.body
Context.bind(c => {
    let { div, span, p, text, end, render } = HtmlContext(c)

    //  get page state
    let state = c.store.get(IndexPageState.key)

    //  render title
    document.title = "Hello World Title"

    //  render body
    div()
        p("Hello from the Client on TODO MVC")
        if (state.serverResponse) {
            p("Message from the Server: " + state.serverResponse.message)
        }
    end()
})
