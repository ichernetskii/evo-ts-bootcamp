import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/app/app";
import { StoreProvider } from "./store/store";

import "./index.scss";

ReactDOM.render(<StoreProvider><App/></StoreProvider>, document.getElementById("root"));
