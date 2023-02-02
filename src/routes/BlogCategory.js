import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Pagination from "../components/Pagination";
import moment from "moment-jalaali";
moment.loadPersian([{ usePersianDigits: true }]);
function BlogCategory({ match, history }) {
  const { page } = match.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
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
      .get(`${process.env.REACT_APP_BASE_URL}Blog.aspx`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [page]);
  const [paginationPage, setPaginationPage] = useState(JSON.parse(page));
  const onChange = (componentPage) => {
    if (page !== JSON.stringify(componentPage)) {
      setLoading(true);
      history.push(`/blog_category/${componentPage}`);
      setPaginationPage(componentPage);
    }
  };

  return (
    <Layout loading={loading} title="وبلاگ">
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">دسته بندی وبلاگ</h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/blog_category/1">دسته بندی وبلاگ</NavLink>
          </li>
        </ul>
      </div>
      {!loading && (
        <section className="e-blog-wrap e-blog-category-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="e-blog-sec">
                  <div className="row">
                    {data.map((each) => {
                      return (
                        <div key={each.id} className="col-sm-6">
                          <NavLink to="/blog/1">
                            <div className="cmn-blog-box">
                              <div className="cmn-blog-imgwrap">
                                <img
                                  src={each.img}
                                  alt="pic"
                                  className="img-fluid"
                                />
                              </div>
                              <ul className="cmn-blog-infolist">
                                <li>{each.title}</li>
                                {/* <li>
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
                                </li> */}
                                <li>
                                  <span className="blog-il-icon">
                                    <img
                                      src={require("../assets/images/index1/svg/calender_c.svg")}
                                      alt="icon"
                                    />
                                  </span>
                                  {moment(each.date).format("jMMMM")}{" "}
                                  {convert(moment(each.date).format("jYYYY"))}
                                </li>
                              </ul>
                              <div className="cmn-blog-title">{each.title}</div>
                            </div>
                          </NavLink>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Pagination */}
            {data && data.length && !loading && (
              <div className="row">
                <div className="col-12">
                  <Pagination
                    lang="english"
                    onChange={onChange}
                    currentPage={paginationPage}
                    totalItemsLength={data.length}
                    itemsPerPage={10}
                    showLessPages={true}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}

export default withRouter(BlogCategory);
