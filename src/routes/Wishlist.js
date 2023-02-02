import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import LoginModal from "../components/Header/LoginModal";
import axios from "axios";
function Wishlist() {
  const [wishlistItems, setWishlistitems] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const requestAll = async (requestItems) => {
    return await Promise.all(
      requestItems.map(async (each) => {
        try {
          return await axios.get(
            `${process.env.REACT_APP_BASE_URL}Product.aspx?productID=${each.productID}`
          );
        } catch (err) {
          console.log(err);
        }
      })
    );
  };

  const getUserData = async () => {
    setLoading(true);
    const isSignedIn = localStorage.getItem("auth");
    if (isSignedIn === "true") {
      const localPhone = await localStorage.getItem("phone");
      const phone = JSON.parse(localPhone);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}UserFavorite.aspx?phone=${phone}`
        )
        .then(async (res) => {
          const p = await requestAll(res.data);
          const i = [];
          setIsLoggedIn(true);
          p.forEach((b) => {
            b.data.forEach((h) => {
              if (h !== undefined && h.title) {
                i.push(b);
              }
            });
          });
          if (i.length > 0) {
            setWishlistitems(i);
          } else {
            setWishlistitems([]);
          }
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  };
  const removeFromFav = async (id) => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}DeleteFavorite.aspx?phone=${phone}&id=${id}`
      )
      .then((res) => {
        getUserData();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  React.useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout loading={loading} title="علاقه مندی ها">
      {/* <!-- Breadcumbs start --> */}
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">علاقه مندی ها</h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه </NavLink>
          </li>
          <li>
            <NavLink to="/wishlist">علاقه مندی ها</NavLink>
          </li>
        </ul>
      </div>

      {isLoggedIn && !loading ? (
        wishlistItems.length > 0 ? (
          <div className="e-shopcart-wrap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="e-shopcart-sec">
                    <div className="shopcart-table-wrap mb-30">
                      <form className="table-responsive">
                        <table className="shopcart-table">
                          <thead>
                            <tr>
                              <th>محصول </th>
                              <th>قیمت </th>
                              <th>گزینه</th>
                              <th>&nbsp;</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wishlistItems.length > 0 &&
                              wishlistItems.map((each, index) => {
                                const title = each.data[0]?.title;
                                const img = each.data[0]?.img;
                                const priceTakhfif = each.data[0]?.priceTakhfif;
                                const id = each.data[0]?.id;
                                return (
                                  <tr key={index} className="e-remove-wrap">
                                    <td>
                                      <div className="sc-productwrap">
                                        <NavLink
                                          to={`/product/${id}`}
                                          className="sc-product-thumb"
                                        >
                                          <img
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                            }}
                                            src={img}
                                            alt="محصول"
                                            className="img-fluid"
                                          />
                                        </NavLink>
                                        <div className="sc-product-details">
                                          <NavLink
                                            to={`/product/${id}`}
                                            className="sc-product-ttl"
                                          >
                                            {title}
                                          </NavLink>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="sc-product-prc">
                                        {priceTakhfif &&
                                          JSON.parse(
                                            priceTakhfif
                                          ).toLocaleString("fa-IR")}{" "}
                                        تومان
                                      </span>
                                    </td>

                                    <td>
                                      <NavLink to={`/product/${id}`}>
                                        <div className="e-btn wishlist-ac">
                                          افزودن به سبد{" "}
                                        </div>
                                      </NavLink>
                                    </td>
                                    <td>
                                      <div
                                        role="button"
                                        onClick={() => {
                                          if (each.data[0].id) {
                                            removeFromFav(each.data[0].id);
                                          }
                                        }}
                                        className="sc-produc-remove e-remove-product"
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
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="h3">لیست علاقه مندی شما خالیست!</div>
            <NavLink
              style={{ marginTop: "2em", marginBottom: "15em" }}
              className="e-btn light h5"
              to="/product_category?page=1"
            >
              <div className="e-btn light">جستجوی کالاها</div>
            </NavLink>
          </div>
        )
      ) : (
        <>
          <LoginModal />
          <div className="text-center" style={{ padding: "10em 0" }}>
            <div style={{ fontSize: "1.3em" }}>
              لطفا ابتدا ثبت نام و یا به حساب کاربری خود وارد شوید .
            </div>
            <div className="d-flex justify-content-center">
              <div
                style={{ marginTop: "2em" }}
                data-toggle="modal"
                data-target="#login"
                className="d-flex topmenu-item e-btn light"
              >
                ثبت نام یا ورود
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Wishlist;
