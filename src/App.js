import React, { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { setPrevPrice } from "./redux/action";
import { connect } from "react-redux";
// const SidebarAndOther = lazy(() => import('./components/SidebarAndOther/SidebarAndOther'));
import {
  Terms,
  Home,
  Contact,
  Privacy,
  Cart,
  Profile,
  Wishlist,
  Shipping,
  Error,
  Blog,
  BlogCategory,
  ForgotPassword,
  ProductCategory,
  ProductCategorySidebar,
  ProductDetails,
} from "./routes";
import About from "./routes/About";
import Questions from "./routes/Questions";
import NextBuys from "./routes/Nextbuys";
const loadJs = require("loadjs");
function App(props) {
  useEffect(() => {
    loadJs("js/custom.js");
    window.scrollTo(0, 0);
    if (props.cartItems && props.cartItems.length > 0) {
      props.setPrevPrice();
    }
  }, [props.location]);

  return (
    <Switch>
      <Route exact component={Home} path="/" />
      <Route exact component={Terms} path="/terms" />
      <Route exact component={About} path="/about" />
      <Route exact component={Privacy} path="/privacy" />
      <Route exact component={Contact} path="/contact" />
      <Route exact component={Cart} path="/cart" />
      <Route exact component={Profile} path="/profile" />
      <Route exact component={Shipping} path="/shipping" />
      <Route exact component={Blog} path="/blog/:id" />
      <Route exact component={BlogCategory} path="/blog_category/:page" />
      <Route exact component={ForgotPassword} path="/forgotpassword" />
      <Route exact component={ProductCategory} path="/product_category" />
      <Route exact component={ProductCategorySidebar} path="/seller/:id" />
      <Route exact component={ProductDetails} path="/product/:id" />
      <Route exact component={Wishlist} path="/wishlist" />
      <Route exact component={NextBuys} path="/nextcart" />
      <Route exact component={Questions} path="/questions" />
      <Route component={Error} />
    </Switch>
  );
}

const mapState = (state) => {
  return {
    cartItems: state.cartItems,
  };
};
const mapDis = (dispatch) => {
  return {
    setPrevPrice: () => dispatch(setPrevPrice()),
  };
};
export default connect(mapState, mapDis)(withRouter(App));
