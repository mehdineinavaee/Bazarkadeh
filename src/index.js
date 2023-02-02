import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Router
import { BrowserRouter as Router } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// CSS

import "./assets/css/bootstrap.min.css";
import "./assets/css/nice-select.css";
import "./assets/css/font.css";
import "./assets/css/swiper-bundle.min.css";
import "./assets/css/comman.css";
import "./assets/css/style.css";
// import "./assets/css/magnific-popup.css";
import "./index.css";
import "mapir-react-component/dist/index.css";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
