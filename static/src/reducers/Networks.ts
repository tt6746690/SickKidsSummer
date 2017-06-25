import {
  END_FETCH_FAILURE,
  END_FETCH_SUCCESS,
  START_FETCH
} from "./FetchActions";

export default function networks(state, action) {
  switch (action.type) {
    case START_FETCH:
      return {
        ...state,
        isFetching: true,
        fetchStatus: action.msg !== "" ? action.msg : "start fetching..."
      };
    case END_FETCH_SUCCESS:
    case END_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetchStatus: action.msg !== "" ? action.msg : "end fetching..."
      };
    default:
      return { ...state };
  }
}
