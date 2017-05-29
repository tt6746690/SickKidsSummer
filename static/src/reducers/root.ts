import entities from "./Entities"
import ui from "./Ui"

import { stateInterface } from "../Interfaces"

export default function rootReducer(state: stateInterface, action) {

    return {
        entities: entities(state.entities, action),
        ui: ui(state.ui, action)
    }
}
