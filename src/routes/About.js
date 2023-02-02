import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import axios from "axios";
function About() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}AboutUs.aspx`)
      .then((res) => {
        setData(res.data[0]);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Layout loading={loading} title="درباره ما">
      {/* <!-- Breadcumbs start --> */}
      <div class="e-breadcumb-wrap text-center">
        <h2 class="e-breadcumb-title">درباره ما</h2>
        <ul class="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه </NavLink>
          </li>
          <li>
            <NavLink to="/about">درباره ما</NavLink>
          </li>
        </ul>
      </div>
      {/* <!-- شرایط و ضوابط start --> */}
      {data && (
        <div class="e-privacy-wrap">
          <div class="container">
            <div class="row">
              <div class="col-lg-12">
                <div class="e-privacy-sec">
                  <div class="e-privacy-box mb-30">
                    <h2 class="cmn-brdr-ttle big-ttl mb-10">
                      فروشگاه آنلاین بازارکده
                    </h2>
                    <p style={{ marginTop: "2em", lineHeight: "30px" }}>
                      {data.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default About;
