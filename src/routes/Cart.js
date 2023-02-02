import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { dec, inc, remove } from "../redux/action";
import axios from "axios";
function Cart({ cartItems, remove, totalPrice, inc, dec }) {
  const [sendingPrice, setSendingPrice] = React.useState("");
  const getSendPrice = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}ShippingAmount.aspx`)
      .then((res) => {
        let sendingPrice;
        const freeShipping = JSON.parse(res.data[0].freeAmount) <= totalPrice;
        if (!freeShipping) {
          sendingPrice = JSON.parse(res.data[0].shippingAmount);
        } else {
          sendingPrice = 0;
        }
        setSendingPrice(sendingPrice);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  React.useEffect(() => {
    getSendPrice();
  }, [totalPrice]);
  return (
    <Layout loading={false} title="سبد خرید">
      {/* <!-- Breadcumbs start --> */}
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">سبد خرید </h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/cart">سبد خرید </NavLink>
          </li>
        </ul>
      </div>
      {/* <!-- Product Category start --> */}

      {cartItems.length > 0 ? (
        <section className="e-shopcart-wrap">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-12">
                <div className="e-shopcart-sec">
                  <div className="shopcart-table-wrap mb-30">
                    <form className="table-responsive">
                      <table className="shopcart-table">
                        <thead>
                          <tr>
                            <th>محصول </th>
                            <th>تعداد </th>
                            <th> قیمت واحد</th>
                            <th>قیمت جمع </th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.length > 0 &&
                            cartItems.map((each) => {
                              return (
                                <tr>
                                  <td>
                                    <div className="sc-productwrap">
                                      <NavLink
                                        to={`/product/${each.id}`}
                                        className="sc-product-thumb"
                                      >
                                        <img
                                          style={{
                                            width: "120px",
                                            height: "120px",
                                          }}
                                          src={each.img}
                                          alt="محصول"
                                          className="img-fluid"
                                        />
                                      </NavLink>
                                      <div className="sc-product-details">
                                        <NavLink
                                          to={`/product/${each.id}`}
                                          className="sc-product-ttl"
                                        >
                                          {each.title}
                                        </NavLink>
                                        <p className="sc-product-sz">
                                          اندازه: {each.size?.sizeTitle}{" "}
                                        </p>
                                        <p className="sc-product-sz">
                                          رنگ: {each.color?.colorTitle}{" "}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="quantity-box">
                                      <input
                                        type="text"
                                        className="quantity input-font"
                                        value={each.quantity}
                                        disabled
                                        style={{ backgroundColor: "white" }}
                                      />
                                      <span
                                        onClick={() => dec(each)}
                                        style={{ bottom: "0" }}
                                        className="quantity-plus pa-sub quantity-icon"
                                      >
                                        {" "}
                                        -{" "}
                                      </span>
                                      <span
                                        onClick={() => inc(each)}
                                        className="quantity-minus pa-add quantity-icon"
                                      >
                                        {" "}
                                        +{" "}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="sc-product-prc"
                                    >
                                      {JSON.parse(
                                        each.priceTakhfif
                                      ).toLocaleString("fa-IR")}{" "}
                                      تومان
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      style={{ fontSize: "16px" }}
                                      className="sc-product-prc"
                                    >
                                      {(
                                        each.quantity * each.priceTakhfif
                                      ).toLocaleString("fa-IR")}{" "}
                                      تومان
                                    </span>
                                  </td>
                                  <td>
                                    <div
                                      onClick={() => remove(each)}
                                      role="button"
                                      className="sc-produc-remove"
                                    >
                                      <img
                                        src={require("../assets/images/index1/svg/cut.svg")}
                                        alt="icon"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-12">
                <div className="e-shopcart-sidebar">
                  <div className="e-totalsumry mb-30">
                    <div className="e-totalsumry-header">
                      <h2 className="e-totalsumry-ttl">خلاصه مجموع سبد خرید</h2>
                    </div>
                    {/* <div className="e-totalsumry-body">
                      <ul className="e-totalsumry-list">
                        <li>
                          <span className="ts-list-head">تعداد کالاها:</span>
                          <span className="ts-list-shead">
                            {cartItems.length.toLocaleString("fa-IR")}
                          </span>
                        </li>
                      </ul>
                    </div> */}
                    <div className="e-totalsumry-fotr">
                      <ul className="e-totalsumry-list total">
                        <li>
                          <span className="ts-list-head">هزینه ارسال:</span>
                          <span className="ts-list-shead">
                            {sendingPrice === 0
                              ? "رایگان"
                              : sendingPrice.toLocaleString("fa-IR")}{" "}
                            {sendingPrice !== 0 && "تومان"}
                          </span>
                        </li>
                        <li style={{ marginTop: "1em" }}>
                          <span className="ts-list-head">مجموع کل</span>
                          <span className="ts-list-shead">
                            {totalPrice.toLocaleString("fa-IR")} تومان
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <NavLink to="/shipping" className="e-btn">
                    پرداخت صورتحساب{" "}
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div
          style={{ paddingBottom: "200px" }}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          <div style={{ fontSize: "25px" }}>سبد خرید شما خالیست</div>
          <NavLink to="/">
            <div style={{ marginTop: "20px" }} className="e-btn light">
              فروشگاه
            </div>
          </NavLink>
        </div>
      )}
    </Layout>
  );
}

const mapState = (state) => {
  return {
    cartItems: state.cartItems,
    totalPrice: state.totalPrice,
  };
};
const mapDis = (dispatch) => {
  return {
    remove: (product) => dispatch(remove(product)),
    inc: (product) => dispatch(inc(product)),
    dec: (product) => dispatch(dec(product)),
  };
};
export default connect(mapState, mapDis)(Cart);
