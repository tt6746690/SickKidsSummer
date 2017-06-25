import { connect } from "react-redux";

import FetchStatus from "../components/FetchStatus";
import { stateInterface } from "../Interfaces";

const mapStateToProps = (state: stateInterface) => {
  let { networks: { isFetching, fetchStatus } } = state;

  return {
    isFetching,
    fetchStatus
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const FetchStatusContainer = connect(mapStateToProps, mapDispatchToProps)(
  FetchStatus
);

export default FetchStatusContainer;
