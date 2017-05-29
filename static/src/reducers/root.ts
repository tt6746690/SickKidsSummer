import entities from "./entities"
import ui from "./ui"

import { stateInterface } from "../interfaces"

export default function rootReducer(state: stateInterface, action) {

    return {
        entities: entities(state.entities, action),
        ui: ui(state.ui, action)
    }
}
