import React from "react";

// Newsletter Form
import { Formik, Form } from "formik";
import * as yup from "yup";
import { NavLink } from "react-router-dom";
import axios from "axios";
function Footer() {
  // Newsletter Form
  const initialValues = {
    phone: "",
  };
  const phoneRegExp =
    /(0|\+98)?([ ]|,|-|[()]){0,2}9[1|2|3|4]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8}/;

  const validationSchema = yup.object({
    phone: yup
      .string()
      .typeError("شماره موبایل وارد نشده")
      .matches(phoneRegExp, "شماره موبایل صحیح نیست")
      .required("شماره موبایل وارد نشده"),
  });
  const handleNewsletterSubmit = (e) => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}SetKhabarNameh.aspx?phone=${e.phone}`
      )
      .then((res) => {
        if (res.data === "1") {
          alert("عضویت شما در خبرنامه با موفقیت انجام شد .");
        }
        if (res.data === "-1" || res.data === "0") {
          alert(
            "عضویت شما در خبرنامه با مشکل روبرو شد لطفا دوباره تلاش فرمایید ."
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [modalSuccess, setModalSuccess] = React.useState(false);

  const modalInitialValues = {
    title: "",
    phone: "",
  };

  const modalValidation = yup.object({
    title: yup
      .string()
      .typeError("موضوع همکاری وارد نشده")
      .required("موضوع همکاری وارد نشده"),
    phone: yup
      .string()
      .typeError("شماره موبایل وارد نشده")
      .matches(phoneRegExp, "شماره موبایل صحیح نیست")
      .required("شماره موبایل وارد نشده"),
  });

  const modalOnsubmit = (values) => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}ProviderRegister.aspx?phone=${values.phone}&title=${values.title}`
      )
      .then((res) => {
        if (res.data === "1") {
          setModalSuccess(true);
        } else {
          setModalSuccess(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {/* Add address modal  */}
      <div className="e-autho-model modal fade" id="seller">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-inner">
                <div
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    padding: "0 0 40px 0",
                  }}
                >
                  ثبت نام تامین کننده (فروشنده)
                </div>

                {modalSuccess ? (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <svg
                      style={{ width: "52px" }}
                      enableBackground="new 0 0 512 512"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#2BB673"
                        d="M489,255.9c0-0.2,0-0.5,0-0.7c0-1.6,0-3.2-0.1-4.7c0-0.9-0.1-1.8-0.1-2.8c0-0.9-0.1-1.8-0.1-2.7  c-0.1-1.1-0.1-2.2-0.2-3.3c0-0.7-0.1-1.4-0.1-2.1c-0.1-1.2-0.2-2.4-0.3-3.6c0-0.5-0.1-1.1-0.1-1.6c-0.1-1.3-0.3-2.6-0.4-4  c0-0.3-0.1-0.7-0.1-1C474.3,113.2,375.7,22.9,256,22.9S37.7,113.2,24.5,229.5c0,0.3-0.1,0.7-0.1,1c-0.1,1.3-0.3,2.6-0.4,4  c-0.1,0.5-0.1,1.1-0.1,1.6c-0.1,1.2-0.2,2.4-0.3,3.6c0,0.7-0.1,1.4-0.1,2.1c-0.1,1.1-0.1,2.2-0.2,3.3c0,0.9-0.1,1.8-0.1,2.7  c0,0.9-0.1,1.8-0.1,2.8c0,1.6-0.1,3.2-0.1,4.7c0,0.2,0,0.5,0,0.7c0,0,0,0,0,0.1s0,0,0,0.1c0,0.2,0,0.5,0,0.7c0,1.6,0,3.2,0.1,4.7  c0,0.9,0.1,1.8,0.1,2.8c0,0.9,0.1,1.8,0.1,2.7c0.1,1.1,0.1,2.2,0.2,3.3c0,0.7,0.1,1.4,0.1,2.1c0.1,1.2,0.2,2.4,0.3,3.6  c0,0.5,0.1,1.1,0.1,1.6c0.1,1.3,0.3,2.6,0.4,4c0,0.3,0.1,0.7,0.1,1C37.7,398.8,136.3,489.1,256,489.1s218.3-90.3,231.5-206.5  c0-0.3,0.1-0.7,0.1-1c0.1-1.3,0.3-2.6,0.4-4c0.1-0.5,0.1-1.1,0.1-1.6c0.1-1.2,0.2-2.4,0.3-3.6c0-0.7,0.1-1.4,0.1-2.1  c0.1-1.1,0.1-2.2,0.2-3.3c0-0.9,0.1-1.8,0.1-2.7c0-0.9,0.1-1.8,0.1-2.8c0-1.6,0.1-3.2,0.1-4.7c0-0.2,0-0.5,0-0.7  C489,256,489,256,489,255.9C489,256,489,256,489,255.9z"
                      />
                      <g>
                        <line
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={30}
                          strokeMiterlimit={10}
                          x1="213.6"
                          x2="369.7"
                          y1="344.2"
                          y2="188.2"
                        />
                        <line
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={30}
                          strokeMiterlimit={10}
                          x1="233.8"
                          x2="154.7"
                          y1="345.2"
                          y2="266.1"
                        />
                      </g>
                    </svg>
                    <div className="mt-3">ثبت نام با موفقیت انجام شد .</div>
                    <div style={{ marginTop: "40px" }}>
                      <div
                        role="button"
                        style={{ width: "100%" }}
                        data-dismiss={"modal"}
                        className="e-btn newsletter-btn"
                      >
                        بستن
                      </div>
                    </div>
                  </div>
                ) : (
                  <Formik
                    initialValues={modalInitialValues}
                    onSubmit={modalOnsubmit}
                    validationSchema={modalValidation}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      setFieldTouched,
                      submitForm,
                    }) => {
                      return (
                        <Form>
                          <div>شماره موبایل</div>
                          <div className="e-nl-box">
                            <input
                              className="input-font"
                              value={values.phone}
                              onBlur={() => setFieldTouched("phone")}
                              onChange={(e) =>
                                setFieldValue("phone", e.target.value)
                              }
                              style={{
                                border: "1px solid #ccc",
                                marginTop: "10px",
                              }}
                              type="number"
                              placeholder="شماره همراه خود را وارد کنید..."
                            />
                          </div>
                          {errors.phone && touched.phone && (
                            <div className="mt-2 text-danger">
                              {errors.phone}
                            </div>
                          )}
                          <div style={{ marginTop: "20px" }}>موضوع همکاری</div>
                          <div className="e-nl-box">
                            <input
                              className="input-font"
                              value={values.title}
                              onBlur={() => setFieldTouched("title")}
                              onChange={(e) =>
                                setFieldValue("title", e.target.value)
                              }
                              style={{
                                marginTop: "10px",
                                border: "1px solid #ccc",
                              }}
                              type="text"
                              placeholder="موضوع همکاری را وارد کنید..."
                            />
                          </div>
                          {errors.title && touched.title && (
                            <div className="mt-2 text-danger">
                              {errors.title}
                            </div>
                          )}
                          <div style={{ marginTop: "40px" }}>
                            <div
                              role="button"
                              style={{ width: "100%" }}
                              onClick={submitForm}
                              className="e-btn newsletter-btn"
                            >
                              ثبت
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                )}
              </div>
              <button
                type="button"
                className="autho-close"
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter start   */}
      <section className="e-newsletter-wrap e-newsletter-cloth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="e-nl-wrap text-center">
                <span className="e-nl-icon">
                  <svg width="50px" height="50px">
                    <path
                      fillRule="evenodd"
                      fill="rgb(96, 186, 190)"
                      d="M47.551,47.888 C47.538,47.901 47.527,47.915 47.514,47.928 C47.483,47.959 47.450,47.987 47.417,48.012 C46.042,49.247 44.225,50.000 42.236,50.000 L40.918,50.000 C40.379,50.000 39.941,49.562 39.941,49.023 C39.941,48.484 40.379,48.046 40.918,48.046 L42.236,48.046 C43.380,48.046 44.446,47.713 45.345,47.141 L29.913,31.708 C27.204,28.999 22.796,28.999 20.087,31.708 L8.438,43.357 L21.484,43.357 C22.023,43.357 22.461,43.794 22.461,44.333 C22.461,44.873 22.023,45.310 21.484,45.310 L6.485,45.310 L4.654,47.141 C5.554,47.713 6.620,48.046 7.764,48.046 L32.220,48.046 C32.759,48.046 33.196,48.484 33.196,49.023 C33.196,49.562 32.759,50.000 32.220,50.000 L7.764,50.000 C3.483,50.000 -0.000,46.517 -0.000,42.236 L-0.000,17.183 C-0.000,16.924 0.103,16.676 0.286,16.493 L7.227,9.552 L7.227,3.906 C7.227,1.752 8.979,-0.000 11.133,-0.000 L38.867,-0.000 C41.021,-0.000 42.773,1.752 42.773,3.906 L42.773,9.601 L49.711,16.490 C49.896,16.673 50.000,16.923 50.000,17.183 L50.000,42.236 C50.000,44.462 49.057,46.471 47.551,47.888 ZM7.227,12.314 L2.358,17.183 L7.227,22.052 L7.227,12.314 ZM1.953,19.541 L1.953,42.236 C1.953,43.592 2.421,44.840 3.203,45.830 L15.723,33.310 L1.953,19.541 ZM40.820,3.906 C40.820,2.829 39.944,1.953 38.867,1.953 L11.133,1.953 C10.056,1.953 9.180,2.829 9.180,3.906 L9.180,24.005 L17.104,31.929 L18.706,30.327 C22.177,26.856 27.823,26.856 31.294,30.327 L32.896,31.929 L40.820,24.005 L40.820,3.906 ZM42.773,12.353 L42.773,22.052 L47.640,17.185 L42.773,12.353 ZM48.047,19.541 L34.277,33.310 L46.797,45.830 C47.579,44.840 48.047,43.592 48.047,42.236 L48.047,19.541 ZM14.798,24.023 C14.798,23.484 15.235,23.046 15.774,23.046 L34.226,23.046 C34.765,23.046 35.202,23.484 35.202,24.023 C35.202,24.562 34.765,24.999 34.226,24.999 L15.774,24.999 C15.235,24.999 14.798,24.562 14.798,24.023 ZM34.226,17.968 L15.774,17.968 C15.235,17.968 14.798,17.531 14.798,16.992 C14.798,16.453 15.235,16.015 15.774,16.015 L34.226,16.015 C34.765,16.015 35.202,16.453 35.202,16.992 C35.202,17.531 34.765,17.968 34.226,17.968 ZM30.110,10.937 C29.853,10.937 29.602,10.833 29.420,10.651 C29.238,10.469 29.134,10.217 29.134,9.960 C29.134,9.704 29.238,9.452 29.420,9.270 C29.602,9.088 29.853,8.984 30.110,8.984 C30.367,8.984 30.619,9.088 30.802,9.270 C30.983,9.452 31.087,9.704 31.087,9.960 C31.087,10.217 30.983,10.469 30.802,10.651 C30.619,10.833 30.367,10.937 30.110,10.937 ZM25.586,10.937 L15.774,10.937 C15.235,10.937 14.798,10.500 14.798,9.960 C14.798,9.422 15.235,8.984 15.774,8.984 L25.586,8.984 C26.125,8.984 26.562,9.422 26.562,9.960 C26.562,10.500 26.125,10.937 25.586,10.937 ZM36.573,48.046 L36.586,48.046 C37.125,48.046 37.562,48.484 37.562,49.023 C37.562,49.562 37.125,50.000 36.586,50.000 L36.573,50.000 C36.034,50.000 35.597,49.562 35.597,49.023 C35.597,48.484 36.034,48.046 36.573,48.046 Z"
                    />
                  </svg>
                </span>
                <h2 className="e-nl-title">مشترک شدن در خبرنامه</h2>

                <Formik
                  initialValues={initialValues}
                  onSubmit={handleNewsletterSubmit}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                    submitForm,
                  }) => {
                    return (
                      <Form>
                        <div className="e-nl-box">
                          <input
                            className="input-font"
                            value={values.phone}
                            onBlur={() => setFieldTouched("phone")}
                            onChange={(e) =>
                              setFieldValue("phone", e.target.value)
                            }
                            type="number"
                            placeholder="شماره همراه خود را وارد کنید..."
                          />
                          <div
                            role="button"
                            onClick={() => {
                              if (errors.phone && touched.phone) {
                                alert(errors.phone);
                              } else {
                                setFieldValue("phone", "");
                                submitForm();
                              }
                            }}
                            className="e-btn newsletter-btn"
                          >
                            عضویت اکنون{" "}
                          </div>
                        </div>
                        {errors.phone && touched.phone && (
                          <div className="mb-5 text-danger">{errors.phone}</div>
                        )}
                      </Form>
                    );
                  }}
                </Formik>
                <ul className="c-social-list">
                  <li>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://wa.me/+989205206558"
                    >
                      <svg width="15px" height="16px">
                        <path
                          fillRule="evenodd"
                          fill="rgb(167, 171, 175)"
                          d="M12.814,2.324 C11.404,0.826 9.529,0.000 7.531,-0.001 C3.414,-0.001 0.064,3.556 0.062,7.927 C0.062,9.324 0.406,10.688 1.059,11.890 L-0.000,15.999 L3.959,14.897 C5.050,15.528 6.278,15.861 7.528,15.861 L7.531,15.861 C11.648,15.861 14.998,12.305 15.000,7.933 C15.001,5.815 14.224,3.822 12.814,2.324 L12.814,2.324 ZM7.531,14.523 L7.529,14.523 C6.415,14.522 5.322,14.204 4.369,13.604 L4.143,13.461 L1.793,14.115 L2.420,11.683 L2.272,11.434 C1.651,10.385 1.323,9.173 1.323,7.927 C1.325,4.294 4.110,1.337 7.534,1.337 C9.192,1.338 10.750,2.025 11.922,3.271 C13.094,4.517 13.739,6.172 13.739,7.933 C13.737,11.566 10.953,14.523 7.531,14.523 L7.531,14.523 ZM10.936,9.587 C10.750,9.488 9.832,9.008 9.661,8.943 C9.490,8.876 9.365,8.843 9.241,9.042 C9.117,9.240 8.759,9.686 8.650,9.818 C8.541,9.950 8.433,9.967 8.246,9.868 C8.059,9.769 7.458,9.559 6.745,8.885 C6.190,8.359 5.816,7.710 5.707,7.513 C5.598,7.314 5.706,7.217 5.789,7.108 C5.991,6.842 6.193,6.563 6.255,6.430 C6.318,6.298 6.287,6.183 6.240,6.084 C6.193,5.984 5.820,5.009 5.664,4.612 C5.513,4.226 5.359,4.278 5.245,4.272 C5.136,4.266 5.011,4.265 4.887,4.265 C4.763,4.265 4.560,4.315 4.389,4.513 C4.218,4.712 3.736,5.191 3.736,6.166 C3.736,7.141 4.405,8.083 4.498,8.216 C4.591,8.347 5.814,10.349 7.686,11.206 C8.131,11.411 8.479,11.532 8.750,11.624 C9.197,11.774 9.604,11.753 9.925,11.703 C10.284,11.646 11.029,11.223 11.185,10.760 C11.341,10.297 11.341,9.901 11.294,9.818 C11.247,9.736 11.123,9.686 10.936,9.587 L10.936,9.587 Z"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="newletter-moving-wrap">
          <ul className="newletter-moving-list">
            <li>
              <img
                src={require("../../assets/images/index1/news_move1.png")}
                alt="footer"
                className="img-fluid"
              />
            </li>
            <li>
              <img
                src={require("../../assets/images/index1/news_move2.png")}
                alt="footer"
                className="img-fluid"
              />
            </li>
            <li>
              <img
                src={require("../../assets/images/index1/news_move3.png")}
                alt="footer"
                className="img-fluid"
              />
            </li>
            <li>
              <img
                src={require("../../assets/images/index1/news_move4.png")}
                alt="footer"
                className="img-fluid"
              />
            </li>
          </ul>
        </div>
      </section>
      {/* Footer start  */}
      <footer className="e-footer-wrap e-footer-cloth">
        <div className="container">
          <div className="e-footer-box">
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="e-footer-inner">
                  <NavLink to="/">
                    <img
                      src={require("../../assets/images/index1/logo.png")}
                      alt="logo"
                      style={{ height: "70px" }}
                      className="img-fluid"
                    />
                  </NavLink>
                  <p className="efoot-about">
                    ما بازارکده هستیم: یک فروشگاه آنلاین کالا و اجناس عمومی و
                    خاص در سراسر کشور است که با هدف دسترسی آسوده مصرف کننده به
                    مناسب ترین کالا ها چه از نظر کیفیت و چه از نظر قیمت راه
                    اندازی شده است.
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="e-footer-inner">
                  <h2 className="efoot-heading">دسترسی سریع </h2>
                  <ul className="efoot-list">
                    <li>
                      <NavLink to="/">صفحه اصلی</NavLink>
                    </li>
                    <li>
                      <NavLink to="/">فروشگاه</NavLink>
                    </li>
                    <li>
                      <NavLink to="/blog_category/1">وبلاگ</NavLink>
                    </li>
                    <li>
                      <NavLink to="/about">درباره ما</NavLink>
                    </li>
                    <li>
                      <NavLink to="/contact">ارتباط با ما</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="e-footer-inner">
                  <h2 className="efoot-heading">بازارکده</h2>
                  <ul className="efoot-list">
                    <li>
                      <NavLink to="/terms">قوانین و مقررات</NavLink>
                    </li>
                    <li>
                      <NavLink to="/questions">سوالات متداول</NavLink>
                    </li>
                    <li>
                      <a style={{ color: "inherit", textDecoration: "none" }}>
                        <div
                          role="button"
                          data-toggle="modal"
                          data-target="#seller"
                        >
                          ثبت نام تامین کننده (فروشنده)
                        </div>
                      </a>
                    </li>
                    <li style={{ marginTop: "20px" }}>
                      <div>
                        <a
                          href={
                            "https://cafebazaar.ir/app/?id=com.tivasoft.bazarkadeh&ref=share"
                          }
                          aria-label="bazar"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ border: "none" }}
                        >
                          <img
                            src={require("../../assets/images/bazar.png")}
                            style={{ width: "150px" }}
                            className="img-fluid"
                          />
                        </a>
                      </div>
                    </li>
                    <li
                      style={{
                        marginTop: "10px",
                        transform: "translateX(2px)",
                      }}
                    >
                      <div>
                        <a
                          href={"https://sibirani.com/apps/Bazarkadeh/"}
                          aria-label="sibapp"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ border: "none", outline: "none" }}
                        >
                          <img
                            src={require("../../assets/images/sibapp.png")}
                            style={{
                              width: "175px",
                              transform: "translateX(10px)",
                            }}
                            className="img-fluid"
                          />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="e-footer-inner">
                  <a
                    referrerpolicy="origin"
                    target="_blank"
                    href="https://trustseal.enamad.ir/?id=276727&amp;Code=yDEf1ydKyS2NMTuYRaiP"
                  >
                    <img
                      referrerpolicy="origin"
                      src="https://Trustseal.eNamad.ir/logo.aspx?id=276727&amp;Code=yDEf1ydKyS2NMTuYRaiP"
                      alt="enamad"
                      style={{
                        cursor: "pointer",
                        width: "150px",
                        height: "150px",
                      }}
                      id="yDEf1ydKyS2NMTuYRaiP"
                    />
                  </a>

                  <img
                    referrerpolicy="origin"
                    id="rgvjjxlznbqejzpergvjoeuk"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open(
                        "https://logo.samandehi.ir/Verify.aspx?id=312738&p=xlaorfthuiwkjyoexlaomcsi",
                        "Popup",
                        "toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30"
                      )
                    }
                    alt="logo-samandehi"
                    src="https://logo.samandehi.ir/logo.aspx?id=312738&p=qftinbpdodrfyndtqftiaqgw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* GO To Top  */}
        <div
          className="scroll"
          role="button"
          onClick={() => window.scrollTo(0, 0)}
        >
          <svg width="15px" height="24px">
            <path
              fillRule="evenodd"
              fill="rgb(255, 255, 255)"
              d="M6.638,0.361 C6.638,0.361 6.637,0.361 6.637,0.362 L0.357,6.757 C-0.114,7.237 -0.112,8.012 0.361,8.489 C0.834,8.966 1.599,8.964 2.069,8.485 L6.285,4.191 L6.285,22.770 C6.285,23.446 6.826,23.994 7.493,23.994 C8.160,23.994 8.701,23.446 8.701,22.770 L8.701,4.191 L12.917,8.485 C13.387,8.964 14.152,8.966 14.625,8.489 C15.098,8.012 15.099,7.237 14.629,6.757 L8.349,0.362 C8.349,0.361 8.348,0.361 8.348,0.361 C7.876,-0.119 7.109,-0.117 6.638,0.361 L6.638,0.361 Z"
            />
          </svg>
        </div>
      </footer>

      {/* Bottom Footer start */}
      <div className="e-bfooter-wrap e-bfooter-cloth">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <p className="e-footer-text text-center text-lg-left">
                کپی رایت © {new Date().getFullYear()}
                <a
                  href={"https://bazarkade.com"}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    marginRight: "7px",
                  }}
                >
                  بازارکده
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;
