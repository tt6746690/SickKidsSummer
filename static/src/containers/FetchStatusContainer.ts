import { connect } from "react-redux";

import FetchStatus from "../components/FetchStatus";
import { stateInterface } from "../Interfaces";
import { resetFetchStatus } from "../reducers/FetchActions";

const mapStateToProps = (state: stateInterface) => {
  let { networks: { isFetching, fetchStatus } } = state;

  return {
    isFetching,
    fetchStatus
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hide() {
      setTimeout(() => dispatch(resetFetchStatus()), 200);
    }
  };
};

const FetchStatusContainer = connect(mapStateToProps, mapDispatchToProps)(
  FetchStatus
);

export default FetchStatusContainer;
