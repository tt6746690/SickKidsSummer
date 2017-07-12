import * as React from "react";
import "whatwg-fetch";
import "react-bootstrap";

import { FETCH_STATUS } from "../actions/FetchActions";

class FetchStatus extends React.Component<any, any> {
  componentDidUpdate() {
    let { isFetching, fetchStatus, hide } = this.props;
    if (!isFetching && fetchStatus !== "") {
      hide();
    }
  }

  render() {
    let { isFetching } = this.props;

    return (
      <div>
        {isFetching && <i className="fa fa-cog fa-spin fa-4x fa-fw" />}
      </div>
    );
  }
}

export default FetchStatus;
