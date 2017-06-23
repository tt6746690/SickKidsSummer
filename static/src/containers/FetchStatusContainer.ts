import { connect } from "react-redux";
import { stateInterface } from "../Interfaces";
import FetchStatus from "../components/FetchStatus";

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
