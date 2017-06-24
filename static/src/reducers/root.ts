import entities from "./Entities";
import ui from "./Ui";
import networks from "./Networks";

import { stateInterface } from "../Interfaces";

export default function rootReducer(state: stateInterface, action) {
  console.log({ type: action.type, action });
  return {
    entities: entities(state.entities, action),
    ui: ui(state.ui, action),
    networks: networks(state.networks, action)
  };
}
