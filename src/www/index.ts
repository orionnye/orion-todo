import Context from "@krisnye/glass-platform/ui/Context";
import State from "@krisnye/glass-platform/data/State";
import Store from "@krisnye/glass-platform/data/Store";
import Key, { ModelKey } from "@krisnye/glass-platform/data/Key";
import invoke from "@krisnye/glass-platform/server/invoke";
import HtmlContext from "@krisnye/glass-platform/ui/html/HtmlContext";
import Entity from "@krisnye/glass-platform/data/Entity";
import Model from "@krisnye/glass-platform/data/Model";
import guid from "@krisnye/glass-platform/utility/guid";

invoke("/api/hello", {}).then(serverResponse => {
    //  and then add it to the page state
    Store.default.patch(IndexPageState.key, { serverResponse })
})

//  define main page state
@Model.class()
class IndexPageState extends State {

    @Model.property()
    serverResponse?: { message: string }

    //  this state object is a singleton so we define the only key we need statically
    static key = Key.create(IndexPageState, "0")
}

@Model.class()
class Task extends Entity {
    //will contain "active" boolean, and "name" string

    @Model.property({ type: "string" })
    name!: string

    @Model.property({ type: "boolean" })
    complete!: boolean
}

//  to get our Tasks we make a query key
let completedTasksQuery = Key.create(Task, { where: { complete: true } })
let incompletedTasksQuery = Key.create(Task, { where: { complete: false } })
let allTasksQuery = Key.create(Task, { })

//  to put new task in
function addTask(name: string) {
    let key = Key.create(Task, guid())
    Store.default.patch(key, new Task({ name, key }))
}
function removeTask(key) {
    Store.default.patch(key, null)
}

function renderTask(c: Context, taskKey: ModelKey) {
    let { div, span, p, text, end, render, input, button} = HtmlContext(c)
    let store = Store.default 
    
    let task = store.get(taskKey)!
                div()
                    button({
                        onclick(e) {
                            removeTask(taskKey)
                        }
                    })
                        text("X")
                    end()
                    input({
                        type: "checkbox",
                        onclick(e) {
                            c.store.patch(taskKey, { complete: !task.complete })
                        },
                        checked: task.complete
                    })
                    end()
                    text(" Task: "+ task.name)
                end()
}

//  bind our rendering function to the document.body
Context.bind(c => {
    let { div, span, p, text, end, render, input, button} = HtmlContext(c)

    //  get page state
    let state = c.store.get(IndexPageState.key)
    let allTasks = c.store.get(allTasksQuery)
    let completedTasks = c.store.get(completedTasksQuery)
    let incompletedTasks = c.store.get(incompletedTasksQuery)

    //  render title
    document.title = "ToDo MVC"

    //  render body
    div()
        input({
            onkeydown(this: HTMLInputElement, e) {
                if (e.key == "Enter") {
                    console.log("you pressed: " + e.key)
                    addTask(this.value)
                    this.value = ""
                }
            }
        })
        end()
        p("Hello from the Client on TODO MVC")
        if (state.serverResponse) {
            p("Message from the Server: " + state.serverResponse.message)
        }
        //Tabs
        button({
            onclick(e) {
                if (allTasks !== undefined) {
                    for (let taskKey of allTasks) {
                        renderTask(c, taskKey)
                    }
                }
            }
        })
            text("All Tasks")
        end()
        button({
            onclick(e) {
                if (incompletedTasks !== undefined) {
                    for (let taskKey of incompletedTasks) {
                        renderTask(c, taskKey)
                    }
                }
            }
        })
            text("Incomplete Tasks")
        end()
        button({
            onclick(e) {
                if (completedTasks !== undefined) {
                    for (let taskKey of completedTasks) {
                        renderTask(c, taskKey)
                    }
                }
            }
        })
            text("Complete Tasks")
        end()
        //Clear completed Tasks Button
        button({
            onclick(e) {
                if (completedTasks !== undefined) {
                    for (let taskKey of completedTasks) {
                        c.store.patch(taskKey, null)
                    }
                }
            }
        })
            text("Clear Completed")
        end()
        if (allTasks !== undefined) {
            for (let taskKey of allTasks) {
                renderTask(c, taskKey)
            }
        }
        
    end()
})