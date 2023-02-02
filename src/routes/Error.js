import React from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout/Layout";
export default function Error() {
  return (
    <Layout title="یافت نشد">
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">404 یافت نشد</h2>
        <ul className="e-breadcumb-kist">
          <li>404 یافت نشد</li>
        </ul>
      </div>
      <section className="e-error-wrap e-error-cloth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="e-error-info text-center">
                <div className="e-error-img">
                  <img
                    className="parallax"
                    src={require("../assets/images/404.png")}
                    alt="error 404"
                    title="404"
                  />
                </div>
                <h4>به نظر می رسد در این مکان چیزی پیدا نشده است.</h4>
                <div className="e-error-btn">
                  <NavLink to="/" className="e-btn">
                    برگرد به خانه اصلی
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
