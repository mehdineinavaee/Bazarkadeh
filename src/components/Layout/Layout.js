import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

// Components
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Layout({ title, children, loading = false, desc }) {
  const canonical = window.location.href;
  return (
    <Fragment>
      <Helmet>
        <link rel={"canonical"} href={canonical} />
        <title>
          {process.env.REACT_APP_SITENAME} | {title}
        </title>
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      <Header />
      <div
        className={`preloader-wrapper ${
          loading ? "preloader-active" : "loaded"
        } preloader-open`}
      >
        <div className="preloader-holder">
          <div className="preloader d-flex justify-content-center align-items-center h-100">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div
        style={{ position: "fixed", zIndex: 9999999, bottom: 20, right: 20 }}
      >
        <ul className="c-social-list">
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://wa.me/+989205206558"
              style={{ border: "1px solid #eaeaea" }}
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
      {children}
      <Footer />
    </Fragment>
  );
}

export default Layout;
