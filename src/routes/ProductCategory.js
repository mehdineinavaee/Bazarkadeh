import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import Slider from "../components/Slider/Slider";
import Pagination from "../components/Pagination";
const queryString = require("query-string");
const loadJs = require("loadjs");

function ProductCategory({ match, location, history }) {
  const [listView, setListView] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isSort, setIsSort] = React.useState(false);
  const [totalLength, setTotalLength] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedSort, setSelectedSort] = React.useState("جدیدترین");
  const [sort, setSort] = React.useState(false);
  const [brands, setBrands] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState({
    adminTitle: "برند",
    adminID: "",
  });
  const [brand, setBrand] = React.useState(false);
  const parsed = queryString.parse(location.search);
  const [subcategories, setSubcategories] = React.useState([]);
  const [selectedSub, setSelectedSub] = React.useState({
    value: "",
    subCategoryTitle: "دسته بندی",
  });
  const [sub, setSub] = React.useState(false);
  const getBrands = () => {
    if (parsed.category) {
      const ccc = parsed.category;
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}AdminTitleDetail.aspx?CategoryID=${ccc}`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setBrands(res.data);
          } else {
            setBrands([]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (parsed.subcategory) {
      const aaa = parsed.subcategory;
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}AdminTitleDetail.aspx?SubCategoryID=${aaa}`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setBrands(res.data);
          } else {
            setBrands([]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const getSubcategories = () => {
    if (parsed.category) {
      const parsedCategoryId = JSON.parse(parsed.category);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}SubCategory.aspx?categoryID=${parsedCategoryId}`
        )
        .then((res) => {
          setSubcategories(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  React.useEffect(() => {
    getBrands();
    getSubcategories();
    setLoading(true);
    if (!parsed.category && !parsed.subcategory && !parsed.search) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}productpagecount.aspx`)
        .then((res) => {
          setTotalLength(JSON.parse(res.data));
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}Product.aspx?page=${parsed.page}`
            )
            .then((res) => {
              setData(res.data);
              setFilteredData(res.data);
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else if (!parsed.category && parsed.subcategory && !parsed.search) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}productpagecount.aspx?subcategoryid=${parsed.subcategory}`
        )
        .then((res) => {
          setTotalLength(JSON.parse(res.data));
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}Product.aspx?subcategoryID=${parsed.subcategory}&page=${parsed.page}`
            )
            .then((res) => {
              setData(res.data);
              setFilteredData(res.data);
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (parsed.category && !parsed.subcategory && !parsed.search) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}productpagecount.aspx?categoryid=${parsed.subcategory}`
        )
        .then((res) => {
          setTotalLength(JSON.parse(res.data));
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}Product.aspx?CategoryID=${parsed.category}&page=${parsed.page}`
            )
            .then((res) => {
              setData(res.data);
              setFilteredData(res.data);
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else if (parsed.search) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}productpagecount.aspx?search=${parsed.search}`
        )
        .then((res) => {
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}Product.aspx?search=${parsed.search}&page=1`
            )
            .then((res) => {
              setData(res.data);
              setFilteredData(res.data);
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        });
    } else if (parsed.brand) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}productpagecount.aspx?adminid=${parsed.brand}`
        )
        .then((res) => {
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}Product.aspx?search=${parsed.brand}&page=1`
            )
            .then((res) => {
              setData(res.data);
              setFilteredData(res.data);
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        });
    }
  }, [location]);

  const [values, setValues] = React.useState([0, 1000000]);
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(1000000);

  React.useEffect(() => {
    if (isSort) {
      const searchWord = setTimeout(() => {
        const prevData = [...data];
        const newData = prevData.filter((e) => {
          const parsedPrice = JSON.parse(e.priceTakhfif);
          if (parsedPrice >= values[0] && parsedPrice <= values[1]) {
            return 1;
          } else {
            return 0;
          }
        });
        setFilteredData(newData);
        setIsSort(false);
      }, 500);
      return () => clearTimeout(searchWord);
    }
  }, [values]);

  const [paginationPage, setPaginationPage] = useState(JSON.parse(parsed.page));
  const onChange = (componentPage) => {
    if (parsed.page !== JSON.stringify(componentPage)) {
      setLoading(true);
      if (parsed.subcategory) {
        history.push(
          `/product_category?subcategory=${parsed.subcategory}&page=${componentPage}`
        );
      }
      if (parsed.category) {
        history.push(
          `/product_category?category=${parsed.category}&page=${componentPage}`
        );
      }
      if (parsed.search) {
        history.push(
          `/product_category?search=${parsed.search}&page=${componentPage}`
        );
      }
      if (!parsed.search && !parsed.subcategory && !parsed.category) {
        history.push(`/product_category?page=${componentPage}`);
      }
      setPaginationPage(componentPage);
    }
  };

  return (
    <Layout
      loading={loading}
      title={!match.params.category && !match.params.category ? "فروشگاه" : ""}
    >
      {/* <!-- Breadcumbs start --> */}
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">دسته محصولات </h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/product_category?page=1">فروشگاه</NavLink>
          </li>
        </ul>
      </div>

      {/* <!-- Product Category start --> */}
      <section className="e-procategory-wrap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* FilterBar */}
              <div className="e-filter-bar">
                <div className="e-filter-rightbar">
                  <ul className="e-filter-list">
                    <li>
                      {" "}
                      فیلتر
                      <span className="e-filter-icon">
                        <svg width="14px" height="18px">
                          <path
                            fillRule="evenodd"
                            fill="rgb(96, 186, 190)"
                            d="M13.118,3.502 C12.891,3.512 12.659,3.512 12.432,3.510 C12.160,3.509 11.888,3.507 11.617,3.525 C11.553,3.529 11.438,3.603 11.416,3.645 C10.915,4.705 10.127,5.246 9.075,5.252 C9.069,5.252 9.064,5.252 9.058,5.252 C7.987,5.252 7.180,4.702 6.726,3.658 C6.663,3.516 6.663,3.510 6.455,3.507 C5.042,3.512 3.631,3.512 2.218,3.512 L1.273,3.513 C1.141,3.514 1.008,3.516 0.876,3.503 C0.348,3.455 0.014,3.105 0.027,2.613 C0.040,2.102 0.384,1.782 0.926,1.776 C1.587,1.769 2.249,1.770 2.911,1.772 L3.522,1.773 L4.478,1.770 C5.149,1.769 5.817,1.767 6.487,1.776 C6.640,1.775 6.648,1.765 6.712,1.619 C7.168,0.568 7.972,0.014 9.037,0.014 C9.044,0.014 9.051,0.014 9.059,0.014 C10.154,0.021 10.960,0.583 11.392,1.639 C11.442,1.764 11.465,1.781 11.619,1.775 C12.108,1.762 12.601,1.765 13.094,1.775 C13.627,1.788 13.976,2.121 13.986,2.621 C13.995,3.125 13.646,3.479 13.118,3.502 ZM9.051,1.741 C9.050,1.741 9.050,1.741 9.050,1.741 C8.578,1.742 8.195,2.139 8.195,2.626 C8.195,2.881 8.285,3.111 8.448,3.274 C8.609,3.434 8.831,3.519 9.078,3.517 C9.302,3.514 9.515,3.419 9.677,3.250 C9.842,3.078 9.929,2.856 9.925,2.624 C9.914,2.145 9.515,1.741 9.051,1.741 ZM1.976,6.442 C3.283,6.147 4.298,6.720 4.975,8.139 L12.947,8.139 C13.314,8.139 13.591,8.233 13.772,8.421 C13.921,8.574 13.995,8.785 13.988,9.030 C13.973,9.559 13.586,9.874 12.953,9.874 L4.978,9.875 C4.304,11.260 3.395,11.641 2.602,11.641 C2.383,11.641 2.174,11.613 1.980,11.568 C0.833,11.304 -0.000,10.228 -0.002,9.007 C-0.003,7.779 0.829,6.700 1.976,6.442 ZM2.565,9.908 C3.031,9.908 3.411,9.507 3.414,9.015 C3.417,8.509 3.058,8.119 2.578,8.107 C2.572,8.107 2.564,8.107 2.558,8.107 C2.341,8.107 2.136,8.193 1.977,8.349 C1.802,8.524 1.707,8.760 1.709,9.017 C1.714,9.508 2.097,9.908 2.565,9.908 ZM0.859,14.506 C0.953,14.497 1.046,14.499 1.140,14.499 L1.229,14.500 L2.103,14.498 C2.846,14.495 3.589,14.495 4.334,14.506 C4.550,14.502 4.619,14.488 4.718,14.264 C5.151,13.277 5.946,12.756 7.018,12.756 C7.023,12.756 7.026,12.756 7.031,12.756 C8.068,12.759 8.851,13.280 9.297,14.262 C9.395,14.479 9.439,14.504 9.647,14.506 C10.412,14.492 11.178,14.492 11.945,14.496 L12.709,14.497 L12.814,14.496 C12.932,14.492 13.053,14.494 13.171,14.509 C13.687,14.578 13.976,14.883 13.984,15.369 C13.993,15.884 13.648,16.224 13.107,16.233 C12.678,16.241 12.248,16.239 11.817,16.239 L11.472,16.238 L10.809,16.240 C10.396,16.243 9.979,16.244 9.564,16.234 C9.444,16.237 9.399,16.243 9.341,16.383 C8.905,17.439 8.100,17.997 7.010,17.997 C7.007,17.997 7.004,17.997 7.000,17.997 C5.909,17.994 5.102,17.432 4.665,16.372 C4.615,16.247 4.584,16.238 4.434,16.236 C3.255,16.240 2.077,16.240 0.899,16.236 C0.395,16.233 0.071,15.930 0.031,15.425 C-0.008,14.931 0.325,14.562 0.859,14.506 ZM6.989,16.271 C7.211,16.271 7.426,16.181 7.595,16.013 C7.772,15.837 7.872,15.598 7.870,15.359 C7.866,14.871 7.479,14.475 7.007,14.475 L7.006,14.475 C6.530,14.475 6.151,14.865 6.143,15.363 C6.135,15.831 6.538,16.264 6.989,16.271 Z"
                          />
                        </svg>
                      </span>
                    </li>
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

                    <li>
                      <div
                        onClick={() => setSort((prev) => !prev)}
                        className={`nice-select ${sort && "open"}`}
                        tabIndex="0"
                      >
                        <span className="current">{selectedSort}</span>
                        <ul className="list">
                          <li
                            onClick={() => {
                              setFilteredData(data);
                              setSelectedSort("جدیدترین");
                            }}
                            data-value="0"
                            className={
                              selectedSort === "جدیدترین"
                                ? "option selected focus"
                                : "option"
                            }
                          >
                            جدیدترین
                          </li>
                          <li
                            data-value="0"
                            onClick={() => {
                              const sortedData = [...data];
                              sortedData.sort((a, b) => {
                                const aparsedPrice = JSON.parse(a.priceTakhfif);
                                const bparsedPrice = JSON.parse(b.priceTakhfif);
                                return aparsedPrice - bparsedPrice;
                              });
                              setFilteredData(sortedData);
                              setSelectedSort("ارزان ترین");
                            }}
                            className={
                              selectedSort === "ارزان ترین"
                                ? "option selected focus"
                                : "option"
                            }
                          >
                            ارزان ترین
                          </li>
                          <li
                            data-value="1"
                            onClick={() => {
                              const sortedData = [...data];
                              sortedData.sort((a, b) => {
                                const aparsedPrice = JSON.parse(a.priceTakhfif);
                                const bparsedPrice = JSON.parse(b.priceTakhfif);
                                return bparsedPrice - aparsedPrice;
                              });
                              setFilteredData(sortedData);
                              setSelectedSort("گران ترین");
                            }}
                            className={
                              selectedSort === "گران ترین"
                                ? "option selected focus"
                                : "option"
                            }
                          >
                            گران ترین
                          </li>
                          <li
                            style={{ color: "#ccc" }}
                            data-value="1"
                            className="option"
                          >
                            محبوبت ترین
                          </li>
                          <li
                            style={{ color: "#ccc" }}
                            data-value="1"
                            className="option"
                          >
                            پرفروش ترین
                          </li>
                        </ul>
                      </div>
                    </li>
                    {subcategories.length > 0 && (
                      <li>
                        <div
                          onClick={() => setSub((prev) => !prev)}
                          className={`nice-select ${sub && "open"}`}
                          tabIndex="0"
                        >
                          <span className="current">
                            {selectedSub.subCategoryTitle}
                          </span>
                          <ul className="list">
                            <li
                              data-value="0"
                              className="option selected focus"
                            >
                              دسته بندی
                            </li>
                            {subcategories.map((e) => {
                              return (
                                <li
                                  data-value={e.id}
                                  onClick={() => {
                                    setLoading(true);
                                    history.push(
                                      `/product_category?subcategory=${e.id}&page=1`
                                    );
                                    setSelectedSub(e);
                                  }}
                                  className="option"
                                >
                                  {e.subCategoryTitle}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    )}
                    {/* Brands */}
                    {brands.length > 0 && (
                      <li>
                        <div
                          onClick={() => setBrand((prev) => !prev)}
                          className={`nice-select ${brand && "open"}`}
                          tabIndex="0"
                        >
                          <span className="current">
                            {selectedBrand.adminTitle}
                          </span>
                          <ul className="list">
                            <li
                              data-value="0"
                              className="option selected focus"
                            >
                              برند
                            </li>
                            {brands.map((e) => {
                              return (
                                <li
                                  data-value={e.adminID}
                                  onClick={() => {
                                    setLoading(true);
                                    history.push(
                                      `/product_category?brand=${e.adminID}&page=1`
                                    );
                                    setSelectedBrand(e);
                                  }}
                                  className="option"
                                >
                                  {e.adminTitle}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    )}
                    <div
                      style={{
                        direction: "ltr",
                        width: "280px",
                        display: "flex",
                        alignItems: "center",
                        margin: "0 20px",
                        position: "relative",
                        height: "40px",
                      }}
                    >
                      <Slider
                        min={min}
                        max={max}
                        handlePrice={(values) => {
                          setIsSort(true);
                          setValues([values[0], values[1]]);
                        }}
                      />
                    </div>
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: "80px" }} className="e-filter-leftbar">
                <p className="e-filter-items">
                  نمایش محصولات در {filteredData.length.toLocaleString("fa-IR")}{" "}
                  نتیجه
                </p>
              </div>

              <div
                style={{ marginTop: "20px" }}
                className={`e-procategory-inner ${listView && "list-view"}`}
              >
                {/* Products */}
                <ul>
                  {filteredData.length > 0 ? (
                    filteredData.map((each, index) => {
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
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default withRouter(ProductCategory);
