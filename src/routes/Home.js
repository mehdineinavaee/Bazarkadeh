import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import LazyLoad from "react-lazyload";
import axios from "axios";

const loadJs = require("loadjs");

function Home() {
  const [loading, setLoading] = useState(true);
  const [newItems, setNewItems] = useState([]);
  const [vizhe, setVizhe] = useState([]);
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}Slider.aspx`)
      .then((res) => {
        setSliders(res.data);
        axios
          .get(`${process.env.REACT_APP_BASE_URL}SpecialProduct.aspx`)
          .then((res) => {
            setVizhe(res.data);
            axios
              .get(`${process.env.REACT_APP_BASE_URL}TopProduct.aspx`)
              .then((res) => {
                setNewItems(res.data);
                loadJs("js/custom.js");
                setLoading(false);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Layout loading={loading} title="صفحه اصلی">
      {sliders && sliders.length > 0 && (
        <section className="e-banner-wrapper e-banner-cloth">
          <div className="e-banner-inwrap">
            <div className="swiper-container  d-flex justify-content-center">
              <div className="swiper-wrapper">
                {sliders.map((slide) => {
                  return (
                    <div
                      key={slide.id}
                      className="swiper-slide d-flex justify-content-center slider-banner"
                    >
                      <img
                        src={slide.sliderurl}
                        alt="pic"
                        className="img-fluid"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="swiper-button-next e-swiper-next">
                <span>
                  <svg width="8px" height="16px">
                    <path
                      fillRule="evenodd"
                      fill="rgb(122, 183, 186)"
                      d="M1.723,15.744 C1.583,15.909 1.396,15.999 1.196,15.999 C0.997,15.999 0.810,15.909 0.670,15.744 L0.223,15.219 C-0.067,14.877 -0.067,14.323 0.223,13.982 L5.312,8.003 L0.218,2.017 C0.078,1.852 0.000,1.632 0.000,1.398 C0.000,1.163 0.078,0.944 0.218,0.779 L0.664,0.255 C0.804,0.090 0.991,-0.001 1.191,-0.001 C1.390,-0.001 1.577,0.090 1.718,0.255 L7.783,7.381 C7.924,7.547 8.001,7.768 8.000,8.002 C8.001,8.238 7.924,8.458 7.783,8.624 L1.723,15.744 Z"
                    />
                  </svg>
                </span>
              </div>
              <div className="swiper-button-prev e-swiper-pre">
                <svg width="8px" height="16px">
                  <path
                    fillRule="evenodd"
                    fill="rgb(122, 183, 186)"
                    d="M6.277,15.744 C6.417,15.909 6.604,15.999 6.803,15.999 C7.003,15.999 7.190,15.909 7.330,15.744 L7.776,15.219 C8.067,14.877 8.067,14.323 7.776,13.982 L2.688,8.003 L7.782,2.017 C7.922,1.852 8.000,1.632 8.000,1.398 C8.000,1.163 7.922,0.944 7.782,0.779 L7.336,0.255 C7.195,0.090 7.008,-0.001 6.809,-0.001 C6.610,-0.001 6.422,0.090 6.282,0.255 L0.217,7.381 C0.076,7.547 -0.001,7.768 -0.000,8.002 C-0.001,8.238 0.076,8.458 0.217,8.624 L6.277,15.744 Z"
                  />
                </svg>
              </div>

              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>
      )}

      <div className="e-topads-wrappper e-topads-cloth">
        <div className="container">
          <div className="row">
            <div className="col-sm-3 col-12">
              <div className="e-topads-inner e-cads-inner mt-4">
                <img
                  src={require("../assets/images/index1/index_ads1.jpg")}
                  alt="pic"
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="e-topads-inner e-cads-inner mt-4">
                <img
                  src={require("../assets/images/index1/index_ads2.jpg")}
                  alt="pic"
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="col-sm-3 col-12">
              <div className="e-topads-inner e-cads-inner mt-4">
                <img
                  src={require("../assets/images/index1/index_ads3.jpg")}
                  alt="pic"
                  className="img-fluid"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="e-best-slr-wrap e-best-slr-cloth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="e-heading-wrap mb-43 text-center">
                <h2 className="e-heading-title">محصولات ویژه </h2>
                <p style={{ marginTop: "10px" }} className="e-heading-subtitle">
                  محصولات انحصاری تازه وارد شده اند. آنها را بررسی کنید
                </p>
              </div>
            </div>
          </div>
          {vizhe.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="bs-sliderwrap c-sliderwrap">
                  <div className="swiper-container ">
                    <div className="swiper-wrapper">
                      {vizhe.map((each) => {
                        const price = parseInt(each.priceTakhfif);
                        return (
                          <div key={each.id} className="swiper-slide">
                            <NavLink to={`/product/${each.id}`}>
                              <div className="c-product-box">
                                <div className="na-top-sec text-center">
                                  <div className="na-imgbox">
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
                                  </div>

                                  <span className="new-tag">ویژه </span>
                                </div>
                                <div className="na-top-heading text-center">
                                  <div className="na-name">{each.title}</div>
                                  <h2 className="na-price">
                                    {price && price.toLocaleString("fa-IR")}{" "}
                                    تومان
                                  </h2>
                                </div>
                              </div>
                            </NavLink>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="swiper-button-prev e-swiper-pre">
                    <span>
                      <svg width="8px" height="16px">
                        <path
                          fillRule="evenodd"
                          fill="rgb(122, 183, 186)"
                          d="M1.723,15.744 C1.583,15.909 1.396,15.999 1.196,15.999 C0.997,15.999 0.810,15.909 0.670,15.744 L0.223,15.219 C-0.067,14.877 -0.067,14.323 0.223,13.982 L5.312,8.003 L0.218,2.017 C0.078,1.852 0.000,1.632 0.000,1.398 C0.000,1.163 0.078,0.944 0.218,0.779 L0.664,0.255 C0.804,0.090 0.991,-0.001 1.191,-0.001 C1.390,-0.001 1.577,0.090 1.718,0.255 L7.783,7.381 C7.924,7.547 8.001,7.768 8.000,8.002 C8.001,8.238 7.924,8.458 7.783,8.624 L1.723,15.744 Z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="swiper-button-next e-swiper-next">
                    <svg width="8px" height="16px">
                      <path
                        fillRule="evenodd"
                        fill="rgb(122, 183, 186)"
                        d="M6.277,15.744 C6.417,15.909 6.604,15.999 6.803,15.999 C7.003,15.999 7.190,15.909 7.330,15.744 L7.776,15.219 C8.067,14.877 8.067,14.323 7.776,13.982 L2.688,8.003 L7.782,2.017 C7.922,1.852 8.000,1.632 8.000,1.398 C8.000,1.163 7.922,0.944 7.782,0.779 L7.336,0.255 C7.195,0.090 7.008,-0.001 6.809,-0.001 C6.610,-0.001 6.422,0.090 6.282,0.255 L0.217,7.381 C0.076,7.547 -0.001,7.768 -0.000,8.002 C-0.001,8.238 0.076,8.458 0.217,8.624 L6.277,15.744 Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="e-best-slr-wrap e-best-slr-cloth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="e-heading-wrap mb-43 text-center">
                <h2 className="e-heading-title">محصولات جدید</h2>
                <p style={{ marginTop: "10px" }} className="e-heading-subtitle">
                  محصولات انحصاری تازه وارد شده اند. آنها را بررسی کنید
                </p>
              </div>
            </div>
          </div>
          {newItems.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="bs-sliderwrap c-sliderwrap">
                  <div className="swiper-container ">
                    <div className="swiper-wrapper">
                      {newItems.map((each) => {
                        const price = parseInt(each.priceTakhfif);
                        return (
                          <div key={each.id} className="swiper-slide">
                            <NavLink to={`/product/${each.id}`}>
                              <div className="c-product-box">
                                <div className="na-top-sec text-center">
                                  <div className="na-imgbox">
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
                                  </div>
                                </div>
                                <div className="na-top-heading text-center">
                                  <div className="na-name">{each.title}</div>
                                  <h2 className="na-price">
                                    {price && price.toLocaleString("fa-IR")}{" "}
                                    تومان
                                  </h2>
                                </div>
                              </div>
                            </NavLink>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="swiper-button-prev e-swiper-pre">
                    <span>
                      <svg width="8px" height="16px">
                        <path
                          fillRule="evenodd"
                          fill="rgb(122, 183, 186)"
                          d="M1.723,15.744 C1.583,15.909 1.396,15.999 1.196,15.999 C0.997,15.999 0.810,15.909 0.670,15.744 L0.223,15.219 C-0.067,14.877 -0.067,14.323 0.223,13.982 L5.312,8.003 L0.218,2.017 C0.078,1.852 0.000,1.632 0.000,1.398 C0.000,1.163 0.078,0.944 0.218,0.779 L0.664,0.255 C0.804,0.090 0.991,-0.001 1.191,-0.001 C1.390,-0.001 1.577,0.090 1.718,0.255 L7.783,7.381 C7.924,7.547 8.001,7.768 8.000,8.002 C8.001,8.238 7.924,8.458 7.783,8.624 L1.723,15.744 Z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="swiper-button-next e-swiper-next">
                    <svg width="8px" height="16px">
                      <path
                        fillRule="evenodd"
                        fill="rgb(122, 183, 186)"
                        d="M6.277,15.744 C6.417,15.909 6.604,15.999 6.803,15.999 C7.003,15.999 7.190,15.909 7.330,15.744 L7.776,15.219 C8.067,14.877 8.067,14.323 7.776,13.982 L2.688,8.003 L7.782,2.017 C7.922,1.852 8.000,1.632 8.000,1.398 C8.000,1.163 7.922,0.944 7.782,0.779 L7.336,0.255 C7.195,0.090 7.008,-0.001 6.809,-0.001 C6.610,-0.001 6.422,0.090 6.282,0.255 L0.217,7.381 C0.076,7.547 -0.001,7.768 -0.000,8.002 C-0.001,8.238 0.076,8.458 0.217,8.624 L6.277,15.744 Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <LazyLoad
        once
        placeholder={<div />}
        offset={50}
        // height={600}
      >
        <div
          style={{ paddingBottom: "3em", marginTop: "2em" }}
          className="e-midads-wrappper"
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="e-topads-inner e-cads-inner">
                  <img
                    src={require("../assets/images/index1/mid_ads1.jpg")}
                    alt="pic"
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="e-topads-inner e-cads-inner">
                  <img
                    src={require("../assets/images/index1/mid_ads2.jpg")}
                    alt="pic"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazyLoad>
    </Layout>
  );
}

export default Home;
