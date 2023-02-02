import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Drawer from "../Drawer";
import LoginModal from "./LoginModal";
import axios from "axios";

import { connect } from "react-redux";
import { remove } from "../../redux/action";

const loadJs = require("loadjs");
function Header(props) {
  const [show, setShow] = useState(false);
  const [menuDrawer, setMenuDrawer] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [headerLinks, setHeaderLinks] = React.useState([]);
  const [length, setLength] = React.useState(false);
  const [sendingPrice, setSendingPrice] = React.useState(0);
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");

  const getUserDetails = async () => {
    const local = await localStorage.getItem("phone");
    const phone = JSON.parse(local);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}UserDetail.aspx?phone=${phone}`)
      .then((res) => {
        setName(res.data[0].name);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      setAuth(true);
      getUserDetails();
    }

    loadJs("js/custom.js");

    axios
      .get(`${process.env.REACT_APP_BASE_URL}Category.aspx`)
      .then((res) => {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}SubCategory.aspx`)
          .then((secRes) => {
            const categories = [];
            res.data.forEach((each) => {
              categories.push({ ...each, children: [] });
            });
            categories.forEach((category) => {
              secRes.data.forEach((sub) => {
                if (sub.categoryID === category.id) {
                  category.children.push(sub);
                }
              });
            });
            setHeaderLinks(categories);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const getSendPrice = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}ShippingAmount.aspx`)
      .then((res) => {
        setSendingPrice(JSON.parse(res.data[0].freeAmount));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    setLength((prev) => !prev);
    getSendPrice();
  }, [props.cartItems]);
  return (
    <>
      {/* Register Modal */}
      <LoginModal setAuth={setAuth} />
      {/* Cart Drawer */}
      <Drawer left isOpen={show} setIsOpen={setShow}>
        <div className="sb-cartbox-inner">
          <div className="sb-cartbox-header text-center">
            <h4 className="sb-cb-ttl">
              {props.cartItems.length > 0
                ? `( ${props.cartItems.length.toLocaleString("fa-IR")} )`
                : "سبد خرید"}
            </h4>
            {props.cartItems.length > 0 && (
              <p className="sb-cb-subttl">
                {`  شما در سبد خرید خود ${props.cartItems.length} کالا دارید`}
              </p>
            )}
            <div
              onClick={() => setShow(false)}
              role="button"
              className="sb-cb-close close-box"
            >
              بستن
            </div>
          </div>
          <div className="sb-cartbox-body">
            {props.cartItems.length > 0 ? (
              <ul className="sb-cartbox-list">
                {props.cartItems.map((cartItem) => {
                  return (
                    <li style={{ paddingBottom: "50px" }}>
                      <div className="sc-productwrap">
                        <NavLink
                          to={`/product/${cartItem.id}`}
                          className="sc-product-thumb"
                        >
                          <img
                            src={cartItem.img}
                            alt="محصول"
                            className="img-fluid cartItemImage"
                          />
                        </NavLink>
                        <div className="sc-product-details">
                          <div>
                            <NavLink
                              to={`/product/${cartItem.id}`}
                              className="sc-product-ttl"
                            >
                              {cartItem.title}
                            </NavLink>
                          </div>
                          <div>
                            <NavLink
                              to={`/product/${cartItem.id}`}
                              className="sc-product-ttl"
                              style={{ fontSize: "14px" }}
                            >
                              {cartItem.size?.sizeTitle}
                            </NavLink>
                          </div>
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "100%",
                              border: "1px solid #eaeaea",
                              backgroundColor: `#${cartItem?.color?.colorCode}`,
                            }}
                          />

                          <p className="sc-product-sz">
                            {/* اندازه: {cartItem.size}{" "} */}
                          </p>
                        </div>
                      </div>
                      <div className="sc-quantity">
                        <span className="sc-price">
                          {JSON.parse(cartItem.priceTakhfif).toLocaleString(
                            "fa-IR"
                          )}{" "}
                          تومان
                        </span>
                      </div>
                      <div className="d-inline">
                        {" "}
                        {JSON.parse(cartItem.quantity).toLocaleString(
                          "fa-IR"
                        )}{" "}
                        عدد
                      </div>

                      <div
                        onClick={() => props.remove(cartItem)}
                        role="button"
                        className="sc-produc-remove"
                      >
                        <img
                          src={require("../../assets/images/index1/svg/cut.svg")}
                          alt="icon"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-20 text-center">سبد خرید شما خالیست!</div>
            )}
          </div>
          {props.cartItems.length > 0 && (
            <div className="sb-cartbox-footer">
              <div className="sb-cartbox-total">
                <strong>مجموع سبد:</strong>
                <span className="sb-cartbox-amount">
                  {props.totalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                  margin: "0",
                  maxWidth: "100%",
                }}
                className="sb-cartbox-btn"
              >
                <NavLink style={{ width: "100%" }} to="/cart" className="e-btn">
                  سبد خرید
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </Drawer>
      {/* Menu Drawer */}
      <Drawer isOpen={menuDrawer} setIsOpen={setMenuDrawer}>
        <div className="">
          <ul className="menu-list d-xl-flex">
            <li>
              <div style={{ padding: "1em" }}>
                <img
                  src={require("../../assets/images/index1/logo.png")}
                  alt="logo"
                  style={{ height: "40px" }}
                  className="img-fluid"
                />
              </div>
              <div
                onClick={() => setMenuDrawer(false)}
                className="sidebar-toggle"
              >
                <svg
                  style={{ width: "22px" }}
                  fill={"black"}
                  height="200"
                  viewBox="0 0 200 200"
                  width="200"
                >
                  <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
                </svg>
              </div>
            </li>

            <NavLink to="/">
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  صفحه اصلی
                </div>
              </li>
            </NavLink>

            <NavLink to="/product_category?page=1">
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  فروشگاه
                </div>
              </li>
            </NavLink>

            <NavLink to="/blog_category/1">
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  وبلاگ
                </div>
              </li>
            </NavLink>

            <a
              href={"https://bazarkadeh.com/bazarkhareji.aspx"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  بازار خارجی
                </div>
              </li>
            </a>

            <NavLink to="/about">
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  درباره ما
                </div>
              </li>
            </NavLink>

            <NavLink to="/contact">
              <li>
                <div
                  onClick={() => setMenuDrawer(false)}
                  className="drawer-link"
                  style={{
                    padding: "16px 20px 14px 20px",
                    fontSize: "14px",
                    borderBottom: "1px solid #eaeaea",
                  }}
                >
                  ارتباط با ما
                </div>
              </li>
            </NavLink>
          </ul>
        </div>
      </Drawer>
      {/* Search Drawer */}
      <Drawer search isOpen={searchDrawer} setIsOpen={setSearchDrawer}>
        <div
          style={{ position: "relative" }}
          className="search-drawer-content d-flex justify-content-center align-items-center"
        >
          <div
            role="button"
            onClick={() => setSearchDrawer(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: "14px",
            }}
          >
            بستن
          </div>
          <div
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "20px",
              padding: ".5em",
            }}
            className="w-100 d-flex justify-content-between align-items-center search-drawer-input-cont"
          >
            <div className="w-100">
              <input
                className="search-drawer-input"
                style={{
                  textAlign: "right",
                  outline: "none",
                  width: "100%",
                  border: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    props.history.push(
                      `/product_category?search=${search}&page=1`
                    );
                  }
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی کالا یا دسته بندی کالا ..."
              />
            </div>
            <div
              onClick={() =>
                props.history.push(`/product_category?search=${search}&page=1`)
              }
              role="button"
            >
              <svg
                fill="#eaeaea"
                className="search-drawer-input-icon"
                viewBox="0 0 32 32"
              >
                <g>
                  <path d="M29.71,28.29l-6.5-6.5-.07,0a12,12,0,1,0-1.39,1.39s0,.05,0,.07l6.5,6.5a1,1,0,0,0,1.42,0A1,1,0,0,0,29.71,28.29ZM14,24A10,10,0,1,1,24,14,10,10,0,0,1,14,24Z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </Drawer>
      {/* Header Start   */}
      <div className="header-main-wrapper header-style1">
        <div className="header-top-wrapper">
          <div className="ht-left">
            <svg width="19px" height="15px">
              <path
                fillRule="evenodd"
                fill="rgb(125, 143, 179)"
                d="M18.284,7.677 L17.530,7.677 C17.365,7.677 17.215,7.610 17.107,7.501 C16.967,8.262 16.389,8.879 15.631,9.062 L15.631,13.252 C15.631,13.639 15.379,13.967 15.007,14.067 C14.631,14.169 14.249,14.004 14.058,13.677 C13.162,12.134 11.751,11.080 9.862,10.541 C8.422,10.133 7.243,10.188 7.235,10.193 L7.213,10.194 L7.102,10.189 L7.835,13.207 C7.936,13.627 7.842,14.062 7.577,14.403 C7.308,14.743 6.908,14.938 6.476,14.938 L5.821,14.938 C5.174,14.938 4.615,14.498 4.462,13.869 L3.560,10.154 C2.050,9.921 0.932,8.631 0.932,7.079 C0.932,5.363 2.325,3.968 4.038,3.968 L7.234,3.966 C7.359,3.974 8.504,4.002 9.862,3.617 C11.751,3.079 13.163,2.024 14.058,0.482 C14.252,0.148 14.631,-0.010 15.007,0.091 C15.379,0.191 15.631,0.519 15.631,0.907 L15.631,5.097 C16.389,5.279 16.967,5.896 17.107,6.657 C17.215,6.548 17.365,6.482 17.530,6.482 L18.284,6.482 C18.614,6.482 18.881,6.751 18.881,7.079 C18.881,7.409 18.614,7.677 18.284,7.677 ZM6.603,8.743 L4.743,8.743 C4.414,8.743 4.146,8.475 4.146,8.145 C4.146,7.815 4.414,7.548 4.743,7.548 L6.603,7.548 L6.603,5.163 L4.038,5.163 C2.983,5.163 2.126,6.023 2.126,7.079 C2.126,8.131 2.980,8.991 4.030,8.996 L6.344,8.995 L6.603,8.996 L6.603,8.743 ZM6.614,13.241 L6.544,13.241 C6.215,13.241 5.947,12.973 5.947,12.644 C5.947,12.388 6.108,12.170 6.334,12.085 L6.281,11.864 L6.154,11.864 C5.824,11.864 5.557,11.596 5.557,11.266 C5.557,10.991 5.743,10.759 5.996,10.690 L5.875,10.191 L4.798,10.191 L5.623,13.586 C5.645,13.679 5.727,13.743 5.821,13.743 L6.476,13.743 C6.540,13.743 6.597,13.715 6.637,13.665 C6.676,13.615 6.691,13.550 6.674,13.489 L6.614,13.241 ZM14.437,2.035 C13.392,3.335 11.930,4.274 10.165,4.772 C9.191,5.047 8.332,5.133 7.797,5.157 L7.797,9.002 C8.333,9.027 9.193,9.112 10.164,9.386 C11.930,9.884 13.391,10.824 14.437,12.123 L14.437,2.035 ZM15.946,7.016 C15.946,6.764 15.824,6.534 15.631,6.391 L15.631,7.768 C15.824,7.625 15.946,7.394 15.946,7.142 L15.946,7.016 ZM3.890,8.377 C3.878,8.408 3.860,8.442 3.837,8.476 C3.813,8.512 3.789,8.542 3.763,8.568 C3.736,8.595 3.707,8.619 3.675,8.640 C3.636,8.666 3.605,8.682 3.571,8.696 C3.539,8.711 3.498,8.723 3.455,8.731 C3.424,8.739 3.384,8.743 3.340,8.743 C3.298,8.743 3.256,8.739 3.217,8.730 C3.186,8.724 3.147,8.713 3.109,8.696 C3.074,8.681 3.044,8.665 3.014,8.646 C2.969,8.615 2.938,8.590 2.912,8.562 C2.893,8.545 2.865,8.511 2.841,8.472 C2.822,8.446 2.804,8.409 2.792,8.381 C2.772,8.331 2.761,8.295 2.754,8.258 C2.747,8.221 2.743,8.184 2.743,8.145 C2.743,8.108 2.747,8.070 2.754,8.033 C2.761,7.995 2.772,7.959 2.786,7.924 C2.807,7.875 2.824,7.842 2.846,7.810 C2.869,7.776 2.895,7.744 2.924,7.717 C2.939,7.700 2.972,7.674 3.009,7.648 C3.038,7.629 3.071,7.612 3.105,7.597 C3.155,7.577 3.191,7.566 3.228,7.559 C3.301,7.543 3.381,7.544 3.458,7.560 C3.492,7.567 3.530,7.578 3.565,7.592 C3.607,7.610 3.641,7.628 3.675,7.651 C3.701,7.666 3.733,7.693 3.763,7.723 C3.787,7.747 3.810,7.776 3.832,7.805 C3.860,7.850 3.878,7.883 3.892,7.916 C3.906,7.952 3.916,7.985 3.925,8.022 C3.934,8.070 3.937,8.108 3.937,8.145 C3.937,8.184 3.934,8.221 3.927,8.258 C3.916,8.306 3.906,8.341 3.890,8.377 ZM3.026,8.015 L3.026,8.015 L3.026,8.015 C3.026,8.015 3.026,8.015 3.026,8.015 ZM17.388,5.189 C17.279,5.289 17.136,5.346 16.986,5.346 C16.818,5.346 16.657,5.274 16.544,5.150 C16.437,5.033 16.382,4.879 16.390,4.719 C16.397,4.560 16.466,4.412 16.584,4.305 L17.566,3.410 C17.811,3.187 18.188,3.206 18.410,3.450 C18.517,3.567 18.572,3.720 18.564,3.880 C18.557,4.039 18.488,4.185 18.371,4.293 L17.388,5.189 ZM16.958,8.814 C17.115,8.797 17.270,8.862 17.388,8.969 L18.370,9.865 C18.488,9.973 18.557,10.120 18.564,10.279 C18.572,10.438 18.517,10.592 18.409,10.710 C18.297,10.833 18.136,10.905 17.969,10.905 C17.820,10.905 17.677,10.850 17.567,10.750 L16.583,9.852 C16.466,9.746 16.397,9.599 16.390,9.439 C16.382,9.279 16.437,9.125 16.545,9.007 C16.651,8.891 16.799,8.821 16.958,8.814 Z"
              />
            </svg>
            {sendingPrice !== 0 && (
              <span className="free-ship">
                حمل و نقل رایگان برای سفارشات بالای{" "}
                {sendingPrice.toLocaleString("fa-IR")} هزار تومان!
              </span>
            )}
            {"  "}
            {name && (
              <span className="wel" style={{ fontSize: "14px" }}>
                {name} به بازارکده خوش آمدید
              </span>
            )}
          </div>

          <div></div>
          <div className="ht-right">
            <div className="ht-right_info">
              <ul className="ht-info-list">
                <li>
                  <NavLink to="/profile">حساب کاربری</NavLink>
                </li>
                <li>
                  <NavLink to="/wishlist">لیست علاقه مندیها</NavLink>
                </li>
                <li>
                  <NavLink to="/nextcart">لیست خرید بعدی</NavLink>
                </li>
                {auth ? (
                  <li
                    className="menu-item"
                    role="button"
                    style={{ width: "160px" }}
                    onClick={() => {
                      setAuth(false);
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    خروج از حساب کاربری
                  </li>
                ) : (
                  <li
                    data-toggle="modal"
                    data-target="#login"
                    className="d-flex topmenu-item"
                  >
                    <div>ثبت نام</div>
                    <div className="ml-1 mr-1">یا</div>
                    <div>ورود</div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="header-sticky-wrapper">
          <div className="hs-left">
            <div className="hs-left-logo">
              <NavLink to="/">
                <img
                  src={require("../../assets/images/index1/logo.png")}
                  alt="logo"
                  className="img-fluid header-logo"
                />
              </NavLink>
            </div>
          </div>
          <div className="hs-medium custom-scroll">
            <div className="nav-items main-menu-wraper">
              <ul className="menu-list d-xl-flex">
                <li>
                  <div className="hs-mobile-logo">
                    <img
                      src={require("../../assets/images/index1/logo.png")}
                      alt="logo"
                      className="img-fluid"
                    />
                  </div>
                  <p className="menu-btn c-toggle-btn sidebar-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                  </p>
                </li>

                <NavLink to="/">
                  <li className="menu-item">صفحه اصلی</li>
                </NavLink>

                <li>
                  <NavLink
                    to="/product_category?page=1"
                    style={{ marginLeft: "3em" }}
                  >
                    فروشگاه
                  </NavLink>
                  <div className="drop-menu mega-menu">
                    <ul
                      style={{ display: "flex", justifyContent: "center" }}
                      className="sub-menu"
                    >
                      {headerLinks.length > 0 &&
                        headerLinks.map((each) => {
                          return (
                            <li key={each.id}>
                              <NavLink
                                to={`/product_category?category=${each.id}&page=1`}
                              >
                                {each.categoryTitle}
                              </NavLink>
                              <ul className="super-sub-menu">
                                {each.children.map((link) => {
                                  return (
                                    <li key={link.id}>
                                      <NavLink
                                        to={`/product_category?subcategory=${link.id}&page=1`}
                                      >
                                        {link.subCategoryTitle}
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                    </ul>
                    <div className="mega-menu-info d-lg-flex">
                      <div className="col-lg-4">
                        <div className="mega-menu-infobox text-center">
                          <svg width="34px" height="24px">
                            <path
                              fillRule="evenodd"
                              fill="rgb(96, 186, 190)"
                              d="M32.929,20.763 L29.818,20.763 C29.329,22.624 27.659,23.999 25.678,23.999 C23.698,23.999 22.028,22.624 21.539,20.763 L15.176,20.763 C14.686,22.624 13.016,23.999 11.036,23.999 C9.055,23.999 7.385,22.624 6.896,20.763 L4.107,20.763 C3.515,20.763 3.036,20.274 3.036,19.672 C3.036,19.069 3.515,18.581 4.107,18.581 L6.877,18.581 C7.342,16.683 9.029,15.272 11.036,15.272 C13.042,15.272 14.730,16.683 15.194,18.581 L21.520,18.581 C21.985,16.683 23.672,15.272 25.678,15.272 C27.685,15.272 29.373,16.683 29.837,18.581 L31.857,18.581 L31.857,12.955 L30.297,10.908 L21.964,10.908 C21.372,10.908 20.893,10.420 20.893,9.817 L20.893,2.181 L4.107,2.181 C3.515,2.181 3.036,1.693 3.036,1.090 C3.036,0.488 3.515,-0.001 4.107,-0.001 L21.964,-0.001 C22.556,-0.001 23.036,0.488 23.036,1.090 L23.036,2.181 L27.607,2.181 C28.012,2.181 28.382,2.413 28.565,2.782 L31.779,9.291 L31.777,9.292 L33.775,11.912 C33.921,12.103 34.000,12.339 34.000,12.581 L34.000,19.672 C34.000,20.274 33.520,20.763 32.929,20.763 ZM11.036,17.454 C9.854,17.454 8.893,18.432 8.893,19.636 C8.893,20.839 9.854,21.817 11.036,21.817 C12.217,21.817 13.179,20.839 13.179,19.636 C13.179,18.432 12.217,17.454 11.036,17.454 ZM25.678,17.454 C24.497,17.454 23.536,18.432 23.536,19.636 C23.536,20.839 24.497,21.817 25.678,21.817 C26.860,21.817 27.821,20.839 27.821,19.636 C27.821,18.432 26.860,17.454 25.678,17.454 ZM26.946,4.363 L23.036,4.363 L23.036,8.727 L29.101,8.727 L26.946,4.363 ZM13.036,5.563 C13.036,6.166 12.556,6.654 11.964,6.654 L2.821,6.654 C2.230,6.654 1.750,6.166 1.750,5.563 C1.750,4.960 2.230,4.472 2.821,4.472 L11.964,4.472 C12.556,4.472 13.036,4.960 13.036,5.563 ZM11.286,9.854 C11.286,10.456 10.806,10.944 10.214,10.944 L1.071,10.944 C0.480,10.944 -0.000,10.456 -0.000,9.854 C-0.000,9.252 0.480,8.763 1.071,8.763 L10.214,8.763 C10.806,8.763 11.286,9.252 11.286,9.854 ZM2.821,13.054 L7.750,13.054 C8.342,13.054 8.821,13.542 8.821,14.145 C8.821,14.748 8.342,15.236 7.750,15.236 L2.821,15.236 C2.230,15.236 1.750,14.748 1.750,14.145 C1.750,13.542 2.230,13.054 2.821,13.054 Z"
                            />
                          </svg>
                          <h5 className="e-mm-ib-ttl">حمل و نقل رایگان</h5>
                          {sendingPrice !== 0 && (
                            <p>
                              سفارشات بالای{" "}
                              {sendingPrice.toLocaleString("fa-IR")} هزار تومان
                              حمل و نقل رایگان دارند
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mega-menu-infobox text-center">
                          <svg width="22px" height="27px">
                            <path
                              fillRule="evenodd"
                              fill="rgb(96, 186, 190)"
                              d="M21.856,21.026 C21.816,23.307 20.022,25.196 17.857,25.236 C16.628,25.257 15.411,25.248 14.061,25.235 C13.807,25.230 13.680,25.306 13.553,25.554 C13.096,26.447 12.273,26.963 11.388,26.963 C11.173,26.963 10.954,26.933 10.735,26.870 C9.605,26.543 8.839,25.502 8.831,24.278 C8.825,23.070 9.612,21.966 10.706,21.652 C11.820,21.335 12.908,21.825 13.551,22.928 C13.646,23.092 13.861,23.251 13.992,23.255 C15.134,23.284 16.374,23.289 17.779,23.265 C18.747,23.251 19.517,22.669 19.784,21.769 L19.781,21.769 C19.691,21.777 19.613,21.785 19.536,21.790 C18.831,21.826 18.186,21.602 17.695,21.149 C17.164,20.661 16.860,19.950 16.839,19.149 C16.809,18.022 16.809,16.840 16.839,15.637 C16.873,14.166 17.864,13.074 19.246,12.980 C19.724,12.948 20.237,12.943 20.861,12.966 C21.523,12.988 21.860,13.359 21.862,14.067 L21.869,15.613 C21.879,17.387 21.888,19.222 21.856,21.026 ZM11.376,23.526 C11.375,23.526 11.375,23.526 11.374,23.526 C11.023,23.527 10.718,23.856 10.708,24.245 C10.703,24.453 10.782,24.653 10.924,24.796 C11.046,24.918 11.205,24.984 11.370,24.984 C11.376,24.984 11.383,24.984 11.390,24.984 C11.752,24.972 12.041,24.642 12.034,24.248 C12.028,23.856 11.727,23.526 11.376,23.526 ZM20.016,16.054 C20.015,15.681 20.013,15.304 20.013,14.922 C19.951,14.925 19.870,14.921 19.801,14.919 C19.744,14.918 19.690,14.916 19.638,14.916 C19.498,14.916 19.375,14.927 19.279,14.975 C19.025,15.106 18.737,15.369 18.728,15.539 C18.666,16.645 18.659,17.823 18.706,19.139 C18.713,19.326 18.779,19.482 18.899,19.593 C19.021,19.705 19.199,19.767 19.390,19.755 C19.762,19.739 19.997,19.492 20.003,19.112 C20.023,18.104 20.020,17.108 20.016,16.054 ZM20.972,11.555 C20.921,11.563 20.862,11.569 20.800,11.569 C20.468,11.569 20.029,11.398 19.873,10.558 C19.176,6.804 16.520,3.827 13.263,3.149 C9.478,2.362 6.049,3.889 4.100,7.234 C3.736,7.858 3.500,8.592 3.272,9.299 C3.144,9.693 3.014,10.100 2.861,10.488 C2.729,10.822 2.542,11.225 2.258,11.382 C1.972,11.541 1.669,11.528 1.424,11.356 C1.119,11.140 0.968,10.710 1.040,10.258 C1.434,7.786 2.524,5.650 4.281,3.907 C6.206,1.997 8.723,0.945 11.369,0.945 C11.372,0.945 11.374,0.945 11.376,0.945 C16.478,0.949 20.813,4.851 21.683,10.222 C21.803,10.961 21.538,11.460 20.972,11.555 ZM1.928,12.968 C2.456,12.957 3.004,12.944 3.541,12.982 C4.865,13.078 5.855,14.166 5.896,15.571 C5.931,16.769 5.929,17.988 5.891,19.197 C5.845,20.689 4.773,21.798 3.388,21.798 C3.368,21.798 3.349,21.798 3.329,21.798 C1.960,21.766 0.905,20.619 0.876,19.130 C0.866,18.561 0.868,17.991 0.871,17.423 C0.871,17.149 0.872,16.875 0.872,16.600 L0.871,15.983 C0.870,15.364 0.869,14.747 0.873,14.128 C0.880,13.343 1.205,12.986 1.928,12.968 ZM2.729,19.027 C2.734,19.451 3.004,19.762 3.371,19.766 L3.372,19.766 C3.375,19.766 3.378,19.766 3.380,19.766 C3.753,19.766 4.048,19.432 4.055,19.002 C4.072,17.918 4.071,16.799 4.054,15.675 C4.048,15.263 3.829,15.006 3.437,14.953 C3.271,14.931 3.103,14.935 2.905,14.941 C2.846,14.943 2.786,14.945 2.724,14.946 L2.722,16.080 C2.720,17.080 2.719,18.054 2.729,19.027 ZM7.821,5.471 C8.936,4.890 10.157,4.589 11.440,4.624 C11.454,4.624 11.468,4.624 11.483,4.624 C12.693,4.624 13.859,4.916 14.945,5.493 C15.541,5.809 15.754,6.364 15.489,6.909 C15.374,7.143 15.199,7.304 14.981,7.376 C14.894,7.405 14.802,7.419 14.707,7.419 C14.522,7.419 14.322,7.366 14.119,7.261 C12.316,6.337 10.466,6.330 8.619,7.237 C8.310,7.389 8.015,7.422 7.772,7.334 C7.555,7.255 7.383,7.083 7.273,6.837 C7.032,6.297 7.242,5.773 7.821,5.471 Z"
                            />
                          </svg>
                          <h5 className="e-mm-ib-ttl">پشتیبانی آنلاین ۷-۲۴</h5>
                          <p>مشاوره و تماس رایگان ۷-۲۴</p>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mega-menu-infobox text-center">
                          <svg width="30px" height="27px">
                            <path
                              fillRule="evenodd"
                              fill="rgb(96, 186, 190)"
                              d="M5.529,19.607 C4.965,19.607 4.505,19.140 4.505,18.564 C4.505,17.989 4.965,17.521 5.529,17.521 L9.125,17.521 C9.688,17.521 10.147,17.989 10.147,18.564 C10.147,19.140 9.688,19.607 9.125,19.607 L5.529,19.607 ZM28.003,26.963 L2.832,26.963 C1.772,26.963 0.909,26.082 0.909,25.000 L0.909,8.451 C0.909,7.369 1.772,6.488 2.832,6.488 L12.720,6.488 C13.284,6.488 13.743,6.956 13.743,7.531 C13.743,8.107 13.284,8.574 12.720,8.574 L2.955,8.574 L2.955,12.005 L12.720,12.005 C13.284,12.005 13.743,12.473 13.743,13.047 C13.743,13.623 13.284,14.091 12.720,14.091 L2.955,14.091 L2.955,24.876 L27.879,24.876 L27.879,18.564 C27.879,17.989 28.339,17.521 28.903,17.521 C29.466,17.521 29.926,17.989 29.926,18.564 L29.926,25.000 C29.926,26.082 29.063,26.963 28.003,26.963 ZM23.120,19.468 C22.965,19.559 22.789,19.607 22.609,19.607 C22.430,19.607 22.254,19.559 22.099,19.468 C17.138,16.547 15.293,13.560 15.293,8.451 L15.293,4.773 C15.293,4.356 15.536,3.980 15.911,3.813 L22.204,1.056 C22.465,0.943 22.753,0.945 23.012,1.055 L29.307,3.813 C29.682,3.980 29.926,4.356 29.926,4.773 L29.926,8.451 C29.926,13.567 28.081,16.554 23.120,19.468 ZM27.879,5.461 L22.609,3.150 L17.339,5.461 L17.339,8.451 C17.339,12.663 18.671,14.918 22.609,17.353 C26.548,14.922 27.879,12.668 27.879,8.451 L27.879,5.461 ZM21.710,13.171 L21.673,13.171 C21.340,13.155 21.039,12.980 20.859,12.705 L19.061,9.948 C18.750,9.471 18.877,8.823 19.345,8.503 C19.567,8.351 19.833,8.295 20.101,8.346 C20.374,8.399 20.609,8.558 20.764,8.793 L21.787,10.359 L24.507,6.879 C24.680,6.662 24.925,6.526 25.197,6.496 C25.465,6.459 25.734,6.543 25.948,6.716 C26.386,7.075 26.457,7.731 26.108,8.181 L22.512,12.778 C22.316,13.028 22.024,13.171 21.710,13.171 Z"
                            />
                          </svg>
                          <h5 className="e-mm-ib-ttl">عودت وجه و گارانتی</h5>
                          <p>۱۰۰% عودت وجه و گارانتی</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <NavLink to="/blog_category/1">
                  <li className="menu-item">وبلاگ</li>
                </NavLink>
                <a
                  href={"https://bazarkadeh.com/bazarkhareji.aspx"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    transform: "translateX(15px)",
                  }}
                >
                  <li className="menu-item">بازار خارجی</li>
                </a>
                <NavLink to="/about">
                  <li className="menu-item">درباره ما</li>
                </NavLink>
                <NavLink to="/contact">
                  <li className="menu-item">ارتباط با ما</li>
                </NavLink>
              </ul>
            </div>
          </div>
          <div className="hs-right">
            <div className="hs-search-cart">
              <ul className="hs-search-cart-list">
                <li role="button" onClick={() => setSearchDrawer(true)}>
                  <div className="hs-search-btn">
                    <svg width="17px" height="17px">
                      <path
                        fillRule="evenodd"
                        fill="rgb(125, 143, 179)"
                        d="M16.337,15.218 C15.846,14.710 15.347,14.210 14.848,13.711 L12.326,11.190 C14.647,7.813 13.433,3.788 10.926,1.947 C8.249,-0.020 4.631,0.233 2.322,2.546 C0.010,4.862 -0.267,8.510 1.664,11.217 C2.621,12.558 4.223,13.526 5.949,13.805 C7.163,14.001 8.993,13.951 10.900,12.633 L10.981,12.724 C11.161,12.925 11.344,13.131 11.537,13.326 C12.605,14.410 13.674,15.490 14.755,16.559 C14.969,16.769 15.226,16.921 15.462,16.974 C15.534,16.991 15.604,16.999 15.674,16.999 C16.017,16.999 16.324,16.804 16.522,16.452 C16.757,16.034 16.690,15.583 16.337,15.218 ZM10.177,4.051 C11.029,4.910 11.496,6.055 11.495,7.273 C11.493,8.489 11.019,9.630 10.162,10.488 C9.308,11.344 8.173,11.815 6.967,11.815 C6.964,11.815 6.961,11.815 6.958,11.815 C5.751,11.813 4.610,11.331 3.748,10.457 C2.891,9.590 2.425,8.452 2.436,7.255 C2.457,4.709 4.449,2.717 6.972,2.717 C6.974,2.717 6.977,2.717 6.979,2.717 C8.189,2.718 9.325,3.192 10.177,4.051 Z"
                      />
                    </svg>
                  </div>
                </li>

                <li
                  role="button"
                  onClick={() => setShow(true)}
                  className="hs-cart-box"
                >
                  <div className="hs-cartbox-inner d-inline">
                    <svg width="22px" height="20px">
                      <path
                        fillRule="evenodd"
                        fill="rgb(125, 143, 179)"
                        d="M18.692,2.761 C18.200,1.488 17.025,0.666 15.700,0.666 L15.512,0.666 L15.512,0.666 C15.512,0.298 15.223,-0.001 14.867,-0.001 L7.133,-0.001 C6.777,-0.001 6.488,0.298 6.488,0.666 L6.488,0.666 L6.300,0.666 C4.974,0.666 3.800,1.488 3.308,2.761 L1.239,7.999 L-0.000,7.999 L-0.000,9.333 L0.927,9.333 C1.223,9.333 1.480,9.540 1.553,9.838 L3.685,18.485 C3.901,19.376 4.672,19.999 5.561,19.999 L16.439,19.999 C17.328,19.999 18.142,19.376 18.358,18.484 L20.447,9.838 C20.520,9.540 20.776,9.333 21.073,9.333 L22.000,9.333 L22.000,7.999 L20.761,7.999 L18.692,2.761 ZM7.777,17.333 L6.488,17.333 L6.488,10.666 L7.777,10.666 L7.777,17.333 ZM11.645,17.333 L10.355,17.333 L10.355,10.666 L11.645,10.666 L11.645,17.333 ZM15.512,17.333 L14.223,17.333 L14.223,10.666 L15.512,10.666 L15.512,17.333 ZM4.505,3.256 C4.800,2.493 5.505,1.999 6.300,1.999 L6.488,1.999 L6.488,1.999 C6.488,2.368 6.777,2.666 7.133,2.666 L14.867,2.666 C15.223,2.666 15.512,2.368 15.512,1.999 L15.512,1.999 L15.700,1.999 C16.495,1.999 17.200,2.493 17.495,3.256 L19.372,7.999 L2.628,7.999 L4.505,3.256 Z"
                      />
                    </svg>
                    {props.cartItems.length > 0 && (
                      <span className="hs-cart-circle">
                        {props.cartItems.length.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </div>
                </li>
                <li role="button" onClick={() => setShow(true)}>
                  <div
                    style={{
                      marginRight: "20px",
                      color: "#4d5b77",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {props.totalPrice.toLocaleString("fa-IR")} تومان
                  </div>
                </li>

                <li role="button">
                  <div onClick={() => setMenuDrawer(true)} className="menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
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
  };
};
export default connect(mapState, mapDis)(withRouter(Header));
