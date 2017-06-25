import * as React from "react";
import "whatwg-fetch";
import "react-bootstrap";

import { FETCH_STATUS } from "../reducers/FetchActions";

class FetchStatus extends React.Component<any, object> {
  state = {
    statusMsg: ""
  };

  render() {
    let { isFetching, fetchStatus } = this.props;
    console.log({ where: "FetchStatus::render()", isFetching, fetchStatus });

    let statusMsg = fetchStatus;

    return (
      <div>
        {isFetching && <i className="fa fa-cog fa-spin fa-2x fa-fw" />}
        <div>
          {setTimeout(() => (statusMsg = ""), 1000) && statusMsg}
        </div>
      </div>
    );
  }
}

export default FetchStatus;
