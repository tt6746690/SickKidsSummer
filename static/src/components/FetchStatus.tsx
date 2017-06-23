import * as React from "react";
import "whatwg-fetch";
import "react-bootstrap";

import { FETCH_STATUS } from "../reducers/FetchActions";

class FetchStatus extends React.Component<any, object> {
  render() {
    let { isFetching, fetchStatus } = this.props;
    return (
      isFetching && <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
    );
  }
}

export default FetchStatus;
