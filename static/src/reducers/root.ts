import { stateInterface } from "../Interfaces";
import entities from "./Entities";
import networks from "./Networks";
import ui from "./Ui";

export default function rootReducer(state: stateInterface, action) {
  let newState = {
    entities: entities(state.entities, action),
    ui: ui(state.ui, action),
    networks: networks(state.networks, action)
  };
  return newState;
}
