import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import LazyLoad from "react-lazyload";
import moment from "moment-jalaali";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { connect } from "react-redux";
import { add } from "../redux/action";

const loadJs = require("loadjs");
moment.loadPersian([{ usePersianDigits: true }]);
function ProductDetails({ match, history, add, totalPrice, cartItems }) {
  const { id } = match.params;
  const [addSuccess, setAddSuccess] = React.useState(false);
  const [nextBuy, setNextBuy] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [newItems, setNewItems] = React.useState([]);
  const [count, setCount] = React.useState(1);
  // Por.
  const [product, setProduct] = useState(null);

  // Images
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState([
    {
      id: 1,
      img: "",
    },
    {
      id: 2,
      img: "",
    },
    {
      id: 3,
      img: "",
    },
  ]);

  // Colors
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  // Sizes
  const [sizes, setSizes] = React.useState([]);
  const [selectedSize, setSelectedSize] = React.useState(null);

  // Favourite
  const [isFav, setIsFav] = React.useState(false);

  // Comments
  const [comments, setComments] = React.useState([]);

  // Desc
  const [desc, setDesc] = React.useState(null);

  const [seller, setSeller] = React.useState("");

  const handleAuth = async () => {
    const isAuth = await localStorage.getItem("auth");
    if (isAuth && isAuth === "true") {
      const localPhone = await localStorage.getItem("phone");
      const phone = JSON.parse(localPhone);
      setIsSignedIn(true);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}UserFavorite.aspx?phone=${phone}`
        )
        .then((res) => {
          let isfavourite = false;
          res.data.forEach((e) => {
            if (e.productID === id) {
              isfavourite = true;
            }
          });
          setIsFav(isfavourite);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setIsSignedIn(false);
    }
  };

  const addToFav = async () => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}SetFavorite.aspx?phone=${phone}&productid=${id}`
      )
      .then((res) => {
        handleAuth();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const removeFromFav = async () => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);
    const parsedId = JSON.parse(id);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}DeleteFavorite.aspx?phone=${phone}&id=${parsedId}`
      )
      .then((res) => {
        handleAuth();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handleAuth();
    setLoading(true);
    axios
      .all([
        axios.get(
          `${process.env.REACT_APP_BASE_URL}Product.aspx?productID=${id}`
        ),
        axios.get(
          `${process.env.REACT_APP_BASE_URL}ProductImage.aspx?productID=${id}`
        ),
        axios.get(
          `${process.env.REACT_APP_BASE_URL}ProductColor.aspx?productID=${id}`
        ),
        axios.get(
          `${process.env.REACT_APP_BASE_URL}ProductSize.aspx?productID=${id}`
        ),
        axios.get(
          `${process.env.REACT_APP_BASE_URL}ProductComment.aspx?productID=${id}`
        ),
        axios.get(
          `${process.env.REACT_APP_BASE_URL}ProductProperty.aspx?productID=${id}`
        ),
        axios.get(`${process.env.REACT_APP_BASE_URL}SpecialProduct.aspx`),
      ])
      .then(
        axios.spread(
          (
            firstResponse,
            secondResponse,
            thirdResponse,
            fourResponse,
            fiveResponse,
            sixResponse,
            vizheResponse
          ) => {
            setProduct(firstResponse.data[0]);
            setSelectedImage(firstResponse.data[0].img);
            setImages([
              { img: firstResponse.data[0].img },
              ...secondResponse.data,
            ]);
            const colors = [];
            thirdResponse.data.forEach((color) => {
              colors.push(color);
            });
            setColors(colors);
            setSelectedColor(colors[0]);
            setSizes(fourResponse.data);
            setSelectedSize(fourResponse.data[0]);
            setComments(fiveResponse.data);
            setDesc(sixResponse.data);
            const sliced = vizheResponse.data.slice(0, 4);
            setNewItems(sliced);
            axios
              .get(
                `${process.env.REACT_APP_BASE_URL}AdminDetail.aspx?adminID=${firstResponse.data[0].adminID}`
              )
              .then((res) => {
                setSeller(res.data[0]);
              })
              .catch((e) => {
                console.log(e);
              });
            loadJs("js/custom.js");
            setLoading(false);
          }
        )
      )
      .catch((error) => {
        setLoading(false);
      });
  }, [id]);

  const addToNextBuy = async () => {
    const phone = await localStorage.getItem("phone");
    if (phone) {
      const parsedPhone = JSON.parse(phone);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}SetNextBuy.aspx?phone=${parsedPhone}&productid=${id}`
        )
        .then((res) => {
          setNextBuy(true);
          setTimeout(() => {
            setNextBuy(false);
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const initialValues = {
    name: "",
    family: "",
    score: 0,
    desc: "",
    phone: "",
  };
  const phoneRegExp =
    /(0|\+98)?([ ]|,|-|[()]){0,2}9[1|2|3|4]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8}/;

  const validationSchema = yup.object({
    name: yup.string().typeError("نام وارد نشده .").required("نام وارد نشده ."),
    family: yup
      .string()
      .typeError("نام فامیلی وارد نشده .")
      .required("نام فامیلی وارد نشده ."),
    score: yup
      .string()
      .typeError("امتیاز وارد نشده .")
      .required("امتیاز وارد نشده ."),
    desc: yup.string().typeError("نظر وارد نشده .").required("نظر وارد نشده ."),
    phone: yup
      .string()
      .typeError("شماره همراه وارد نشده .")
      .matches(phoneRegExp, "شماره موبایل صحیح نیست")
      .required("شماره همراه وارد نشده ."),
  });

  const onSubmit = (e) => {
    console.log(e);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}SetComment.aspx?phone=${e.phone}&productid=${id}&description=${e.desc}&score=${e.score}&username=${e.name}&userfamily=${e.family}`
      )
      .then((res) => {
        if (res.data === "1") {
          alert("نظر شما با موفقیت ثبت شد و در انتظار تایید میباشد .");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addToCart = () => {
    let c;
    if (typeof count === "string") {
      c = JSON.parse(count);
    } else {
      c = count;
    }
    if (c <= product.inventory) {
      const newProduct = { ...product };
      newProduct.quantity = c;
      newProduct.size = selectedSize;
      newProduct.color = selectedColor;
      add(newProduct);
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);
    } else {
      alert("تعداد وارد شده بیش از حد موجودی محصول میباشد ،");
    }
  };

  return (
    <Layout
      loading={loading}
      title={(product && product.title) || ""}
      desc={(product && product.description) || ""}
    >
      <div className={`e-toster-wrap ${addSuccess && "open"}`}>
        <div className="e-toster-msg">
          <span>عملیات موفق</span>
          <p style={{ marginTop: "5px" }}>محصول به سبد خرید شما اضافه شد</p>
        </div>
      </div>
      <div className={`e-toster-wrap ${nextBuy && "open"}`}>
        <div className="e-toster-msg">
          <span>عملیات موفق</span>
          <p style={{ marginTop: "5px" }}>
            محصول به لیست خرید بعدی شما اضافه شد
          </p>
        </div>
      </div>
      {/* <!-- Breadcumbs start --> */}
      {product && (
        <div className="e-breadcumb-wrap text-center">
          <h2 className="e-breadcumb-title">{product.title}</h2>
          <ul className="e-breadcumb-kist">
            <li>
              <NavLink to="/">صفحه اصلی</NavLink>
            </li>
            <li>
              <NavLink
                to={`/product_category?category=${product.categoryID}&page=1`}
              >
                {product.categoryTitle}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/product_category?subcategory=${product.subCategoryID}&page=1`}
              >
                {product.subCategoryTitle}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/product/${product.id}`}>{product.title}</NavLink>
            </li>
          </ul>
        </div>
      )}

      {product && (
        <>
          <section className="e-prodetails-wrap">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-12">
                  <div className="pd-gallery-wrap">
                    <div className="pd-thumb-box">
                      <ul className="pd-thumb-list">
                        {images.length > 0 &&
                          images.map((e) => {
                            return (
                              <li
                                key={e.id}
                                className={
                                  selectedImage === e.img ? "active" : "p-0"
                                }
                                onClick={() => setSelectedImage(e.img)}
                              >
                                <img
                                  src={e.img}
                                  alt="product-img"
                                  className="pro_thumb"
                                />
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div className="pd-img-wrap">
                      <div className="pd-img text-center">
                        <img
                          alt="selected"
                          className="p-0"
                          src={selectedImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="prodetails-info">
                    <div className="pd-infotop">
                      <div className="d-flex justify-content-between">
                        <h2 className="pd-title">{product.title}</h2>
                        <div>
                          {moment(product.date).format("jMMMM")}{" "}
                          {convert(moment(product.date).format("jYYYY"))}
                        </div>
                      </div>
                      <ul className="pd-price-wrap">
                        <li>
                          <span className="pd-price-ttile">
                            {parseInt(product.priceTakhfif).toLocaleString(
                              "fa-IR"
                            )}{" "}
                            تومان{" "}
                            <span style={{ textDecoration: "line-through" }}>
                              {parseInt(product.price).toLocaleString("fa-IR")}{" "}
                              تومان
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="pd-info-bottom">
                      <ul className="info-bottom-list">
                        <div>
                          فروشنده :{"  "}
                          <NavLink
                            style={{ color: "#60babe", fontWeight: "bold" }}
                            to={`/seller/${seller.id}?page=1`}
                          >
                            {seller ? seller.title : ""}
                          </NavLink>
                        </div>
                        <div
                          style={{ marginTop: "15px" }}
                          className="ib-list-left"
                        >
                          <span>
                            موجودی :{" "}
                            {product.inventory.toLocaleString("fa-IR", {
                              useGrouping: false,
                            })}{" "}
                            عدد
                          </span>
                        </div>
                        <li className="mt-4">
                          <div className="ib-list-left">
                            <span>رنگ های موجود</span>
                          </div>
                          <div className="ib-list-right">
                            <ul
                              style={{ display: "flex", flexWrap: "wrap" }}
                              className="na-color-skin"
                            >
                              {colors.map((color) => {
                                return (
                                  <div
                                    role="button"
                                    key={color.id}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                      backgroundColor: `#${color?.colorCode}`,
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      marginRight: "15px",
                                      opacity:
                                        selectedColor &&
                                        selectedColor.colorCode !==
                                          color.colorCode
                                          ? "0.5 "
                                          : "1",
                                      marginTop: "10px",
                                      border:
                                        selectedColor &&
                                        selectedColor.colorCode ===
                                          color.colorCode
                                          ? "2px solid #09acb5"
                                          : "1px solid #999",
                                      transition: "all .3s",
                                    }}
                                  />
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="ib-list-left">
                            <span>سایز های موجود</span>
                          </div>
                          <div className="ib-list-right">
                            <ul className="d-flex">
                              {sizes.map((size) => {
                                return (
                                  <li
                                    key={size.id}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                      backgroundColor:
                                        selectedSize &&
                                        selectedSize.id === size.id
                                          ? "#60babe"
                                          : "white",
                                      color:
                                        selectedSize &&
                                        selectedSize.id === size.id
                                          ? "white"
                                          : "black",
                                      padding: "7px 10px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {size.sizeTitle}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="ib-list-left">
                            <span>تعداد </span>
                          </div>
                          <div className="ib-list-right">
                            <ul className="pd-qua-wrap">
                              <li>
                                <div className="quantity-box">
                                  <input
                                    type="text"
                                    className="quantity"
                                    value={count}
                                    onChange={(e) => {
                                      if (
                                        !isNaN(e.target.value) &&
                                        e.target.value !== 0 &&
                                        e.target.value !== "0"
                                      ) {
                                        setCount(e.target.value);
                                      } else {
                                        alert("لطفا مقدار عددی وارد نمایید .");
                                      }
                                    }}
                                    style={{
                                      backgroundColor: "white",
                                      width: "80px",
                                      overflow: "hidden",
                                      paddingLeft: "20px",
                                    }}
                                  />
                                  <span
                                    onClick={() => {
                                      if (count !== 1) {
                                        setCount(
                                          (prev) => JSON.parse(prev) - 1
                                        );
                                      }
                                    }}
                                    className="quantity-minus"
                                    style={{
                                      transform: "translateY(20px)",
                                    }}
                                  >
                                    -
                                  </span>
                                  <span
                                    onClick={() => {
                                      if (count < product.inventory) {
                                        setCount(
                                          (prev) => JSON.parse(prev) + 1
                                        );
                                      }
                                    }}
                                    style={{ top: "0" }}
                                    className="quantity-plus"
                                  >
                                    +
                                  </span>
                                </div>
                              </li>
                              <li>
                                <div
                                  role="button"
                                  onClick={addToCart}
                                  className="e-btn pd-addcart"
                                >
                                  افزودن به سبد{" "}
                                </div>
                              </li>
                              <li>
                                {isSignedIn ? (
                                  <div
                                    onClick={() => {
                                      if (isFav) {
                                        removeFromFav();
                                      } else {
                                        addToFav();
                                      }
                                    }}
                                    role="button"
                                    className="e-btn light pd-heart"
                                    style={{
                                      backgroundColor: isFav
                                        ? "#60babe"
                                        : "white",
                                    }}
                                  >
                                    <svg
                                      fill={isFav ? "white" : "none"}
                                      width="17px"
                                      height="16px"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        fill={
                                          isFav ? "white" : "rgb(90, 106, 137)"
                                        }
                                        d="M15.616,1.939 C14.768,0.972 13.603,0.440 12.337,0.440 C11.387,0.440 10.516,0.755 9.751,1.377 C9.456,1.616 9.182,1.898 8.933,2.217 C8.683,1.898 8.409,1.616 8.115,1.377 C7.350,0.755 6.480,0.440 5.529,0.440 C4.262,0.440 3.098,0.972 2.249,1.939 C1.419,2.886 0.962,4.175 0.962,5.570 C0.962,7.002 1.465,8.308 2.547,9.681 C3.494,10.880 4.842,12.088 6.411,13.493 C6.940,13.967 7.540,14.504 8.163,15.077 C8.375,15.272 8.649,15.380 8.933,15.380 C9.218,15.380 9.491,15.272 9.703,15.077 C10.269,14.555 10.818,14.063 11.311,13.622 L11.458,13.490 C13.019,12.092 14.367,10.886 15.318,9.681 C16.400,8.309 16.904,7.003 16.904,5.570 C16.904,4.175 16.446,2.886 15.616,1.939 ZM5.529,1.905 C6.154,1.905 6.729,2.115 7.237,2.528 C7.702,2.906 8.028,3.387 8.219,3.724 C8.522,4.253 9.346,4.252 9.646,3.723 C9.838,3.387 10.163,2.906 10.628,2.528 C11.137,2.115 11.712,1.905 12.337,1.905 C13.198,1.905 13.989,2.266 14.566,2.923 C15.160,3.599 15.486,4.540 15.486,5.570 C15.486,6.662 15.095,7.644 14.220,8.754 C13.352,9.855 12.049,11.023 10.530,12.383 C10.045,12.817 9.501,13.304 8.932,13.823 C8.365,13.305 7.823,12.818 7.332,12.379 C5.821,11.025 4.515,9.857 3.647,8.754 C2.770,7.644 2.379,6.662 2.379,5.570 C2.379,4.540 2.706,3.599 3.300,2.923 C3.877,2.266 4.668,1.905 5.529,1.905 Z"
                                      />
                                    </svg>
                                  </div>
                                ) : (
                                  <div
                                    data-toggle="modal"
                                    data-target="#login"
                                    role="button"
                                    className="e-btn light pd-heart"
                                  >
                                    <svg width="17px" height="16px">
                                      <path
                                        fillRule="evenodd"
                                        fill={"rgb(90, 106, 137)"}
                                        d="M15.616,1.939 C14.768,0.972 13.603,0.440 12.337,0.440 C11.387,0.440 10.516,0.755 9.751,1.377 C9.456,1.616 9.182,1.898 8.933,2.217 C8.683,1.898 8.409,1.616 8.115,1.377 C7.350,0.755 6.480,0.440 5.529,0.440 C4.262,0.440 3.098,0.972 2.249,1.939 C1.419,2.886 0.962,4.175 0.962,5.570 C0.962,7.002 1.465,8.308 2.547,9.681 C3.494,10.880 4.842,12.088 6.411,13.493 C6.940,13.967 7.540,14.504 8.163,15.077 C8.375,15.272 8.649,15.380 8.933,15.380 C9.218,15.380 9.491,15.272 9.703,15.077 C10.269,14.555 10.818,14.063 11.311,13.622 L11.458,13.490 C13.019,12.092 14.367,10.886 15.318,9.681 C16.400,8.309 16.904,7.003 16.904,5.570 C16.904,4.175 16.446,2.886 15.616,1.939 ZM5.529,1.905 C6.154,1.905 6.729,2.115 7.237,2.528 C7.702,2.906 8.028,3.387 8.219,3.724 C8.522,4.253 9.346,4.252 9.646,3.723 C9.838,3.387 10.163,2.906 10.628,2.528 C11.137,2.115 11.712,1.905 12.337,1.905 C13.198,1.905 13.989,2.266 14.566,2.923 C15.160,3.599 15.486,4.540 15.486,5.570 C15.486,6.662 15.095,7.644 14.220,8.754 C13.352,9.855 12.049,11.023 10.530,12.383 C10.045,12.817 9.501,13.304 8.932,13.823 C8.365,13.305 7.823,12.818 7.332,12.379 C5.821,11.025 4.515,9.857 3.647,8.754 C2.770,7.644 2.379,6.662 2.379,5.570 C2.379,4.540 2.706,3.599 3.300,2.923 C3.877,2.266 4.668,1.905 5.529,1.905 Z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </li>
                            </ul>
                          </div>
                        </li>
                        {isSignedIn && (
                          <li role="button" onClick={addToNextBuy}>
                            <div>افزودن به لیست خرید بعدی</div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ paddingBottom: "6em" }} className="e-pdtab-wrap">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="e-pdtab-inner">
                    <ul className="nav nav-pills e-pdtab-tabs" role="tablist">
                      <li>
                        <a
                          className="active"
                          data-toggle="pill"
                          href="#descrtiption"
                          role="tab"
                          aria-controls="descrtiption"
                          aria-selected="true"
                        >
                          توضیحات{" "}
                        </a>
                      </li>
                      <li>
                        <a
                          data-toggle="pill"
                          href="#addi_info"
                          role="tab"
                          aria-controls="addi_info"
                          aria-selected="false"
                        >
                          توضیحات اضافی
                        </a>
                      </li>
                      <li>
                        <a
                          data-toggle="pill"
                          href="#review"
                          role="tab"
                          aria-controls="review"
                          aria-selected="false"
                        >
                          نظرات{" "}
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="descrtiption"
                        role="tabpanel"
                      >
                        <div className="tab-content-inner">
                          <p className="mb-20">{product.description}</p>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="addi_info"
                        role="tabpanel"
                      >
                        <div className="tab-content-inner">
                          <div className="row">
                            <div className="col-md-4">
                              <ul className="pdtab-addinfo">
                                {desc &&
                                  desc.map((d) => {
                                    return (
                                      <li key={d.id}>
                                        <p>
                                          {" "}
                                          <span> {d.title} </span> -{" "}
                                          {d.property}
                                        </p>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="review"
                        role="tabpanel"
                        style={{ paddingBottom: "2em" }}
                      >
                        <div className="tab-content-inner">
                          <>
                            {comments.length > 0 &&
                              comments.map((comment, index) => {
                                return (
                                  <>
                                    <div
                                      style={{
                                        margin:
                                          index !== 0 ? "20px 0" : "0 0 20px 0",
                                      }}
                                      key={comment.id}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div
                                          style={{
                                            fontWeight: "bold",
                                            color: "#566686",
                                            fontSize: "20px",
                                          }}
                                        >
                                          {comment.username}{" "}
                                          {comment.userfamily}
                                        </div>
                                        <div
                                          style={{ marginRight: "10px" }}
                                          className="d-flex"
                                        >
                                          {Array.from(
                                            Array(comment.score).keys()
                                          ).map((each, index) => {
                                            return (
                                              <div style={{ margin: "0 2px" }}>
                                                <svg
                                                  version="1.1"
                                                  viewBox="0 0 58 58"
                                                  style={{ width: "15px" }}
                                                >
                                                  <g
                                                    fill="none"
                                                    fillRule="evenodd"
                                                    id="Page-1"
                                                    stroke="none"
                                                    strokeWidth="1"
                                                  >
                                                    <g
                                                      id="020---Star"
                                                      transform="translate(-1.000000, 0.000000)"
                                                    >
                                                      <path
                                                        d="M31.7569,1.14435 L39.2006,16.94809 C39.4742047,17.5450605 40.0274966,17.9662669 40.67576,18.07109 L57.32037,20.60534 C58.0728338,20.7512497 58.6840769,21.2991656 58.9110909,22.0312558 C59.1381048,22.7633461 58.9440977,23.560962 58.4062,24.107 L46.36205,36.40845 C45.8969861,36.8906851 45.6879532,37.5647752 45.79858,38.22553 L48.64182,55.59553 C48.7969313,56.3422303 48.5093863,57.1116407 47.9025754,57.5735945 C47.2957646,58.0355484 46.4775729,58.1079148 45.7991,57.75964 L30.9117,49.55864 C30.3445605,49.2442297 29.6554395,49.2442297 29.0883,49.55864 L14.2009,57.75964 C13.5224271,58.1079148 12.7042354,58.0355484 12.0974246,57.5735945 C11.4906137,57.1116407 11.2030687,56.3422303 11.35818,55.59553 L14.20142,38.22553 C14.3120468,37.5647752 14.1030139,36.8906851 13.63795,36.40845 L1.5938,24.107 C1.05593046,23.5609597 0.861941478,22.7633618 1.08895299,22.0312898 C1.31596449,21.2992177 1.92718692,20.7513115 2.67963,20.60539 L19.32424,18.0711 C19.9725034,17.9662769 20.5257953,17.5450705 20.7994,16.9481 L28.2431,1.14435 C28.5505421,0.448721422 29.2394609,-5.16717968e-06 30,-5.16717968e-06 C30.7605391,-5.16717968e-06 31.4494579,0.448721422 31.7569,1.14435 Z"
                                                        fill={
                                                          comment.score > index
                                                            ? "#F6AB27"
                                                            : "#eaeaea"
                                                        }
                                                        id="Shape"
                                                      />
                                                      <path
                                                        d="M18.14844,38.87158 C18.4633166,36.9540814 17.8494148,35.0009438 16.49414,33.6084 L7.07031,23.98291 L19.92676,22.02591 C21.8914891,21.7210725 23.5752482,20.4575107 24.417,18.65625 L30,6.80225 L35.581,18.65283 C36.4226712,20.4555677 38.1072282,21.720432 40.07319,22.02583 L52.92964,23.98283 L43.50386,33.61027 C42.1493392,35.0034307 41.5362139,36.9566633 41.85156,38.874 L44.03613,52.22166 L32.8418,46.05518 C31.0734665,45.0789497 28.9278569,45.0785721 27.15918,46.05418 L15.96387,52.22168 L18.14844,38.87158 Z"
                                                        fill={
                                                          comment.score > index
                                                            ? "#F6AB27"
                                                            : "#eaeaea"
                                                        }
                                                        id="Shape"
                                                      />
                                                    </g>
                                                  </g>
                                                </svg>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      <div
                                        style={{
                                          marginTop: "15px",
                                        }}
                                      >
                                        {comment.description}
                                      </div>
                                    </div>

                                    <hr />
                                  </>
                                );
                              })}

                            {comments.length === 0 ? (
                              <>
                                <h2
                                  style={{
                                    marginTop: "5em",
                                  }}
                                  className="pdtab-rev-title"
                                >
                                  هنوز هیچ نظری وجود ندارد.
                                </h2>
                                <h2 className="pdtab-rev-stitle">
                                  اولین نفری باشید که این محصول را مورد بازنگری
                                  قرار میدهد
                                </h2>
                              </>
                            ) : (
                              <div
                                style={{
                                  color: "#2f3942",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  marginTop: "5em",
                                }}
                              >
                                افزودن نظر
                              </div>
                            )}

                            <Formik
                              initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmit}
                            >
                              {({
                                values,
                                setFieldValue,
                                errors,
                                touched,
                                setFieldTouched,
                                submitForm,
                                resetForm,
                              }) => {
                                return (
                                  <Form>
                                    <div
                                      style={{ marginTop: "3em" }}
                                      className="row"
                                    >
                                      <div className="col-md-6 d-flex">
                                        <div style={{ fontSize: "20px" }}>
                                          امتیاز شما :
                                        </div>
                                        <div className="d-flex aign-items-center mr-2">
                                          {Array.from(Array(5).keys()).map(
                                            (each, index) => {
                                              return (
                                                <div
                                                  onClick={() => {
                                                    setFieldValue(
                                                      "score",
                                                      index + 1
                                                    );
                                                    setFieldTouched("score");
                                                  }}
                                                  key={index}
                                                  style={{ margin: "0 2px" }}
                                                >
                                                  <svg
                                                    version="1.1"
                                                    viewBox="0 0 58 58"
                                                    style={{ width: "25px" }}
                                                  >
                                                    <g
                                                      fill="none"
                                                      fillRule="evenodd"
                                                      id="Page-1"
                                                      stroke="none"
                                                      strokeWidth="1"
                                                    >
                                                      <g
                                                        id="020---Star"
                                                        transform="translate(-1.000000, 0.000000)"
                                                      >
                                                        <path
                                                          d="M31.7569,1.14435 L39.2006,16.94809 C39.4742047,17.5450605 40.0274966,17.9662669 40.67576,18.07109 L57.32037,20.60534 C58.0728338,20.7512497 58.6840769,21.2991656 58.9110909,22.0312558 C59.1381048,22.7633461 58.9440977,23.560962 58.4062,24.107 L46.36205,36.40845 C45.8969861,36.8906851 45.6879532,37.5647752 45.79858,38.22553 L48.64182,55.59553 C48.7969313,56.3422303 48.5093863,57.1116407 47.9025754,57.5735945 C47.2957646,58.0355484 46.4775729,58.1079148 45.7991,57.75964 L30.9117,49.55864 C30.3445605,49.2442297 29.6554395,49.2442297 29.0883,49.55864 L14.2009,57.75964 C13.5224271,58.1079148 12.7042354,58.0355484 12.0974246,57.5735945 C11.4906137,57.1116407 11.2030687,56.3422303 11.35818,55.59553 L14.20142,38.22553 C14.3120468,37.5647752 14.1030139,36.8906851 13.63795,36.40845 L1.5938,24.107 C1.05593046,23.5609597 0.861941478,22.7633618 1.08895299,22.0312898 C1.31596449,21.2992177 1.92718692,20.7513115 2.67963,20.60539 L19.32424,18.0711 C19.9725034,17.9662769 20.5257953,17.5450705 20.7994,16.9481 L28.2431,1.14435 C28.5505421,0.448721422 29.2394609,-5.16717968e-06 30,-5.16717968e-06 C30.7605391,-5.16717968e-06 31.4494579,0.448721422 31.7569,1.14435 Z"
                                                          fill={
                                                            values.score > index
                                                              ? "#F6AB27"
                                                              : "#eaeaea"
                                                          }
                                                          id="Shape"
                                                        />
                                                        <path
                                                          d="M18.14844,38.87158 C18.4633166,36.9540814 17.8494148,35.0009438 16.49414,33.6084 L7.07031,23.98291 L19.92676,22.02591 C21.8914891,21.7210725 23.5752482,20.4575107 24.417,18.65625 L30,6.80225 L35.581,18.65283 C36.4226712,20.4555677 38.1072282,21.720432 40.07319,22.02583 L52.92964,23.98283 L43.50386,33.61027 C42.1493392,35.0034307 41.5362139,36.9566633 41.85156,38.874 L44.03613,52.22166 L32.8418,46.05518 C31.0734665,45.0789497 28.9278569,45.0785721 27.15918,46.05418 L15.96387,52.22168 L18.14844,38.87158 Z"
                                                          fill={
                                                            values.score > index
                                                              ? "#F6AB27"
                                                              : "#eaeaea"
                                                          }
                                                          id="Shape"
                                                        />
                                                      </g>
                                                    </g>
                                                  </svg>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {errors.score && touched.score && (
                                      <div className="text-danger mt-2">
                                        {errors.score}
                                      </div>
                                    )}
                                    {/* {JSON.stringify(touched)} */}
                                    <div
                                      style={{ marginTop: "2em" }}
                                      className="row"
                                    >
                                      <div className="col-md-4">
                                        <div className="e-form-field mb-30">
                                          <input
                                            value={values.name}
                                            onBlur={() =>
                                              setFieldTouched("name")
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                "name",
                                                e.target.value
                                              )
                                            }
                                            className="e-field-inner input-font"
                                            type="text"
                                            placeholder="نام"
                                          />
                                          {errors.name && touched.name && (
                                            <div className="text-danger mt-2">
                                              {errors.name}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="e-form-field mb-30">
                                          <input
                                            onChange={(e) =>
                                              setFieldValue(
                                                "family",
                                                e.target.value
                                              )
                                            }
                                            onBlur={() =>
                                              setFieldTouched("family")
                                            }
                                            value={values.family}
                                            className="e-field-inner input-font"
                                            type="text"
                                            placeholder="نام خانوادگی"
                                          />
                                          {errors.family && touched.family && (
                                            <div className="text-danger mt-2">
                                              {errors.family}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="e-form-field mb-30">
                                          <input
                                            onChange={(e) =>
                                              setFieldValue(
                                                "phone",
                                                e.target.value
                                              )
                                            }
                                            onBlur={() =>
                                              setFieldTouched("phone")
                                            }
                                            value={values.phone}
                                            className="e-field-inner input-font"
                                            type="text"
                                            placeholder="شماره تلغن همراه"
                                          />
                                          {errors.phone && touched.phone && (
                                            <div className="text-danger mt-2">
                                              {errors.phone}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="e-form-field mb-30">
                                          <textarea
                                            onChange={(e) =>
                                              setFieldValue(
                                                "desc",
                                                e.target.value
                                              )
                                            }
                                            onBlur={() =>
                                              setFieldTouched("desc")
                                            }
                                            value={values.desc}
                                            placeholder="نظر شما"
                                            className="e-field-inner input-font"
                                          ></textarea>
                                          {errors.desc && touched.desc && (
                                            <div className="text-danger mt-2">
                                              {errors.desc}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="e-form-field">
                                          <button
                                            onClick={() => {
                                              submitForm().then(() => {
                                                resetForm();
                                              });
                                            }}
                                            type="button"
                                            className="e-btn"
                                          >
                                            ارسال
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </Form>
                                );
                              }}
                            </Formik>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="e-newarivles-wrap e-newarivles-cloth">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="e-heading-wrap mb-38 text-center">
                    <h2 className="e-heading-title">محصولات ویژه</h2>
                    <p className="e-heading-subtitle">ویژه</p>
                  </div>
                </div>
              </div>
              <hr style={{ paddingBottom: "1em" }} />

              <LazyLoad
                once
                placeholder={<div />}
                offset={50}
                // height={600}
              >
                {newItems.length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="e-gallery new-arrivals-galry text-center">
                        <div className="row">
                          {newItems.map((each) => {
                            const price = parseInt(each.priceTakhfif);
                            return (
                              <div
                                role="button"
                                onClick={() =>
                                  history.push(`/product/${each.id}`)
                                }
                                key={each.id}
                                className="col-lg-3 col-md-4 col-sm-6 col-12 grid-item"
                              >
                                <div className="na-inner-grid c-product-box">
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
                                      {price.toLocaleString("fa-IR")} تومان
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </LazyLoad>
            </div>
          </section>

          {/* <LoginModal hello="name" /> */}
        </>
      )}
    </Layout>
  );
}

const mapState = (state) => {
  return {
    cartItems: state.cartItems,
    totalPrice: state.totalPrice,
  };
};
const mapDis = (dispatch) => {
  return {
    add: (product) => dispatch(add(product)),
  };
};

export default connect(mapState, mapDis)(withRouter(ProductDetails));
