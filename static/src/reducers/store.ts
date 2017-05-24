import { createStore } from 'redux'
import todoApp from './reducers'

import {addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters} from './actions'


console.log("here")

let store = createStore(todoApp)
 

console.log(store.getState())

let unsubscribe = store.subscribe(() => 
    console.log(store.getState())
)

// dispatch actions 
store.dispatch(addTodo('todo1'))
store.dispatch(addTodo('todo2'))
store.dispatch(addTodo('todo3'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// stop listening to state updates
unsubscribe()



