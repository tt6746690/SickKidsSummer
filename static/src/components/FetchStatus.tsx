import * as React from "react";
import "whatwg-fetch";
import "react-bootstrap";

import { FETCH_STATUS } from "../reducers/FetchActions";

class FetchStatus extends React.Component<any, any> {
  componentDidUpdate() {
    let { isFetching, fetchStatus, hide } = this.props;
    if (!isFetching && fetchStatus !== "") {
      hide();
    }
  }

  render() {
    let { isFetching, fetchStatus } = this.props;

    return (
      <div>
        {isFetching && <i className="fa fa-cog fa-spin fa-2x fa-fw" />}
        <div>
          {fetchStatus}
        </div>
      </div>
    );
  }
}

export default FetchStatus;
