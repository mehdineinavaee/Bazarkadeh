import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { NavLink } from "react-router-dom";
import moment from "moment-jalaali";
moment.loadPersian([{ usePersianDigits: true }]);
function Blog({ match }) {
  const { id } = match.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const link = window.location.href;
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}Blog.aspx?BlogID=${id}`)
      .then((res) => {
        setData(res.data[0]);
        console.log(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [id]);
  return (
    <Layout loading={loading} title={(data && data.title) || ""}>
      {/* <!-- Breadcumbs start --> */}
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">تک نوشته</h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/blog_category/1">دسته بندی وبلاگ</NavLink>
          </li>
          <li>
            <NavLink to="/blog/1">تک نوشته </NavLink>
          </li>
        </ul>
      </div>
      {/* <!-- Product Category start --> */}
      {!loading && data && (
        <section className="e-blog-wrap e-blog-single-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="e-blog-sec">
                  <div className="row">
                    <div className="col-xl-12 col-12">
                      <div className="cmn-blog-box">
                        <div className="cmn-blog-imgwrap">
                          <img src={data.img} alt="pic" className="img-fluid" />
                        </div>
                        <ul className="cmn-blog-infolist">
                          {/* <li>
                            <div>
                              <span className="blog-il-icon">
                                <img
                                  src={require("../assets/images/index1/svg/profile.svg")}
                                  alt="icon"
                                />
                              </span>
                              توسط -{" "}
                              <span className="cmn-blog-auther">
                                جعفر عباسی{" "}
                              </span>
                            </div>
                          </li> */}
                          <li>
                            <div>
                              <span className="blog-il-icon">
                                <img
                                  src={require("../assets/images/index1/svg/calender_c.svg")}
                                  alt="icon"
                                />
                              </span>
                              {moment(data.date).format("jMMMM")}{" "}
                              {convert(moment(data.date).format("jYYYY"))}
                            </div>
                          </li>
                        </ul>
                        <h2 className="cmn-blog-title">{data.title}</h2>
                        <p
                          style={{ marginTop: "1em" }}
                          className="cmn-blog-des mb-30"
                        >
                          {data.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export default Blog;
