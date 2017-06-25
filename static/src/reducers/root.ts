import { stateInterface } from "../Interfaces";
import entities from "./Entities";
import networks from "./Networks";
import ui from "./Ui";

export default function rootReducer(state: stateInterface, action) {
  let start = performance.now();
  let newState = {
    entities: entities(state.entities, action),
    ui: ui(state.ui, action),
    networks: networks(state.networks, action)
  };
  let end = performance.now();
  console.log({ type: action.type, time: `${end - start}ms`, action });

  return newState;
}
