import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import Pagination from "../components/Pagination";
import axios from "axios";
const queryString = require("query-string");
function ProductCategorySidebar({ match, location, history }) {
  const { id } = match.params;
  const [loading, setLoading] = React.useState(true);
  const parsed = queryString.parse(location.search);
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [listView, setListView] = React.useState(false);
  const [totalLength, setTotalLength] = React.useState(0);

  React.useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}productpagecount.aspx?adminid=${id}`
      )
      .then((res) => {
        setTotalLength(JSON.parse(res.data));
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}AdminDetail.aspx?adminID=${id}`
          )
          .then((res) => {
            setUser(res.data[0]);
            axios
              .get(
                `${process.env.REACT_APP_BASE_URL}Product.aspx?AdminID=${id}&page=${parsed.page}`
              )
              .then((res) => {
                setData(res.data);
                setLoading(false);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      });
  }, [location]);

  const [paginationPage, setPaginationPage] = useState(JSON.parse(parsed.page));
  const onChange = (componentPage) => {
    if (parsed.page !== JSON.stringify(componentPage)) {
      setLoading(true);
      history.push(`/seller/${id}?page=${componentPage}`);
      setPaginationPage(componentPage);
    }
  };
  return (
    <Layout loading={loading} title={`${user && user.title}`}>
      {/* <!-- Breadcumbs start --> */}
      <div class="e-breadcumb-wrap text-center">
        <h2 class="e-breadcumb-title">{user && user.title}</h2>
        <ul class="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه </NavLink>
          </li>
          <li>
            <NavLink to={`/seller/${user && user.id}?page=1`}>
              {user && user.title}
            </NavLink>
          </li>
        </ul>
      </div>
      {/* <!-- Product Category start --> */}
      <section class="e-procategory-wrap e-procategory-sidebar">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="e-filter-bar">
                <div class="e-filter-leftbar">
                  <p class="e-filter-items">
                    نمایش محصولات {user && user.title}
                  </p>
                </div>
                <div class="e-filter-rightbar">
                  <ul class="e-filter-list">
                    <li role="button" onClick={() => setListView(false)}>
                      <div className={!listView ? "active" : ""}>
                        <svg width="19px" height="19px">
                          <path
                            fillRule="evenodd"
                            fill="rgb(125, 143, 179)"
                            d="M18.029,17.226 C18.028,17.803 17.804,18.028 17.230,18.029 C14.980,18.031 12.731,18.031 10.481,18.029 C9.904,18.029 9.676,17.805 9.676,17.231 C9.673,14.981 9.674,12.731 9.676,10.481 C9.676,9.907 9.906,9.676 10.478,9.675 C12.728,9.673 14.977,9.673 17.227,9.675 C17.804,9.676 18.028,9.902 18.029,10.477 C18.031,11.602 18.030,12.727 18.030,13.852 C18.030,14.976 18.031,16.101 18.029,17.226 ZM16.725,10.991 C14.786,10.991 12.894,10.991 10.988,10.991 C10.988,12.911 10.988,14.802 10.988,16.708 C12.917,16.708 14.818,16.708 16.725,16.708 C16.725,14.790 16.725,12.908 16.725,10.991 ZM17.227,8.386 C16.088,8.389 14.950,8.387 13.811,8.387 C12.700,8.387 11.588,8.389 10.477,8.386 C9.900,8.384 9.676,8.161 9.676,7.582 C9.673,5.332 9.673,3.083 9.676,0.833 C9.676,0.261 9.909,0.031 10.481,0.030 C12.731,0.029 14.981,0.029 17.231,0.030 C17.802,0.031 18.029,0.260 18.029,0.835 C18.031,3.085 18.031,5.335 18.029,7.585 C18.029,8.160 17.804,8.385 17.227,8.386 ZM16.710,1.347 C14.785,1.347 12.893,1.347 10.982,1.347 C10.982,3.257 10.982,5.138 10.982,7.063 C12.918,7.063 14.818,7.063 16.710,7.063 C16.710,5.135 16.710,3.244 16.710,1.347 ZM7.558,8.386 C6.433,8.389 5.308,8.387 4.183,8.387 C3.071,8.387 1.959,8.389 0.848,8.386 C0.250,8.385 0.030,8.162 0.030,7.558 C0.029,5.321 0.029,3.085 0.030,0.848 C0.031,0.256 0.260,0.030 0.860,0.030 C3.096,0.029 5.333,0.029 7.570,0.030 C8.164,0.030 8.386,0.255 8.386,0.859 C8.388,3.095 8.388,5.332 8.386,7.569 C8.386,8.168 8.164,8.385 7.558,8.386 ZM7.060,1.355 C5.127,1.355 3.234,1.355 1.356,1.355 C1.356,3.285 1.356,5.178 1.356,7.076 C3.278,7.076 5.162,7.076 7.060,7.076 C7.060,5.130 7.060,3.237 7.060,1.355 ZM0.836,9.675 C3.086,9.673 5.336,9.673 7.586,9.675 C8.162,9.676 8.386,9.901 8.386,10.480 C8.388,12.730 8.388,14.980 8.386,17.229 C8.385,17.805 8.159,18.028 7.582,18.029 C6.444,18.031 5.306,18.030 4.167,18.030 C3.056,18.030 1.944,18.031 0.833,18.029 C0.262,18.028 0.031,17.798 0.030,17.227 C0.029,14.977 0.029,12.727 0.030,10.477 C0.031,9.910 0.264,9.676 0.836,9.675 ZM1.336,16.706 C3.274,16.706 5.174,16.706 7.064,16.706 C7.064,14.778 7.064,12.887 7.064,10.992 C5.136,10.992 3.246,10.992 1.336,10.992 C1.336,12.904 1.336,14.786 1.336,16.706 Z"
                          />
                        </svg>
                      </div>
                    </li>
                    <li role="button" onClick={() => setListView(true)}>
                      <div className={listView ? "active" : ""}>
                        <svg width="21px" height="18px">
                          <path
                            fillRule="evenodd"
                            fill="rgb(125, 143, 179)"
                            d="M20.196,3.530 C19.432,3.537 18.668,3.532 17.903,3.532 C16.952,3.533 16.001,3.532 15.049,3.532 C13.427,3.532 11.805,3.533 10.183,3.532 C10.043,3.532 9.896,3.550 9.764,3.513 C9.412,3.413 9.176,3.171 9.213,2.758 C9.247,2.384 9.471,2.157 9.829,2.123 C9.999,2.107 10.172,2.119 10.343,2.119 C13.541,2.119 16.738,2.119 19.935,2.119 C20.029,2.119 20.122,2.117 20.216,2.119 C20.717,2.130 21.005,2.392 21.000,2.830 C20.995,3.246 20.683,3.526 20.196,3.530 ZM10.041,4.762 C12.211,4.758 14.381,4.758 16.551,4.761 C17.084,4.762 17.395,5.036 17.390,5.478 C17.384,5.918 17.072,6.176 16.535,6.177 C15.458,6.179 14.380,6.177 13.303,6.177 C13.303,6.176 13.303,6.175 13.303,6.174 C12.210,6.174 11.117,6.177 10.025,6.173 C9.525,6.171 9.218,5.907 9.207,5.486 C9.197,5.051 9.519,4.762 10.041,4.762 ZM5.797,17.990 C4.362,18.002 2.926,17.970 1.491,18.000 C0.735,18.015 -0.061,17.194 0.004,16.351 C0.063,15.601 0.017,14.841 0.017,14.085 C0.017,13.330 0.014,12.574 0.017,11.818 C0.021,10.937 0.622,10.247 1.449,10.234 C2.900,10.213 4.351,10.213 5.802,10.229 C6.606,10.239 7.220,10.905 7.229,11.774 C7.245,13.335 7.246,14.898 7.233,16.459 C7.226,17.324 6.604,17.984 5.797,17.990 ZM5.924,12.054 C5.926,11.756 5.834,11.633 5.548,11.635 C4.271,11.645 2.994,11.645 1.716,11.636 C1.440,11.634 1.327,11.734 1.329,12.043 C1.339,13.418 1.341,14.793 1.327,16.167 C1.324,16.518 1.471,16.589 1.752,16.583 C2.375,16.570 2.999,16.579 3.622,16.578 C4.260,16.578 4.899,16.570 5.538,16.583 C5.813,16.588 5.927,16.489 5.925,16.178 C5.915,14.803 5.915,13.429 5.924,12.054 ZM5.756,7.763 C4.336,7.776 2.916,7.776 1.496,7.763 C0.621,7.755 0.019,7.074 0.017,6.127 C0.015,4.615 0.014,3.103 0.018,1.592 C0.020,0.675 0.624,0.019 1.487,0.005 C2.204,-0.006 2.922,0.003 3.640,0.003 C4.343,0.002 5.045,-0.005 5.747,0.005 C6.631,0.017 7.223,0.637 7.231,1.581 C7.243,3.109 7.242,4.638 7.231,6.166 C7.225,7.091 6.613,7.754 5.756,7.763 ZM5.494,1.409 C4.245,1.424 2.996,1.426 1.747,1.409 C1.409,1.404 1.318,1.544 1.327,1.883 C1.345,2.555 1.333,3.227 1.333,3.899 C1.333,4.571 1.344,5.244 1.328,5.915 C1.320,6.240 1.423,6.359 1.732,6.356 C2.980,6.342 4.229,6.338 5.478,6.357 C5.839,6.363 5.928,6.214 5.924,5.853 C5.908,4.526 5.908,3.198 5.924,1.871 C5.928,1.516 5.818,1.405 5.494,1.409 ZM10.026,14.994 C12.194,14.989 14.362,14.988 16.530,14.992 C17.083,14.993 17.376,15.246 17.384,15.689 C17.392,16.149 17.086,16.400 16.502,16.402 C15.441,16.406 14.381,16.403 13.320,16.403 C12.228,16.403 11.136,16.407 10.045,16.401 C9.507,16.398 9.195,16.124 9.208,15.687 C9.220,15.269 9.530,14.996 10.026,14.994 ZM15.069,13.585 C13.370,13.585 11.671,13.582 9.972,13.587 C9.598,13.588 9.282,13.421 9.246,13.036 C9.223,12.794 9.417,12.508 9.565,12.280 C9.623,12.190 9.821,12.174 9.955,12.174 C13.384,12.169 16.813,12.167 20.242,12.172 C20.701,12.173 20.994,12.460 21.000,12.867 C21.006,13.299 20.715,13.575 20.213,13.577 C18.498,13.583 16.784,13.579 15.069,13.579 C15.069,13.581 15.069,13.583 15.069,13.585 Z"
                          />
                        </svg>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`e-procategory-inner ${listView && "list-view"}`}>
                <ul>
                  {data.length > 0 ? (
                    data.map((each, index) => {
                      return (
                        <li>
                          <div className="e-procategory-box">
                            <div className="procategory-gridbox">
                              <div className="c-product-box">
                                <div className="na-top-sec text-center">
                                  <div className="na-imgbox">
                                    <NavLink to={`/product/${each.id}`}>
                                      <div className="na-mainimg">
                                        <img
                                          style={{
                                            width: "300px",
                                            height: "300px",
                                          }}
                                          src={each.img}
                                          alt="product-img"
                                          className="img-fluid"
                                        />
                                      </div>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="na-top-heading text-center">
                                  <NavLink
                                    to={`/product/${each.id}`}
                                    className="na-name"
                                  >
                                    {each.title}
                                  </NavLink>
                                  <NavLink to={`/product/${each.id}`}>
                                    <h2 className="na-price">
                                      {JSON.parse(
                                        each.priceTakhfif
                                      ).toLocaleString("fa-IR")}{" "}
                                      تومان
                                    </h2>
                                  </NavLink>
                                </div>
                              </div>
                            </div>

                            <div className="procategory-listbox">
                              <div className="pc-top-heading ">
                                <NavLink to={`/product/${each.id}`}>
                                  <div className="na-name">{each.title}</div>
                                  <h2 className="na-price">
                                    {JSON.parse(
                                      each.priceTakhfif
                                    ).toLocaleString("fa-IR")}{" "}
                                    تومان
                                  </h2>
                                  <p
                                    style={{ color: "#7d8fb3" }}
                                    className="procategory-des"
                                  >
                                    {each.description}
                                  </p>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <div style={{ marginRight: "20px" }}>محصولی یافت نشد </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* Pagination */}
          {data && data.length > 0 && totalLength * 16 > 0 && !loading && (
            <div style={{ marginTop: "3em" }} className="row">
              <div className="col-12">
                <Pagination
                  lang="english"
                  onChange={onChange}
                  currentPage={paginationPage}
                  totalItemsLength={totalLength * 16}
                  itemsPerPage={16}
                  showLessPages={true}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default ProductCategorySidebar;
