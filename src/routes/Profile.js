import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import LoginModal from "../components/Header/LoginModal";
import axios from "axios";
import moment from "moment-jalaali";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Mapir from "mapir-react-component";

const initialValues = {
  codeposti: "",
  title: "",
  address: "",
  lat: "",
  lon: "",
};
const validationSchema = yup.object({
  codeposti: yup
    .string()
    .typeError("کدپستی وارد نشده")
    .required("کدپستی وارد نشده"),
  lat: yup
    .string()
    .typeError("موقعیت نقشه وارد نشده")
    .required("موقعیت نقشه وارد نشده"),
  lon: yup
    .string()
    .typeError("موقعیت نقشه وارد نشده")
    .required("موقعیت نقشه وارد نشده"),
  title: yup
    .string()
    .typeError("نام آدرس وارد نشده")
    .required("نام آدرس وارد نشده"),
  address: yup.string().typeError("آدرس وارد نشده").required("آدرس وارد نشده"),
});

const detailsInitialValues = {
  name: "",
  family: "",
  email: "",
  password: "",
};

const detailsValidationSchema = yup.object({
  family: yup
    .string()
    .typeError("نام فامیلی وارد نشده")
    .required("نام فامیلی وارد نشده"),
  name: yup.string().typeError("نام وارد نشده").required("نام وارد نشده"),
  email: yup.string().typeError("ایمیل وارد نشده").required("ایمیل وارد نشده"),
});

moment.loadPersian([{ usePersianDigits: true }]);

const Map = Mapir.setToken({
  dragPan: false,
  interactive: false,
  minZoom: [14],
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key": process.env.REACT_APP_MAP,
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const AddMap = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key": process.env.REACT_APP_MAP,
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [details, setDetails] = React.useState(null);
  const [addresses, setAddresses] = React.useState(null);
  const [addressId, setAddressId] = React.useState(null);
  const [basketDetail, setBasketDetail] = React.useState(null);
  const [basketLoading, setBasketLoading] = React.useState(false);
  const [basketHistory, setBasketHistory] = React.useState(null);
  const [editProfile, setEditProfile] = React.useState(false);
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const setProfileDetails = async (values) => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}SetProfile.aspx?phone=${phone}&name=${values.name}&family=${values.family}&email=${values.email}&password=${values.password}`
      )
      .then((res) => {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}UserDetail.aspx?phone=${phone}`
          )
          .then((r) => {
            setDetails(r.data[0]);
            setEditProfile(false);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getBasket = (basketId) => {
    setBasketLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}BasketDetailHistory.aspx?basketID=${basketId}`
      )
      .then((res) => {
        setBasketDetail(res.data);
        setBasketLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setBasketLoading(false);
      });
  };

  const getUserData = async () => {
    const isSignedIn = localStorage.getItem("auth");
    if (isSignedIn === "true") {
      const localPhone = await localStorage.getItem("phone");
      const phone = JSON.parse(localPhone);
      axios
        .all([
          axios.get(
            `${process.env.REACT_APP_BASE_URL}UserDetail.aspx?phone=${phone}`
          ),
          axios.get(
            `${process.env.REACT_APP_BASE_URL}UserAddress.aspx?phone=${phone}`
          ),
          axios.get(
            `${process.env.REACT_APP_BASE_URL}BasketHistory.aspx?phone=${phone}`
          ),
        ])
        .then(
          axios.spread((firstResponse, secondResponse, thirdResponse) => {
            setDetails(firstResponse.data[0]);
            setAddresses(secondResponse.data);
            setBasketHistory(thirdResponse.data.reverse());
            setLoading(false);
            setIsLoggedIn(true);
          })
        )
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getUserData();
  }, []);

  // Handle delete address
  const deleteAddress = async () => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}DeleteAddress.aspx?id=${addressId}`
      )
      .then((res) => {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}UserAddress.aspx?phone=${phone}`
          )
          .then((res) => {
            setAddresses(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // Add address
  const addAddress = async (values) => {
    const localPhone = await localStorage.getItem("phone");
    const phone = JSON.parse(localPhone);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}SetAddress.aspx?phone=${phone}&title=${values.title}&address=${values.address}&codeposti=${values.codeposti}&mapLat=${values.lat}&mapLong=${values.lon}`
      )
      .then((res) => {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}UserAddress.aspx?phone=${phone}`
          )
          .then((res) => {
            setAddresses(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Add map lat lon
  const [markerArray, setMarkerArray] = React.useState([]);
  const [lat, setLat] = React.useState(35.72);
  const [lon, setLon] = React.useState(51.42);
  const reverseFunction = (map, e) => {
    const array = [];
    array.push(
      <Mapir.Marker
        coordinates={[e.lngLat.lng, e.lngLat.lat]}
        style={{ width: "60px", height: "60px" }}
        Image={process.env.REACT_APP_MARKER}
      />
    );
    setMarkerArray(array);
    setLat(e.lngLat.lat);
    setLon(e.lngLat.lng);
  };
  return (
    <Layout loading={loading} title="حساب کاربری">
      {/* <!-- Breadcumbs staبrt --> */}
      <div
        style={{ marginBottom: "1em" }}
        className="e-breadcumb-wrap text-center"
      >
        <h2 className="e-breadcumb-title">حساب کاربری</h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه </NavLink>
          </li>
          <li>
            <NavLink to="/profile">حساب کاربری</NavLink>
          </li>
        </ul>
      </div>

      {isLoggedIn ? (
        <div className="e-profile-wrap e-profile-cloth">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="e-profile-inner">
                  <div
                    style={{ backgroundColor: "white" }}
                    className="e-pdtab-inner"
                  >
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
                          اطلاعات کاربر
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
                          آدرس ها
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
                          سوابق خرید
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
                          {editProfile ? (
                            <div className="e-profile-box">
                              <div
                                role="button"
                                onClick={() => setEditProfile(false)}
                                className="d-flex align-items-center"
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center"
                                  style={{
                                    backgroundColor: "#60babe",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <svg
                                    x="0px"
                                    y="0px"
                                    style={{ width: "14px" }}
                                    fill={"#ccc"}
                                    viewBox="0 0 485.219 485.22"
                                    enableBackground={"new 0 0 485.219 485.22"}
                                  >
                                    <g>
                                      <path
                                        fill="white"
                                        d="M467.476,146.438l-21.445,21.455L317.35,39.23l21.445-21.457c23.689-23.692,62.104-23.692,85.795,0l42.886,42.897
                                            C491.133,84.349,491.133,122.748,467.476,146.438z M167.233,403.748c-5.922,5.922-5.922,15.513,0,21.436
                                            c5.925,5.955,15.521,5.955,21.443,0L424.59,189.335l-21.469-21.457L167.233,403.748z M60,296.54c-5.925,5.927-5.925,15.514,0,21.44
                                            c5.922,5.923,15.518,5.923,21.443,0L317.35,82.113L295.914,60.67L60,296.54z M338.767,103.54L102.881,339.421
                                            c-11.845,11.822-11.815,31.041,0,42.886c11.85,11.846,31.038,11.901,42.914-0.032l235.886-235.837L338.767,103.54z
                                                M145.734,446.572c-7.253-7.262-10.749-16.465-12.05-25.948c-3.083,0.476-6.188,0.919-9.36,0.919
                                            c-16.202,0-31.419-6.333-42.881-17.795c-11.462-11.491-17.77-26.687-17.77-42.887c0-2.954,0.443-5.833,0.859-8.703
                                            c-9.803-1.335-18.864-5.629-25.972-12.737c-0.682-0.677-0.917-1.596-1.538-2.338L0,485.216l147.748-36.986
                                            C147.097,447.637,146.36,447.193,145.734,446.572z"
                                      ></path>
                                    </g>
                                  </svg>
                                </div>
                                <div className="mr-2">مشاهده اطلاعات</div>
                              </div>
                              <Formik
                                initialValues={detailsInitialValues}
                                onSubmit={setProfileDetails}
                                validationSchema={detailsValidationSchema}
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
                                      <div className="row mt-5">
                                        <div className="col-md-6 ">
                                          <div className="e-form-field mb-26">
                                            <label>نام کوچک </label>
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
                                              className="e-field-inner require input-font"
                                              type="text"
                                              placeholder={
                                                (details && details.name) || ""
                                              }
                                            />
                                            {touched.name && errors.name && (
                                              <div className="text-danger mt-10">
                                                {errors.name}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-md-6 ">
                                          <div className="e-form-field mb-26">
                                            <label>نام خانوادگی </label>
                                            <input
                                              value={values.family}
                                              onBlur={() =>
                                                setFieldTouched("family")
                                              }
                                              onChange={(e) =>
                                                setFieldValue(
                                                  "family",
                                                  e.target.value
                                                )
                                              }
                                              className="e-field-inner require input-font"
                                              type="text"
                                              placeholder={
                                                (details && details.family) ||
                                                ""
                                              }
                                            />
                                            {touched.family &&
                                              errors.family && (
                                                <div className="text-danger mt-10">
                                                  {errors.family}
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-md-6 ">
                                          <div className="e-form-field mb-26">
                                            <label>ایمیل </label>
                                            <input
                                              value={values.email}
                                              onBlur={() =>
                                                setFieldTouched("email")
                                              }
                                              onChange={(e) =>
                                                setFieldValue(
                                                  "email",
                                                  e.target.value
                                                )
                                              }
                                              className="e-field-inner require input-font"
                                              type="email"
                                              placeholder={
                                                (details && details.email) || ""
                                              }
                                            />
                                            {touched.email && errors.email && (
                                              <div className="text-danger mt-10">
                                                {errors.email}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-md-6 ">
                                          <div className="e-form-field mb-26">
                                            <label>شماره تلفن همراه</label>
                                            <input
                                              value={
                                                (details && details.phone) || ""
                                              }
                                              className="e-field-inner require input-font"
                                              type="number"
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        {/* <div className="col-md-12">
                                          <div className="e-form-field mb-26">
                                            <label>رمز عبور </label>
                                            <input
                                              value={values.password}
                                              onBlur={() =>
                                                setFieldTouched("password")
                                              }
                                              onChange={(e) =>
                                                setFieldValue(
                                                  "password",
                                                  e.target.value
                                                )
                                              }
                                              className="e-field-inner require input-font"
                                              type="password"
                                              placeholder={""}
                                            />
                                            {touched.password &&
                                              errors.password && (
                                                <div className="text-danger mt-10">
                                                  {errors.password}
                                                </div>
                                              )}
                                          </div>
                                        </div> */}

                                        <div className="col-md-12">
                                          <div className="">
                                            <button
                                              onClick={() => submitForm()}
                                              type="button"
                                              className="e-btn"
                                            >
                                              ذخیره
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </Form>
                                  );
                                }}
                              </Formik>
                            </div>
                          ) : (
                            details && (
                              <>
                                <div
                                  role="button"
                                  onClick={() => setEditProfile(true)}
                                  className="d-flex align-items-center"
                                >
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                      backgroundColor: "#60babe",
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <svg
                                      x="0px"
                                      y="0px"
                                      style={{ width: "14px" }}
                                      fill={"#ccc"}
                                      viewBox="0 0 485.219 485.22"
                                      enableBackground={
                                        "new 0 0 485.219 485.22"
                                      }
                                    >
                                      <g>
                                        <path
                                          fill="white"
                                          d="M467.476,146.438l-21.445,21.455L317.35,39.23l21.445-21.457c23.689-23.692,62.104-23.692,85.795,0l42.886,42.897
                                            C491.133,84.349,491.133,122.748,467.476,146.438z M167.233,403.748c-5.922,5.922-5.922,15.513,0,21.436
                                            c5.925,5.955,15.521,5.955,21.443,0L424.59,189.335l-21.469-21.457L167.233,403.748z M60,296.54c-5.925,5.927-5.925,15.514,0,21.44
                                            c5.922,5.923,15.518,5.923,21.443,0L317.35,82.113L295.914,60.67L60,296.54z M338.767,103.54L102.881,339.421
                                            c-11.845,11.822-11.815,31.041,0,42.886c11.85,11.846,31.038,11.901,42.914-0.032l235.886-235.837L338.767,103.54z
                                                M145.734,446.572c-7.253-7.262-10.749-16.465-12.05-25.948c-3.083,0.476-6.188,0.919-9.36,0.919
                                            c-16.202,0-31.419-6.333-42.881-17.795c-11.462-11.491-17.77-26.687-17.77-42.887c0-2.954,0.443-5.833,0.859-8.703
                                            c-9.803-1.335-18.864-5.629-25.972-12.737c-0.682-0.677-0.917-1.596-1.538-2.338L0,485.216l147.748-36.986
                                            C147.097,447.637,146.36,447.193,145.734,446.572z"
                                        ></path>
                                      </g>
                                    </svg>
                                  </div>

                                  <div style={{ marginRight: "10px" }}>
                                    ویرایش اطلاعات
                                  </div>
                                </div>

                                <div className="row mt-5">
                                  <div className="col-md-6 ">
                                    <div className="e-form-field mb-26">
                                      <label>نام :</label>
                                      <span
                                        style={{
                                          color:
                                            details && details.name
                                              ? "#566686"
                                              : "#ccc",
                                          fontWeight:
                                            details && details.name
                                              ? "bold"
                                              : "normal",
                                        }}
                                        className="mr-1"
                                      >
                                        {details && details.name
                                          ? details.name
                                          : "انتخاب نشده"}
                                      </span>
                                    </div>
                                    <div className="e-form-field mb-26">
                                      <label>شماره همراه :</label>
                                      <span
                                        style={{
                                          color:
                                            details && details.phone
                                              ? "#566686"
                                              : "#ccc",
                                          fontWeight:
                                            details && details.phone
                                              ? "bold"
                                              : "normal",
                                        }}
                                        className="mr-1"
                                      >
                                        ۰
                                        {parseInt(details.phone).toLocaleString(
                                          "fa-IR",
                                          { useGrouping: false }
                                        )}
                                      </span>
                                    </div>
                                    <div className="e-form-field mb-26">
                                      <label>وضعیت :</label>
                                      <span
                                        style={{
                                          color: "#566686",
                                          fontWeight: "bold",
                                        }}
                                        className="mr-1"
                                      >
                                        {details && details.isActive
                                          ? "فعال"
                                          : "غیرفعال"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-6 ">
                                    <div className="e-form-field mb-26">
                                      <label>نام فامیلی :</label>
                                      <span
                                        style={{
                                          color:
                                            details && details.family
                                              ? "#566686"
                                              : "#ccc",
                                          fontWeight:
                                            details && details.family
                                              ? "bold"
                                              : "normal",
                                        }}
                                        className="mr-1"
                                      >
                                        {details && details.family
                                          ? details.family
                                          : "انتخاب نشده"}
                                      </span>
                                    </div>
                                    <div className="e-form-field mb-26">
                                      <label>ایمیل :</label>
                                      <span
                                        style={{
                                          color:
                                            details && details.email
                                              ? "#566686"
                                              : "#ccc",
                                          fontWeight:
                                            details && details.email
                                              ? "bold"
                                              : "normal",
                                        }}
                                        className="mr-1"
                                      >
                                        {details && details.email
                                          ? details.email
                                          : "انتخاب نشده"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="addi_info"
                        role="tabpanel"
                      >
                        <div className="tab-content-inner">
                          {addresses.length > 0 && (
                            <div
                              role="button"
                              style={{ marginBottom: "2em" }}
                              data-toggle="modal"
                              data-target="#addaddress"
                              className="e-btn light"
                            >
                              افزودن آدرس
                            </div>
                          )}
                          {addresses.length > 0 ? (
                            addresses.map((address) => {
                              let lat;
                              let lon;
                              if (address.mapLat && address.mapLong) {
                                lat = JSON.parse(address.mapLat);
                                lon = JSON.parse(address.mapLong);
                              } else {
                                lat = 0;
                                lon = 0;
                              }
                              return (
                                <div key={address.id}>
                                  <div style={{ margin: "5px" }}>
                                    <div className="d-flex justify-content-between">
                                      <div
                                        style={{
                                          fontSize: "20px",
                                          color: "#666",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {address.title}{" "}
                                      </div>
                                      <div
                                        onClick={() => setAddressId(address.id)}
                                        data-toggle="modal"
                                        data-target="#deleteaddress"
                                        className="text-danger"
                                        role="button"
                                        style={{ fontSize: "13px" }}
                                      >
                                        حذف آدرس
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div style={{ marginTop: "20px" }}>
                                          {" "}
                                          <svg
                                            enableBackground="new 0 0 30 30"
                                            style={{
                                              width: "22px",
                                              marginLeft: "10px",
                                              cursor: "default",
                                            }}
                                            viewBox="0 0 30 30"
                                          >
                                            <path
                                              d="M15.1,0.3c-6,0-10,4-10,9.8c0,7.8,7.2,17.5,9.1,19.4c0.1,0.1,0.3,0.2,0.5,0.2c0,0,0,0,0,0  c0.2,0,0.4-0.1,0.5-0.3c1-1.1,9.6-11.1,9.6-19.3C24.9,3.3,20,0.3,15.1,0.3z M14.7,27.8c-2.3-2.7-8.1-11.1-8.1-17.7  c0-5.1,3.3-8.3,8.5-8.3c3.8,0,8.3,2.2,8.3,8.3C23.4,16,18.2,23.8,14.7,27.8z M15,6.1c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4s4-1.8,4-4  C19,7.9,17.2,6.1,15,6.1z M15,12.6c-1.4,0-2.5-1.1-2.5-2.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5C17.5,11.5,16.4,12.6,15,12.6z"
                                              fill="#7d8fb3"
                                            />
                                          </svg>
                                          {address.address1}{" "}
                                        </div>
                                        <div style={{ marginTop: "20px" }}>
                                          {" "}
                                          <svg
                                            style={{
                                              width: "22px",
                                              marginLeft: "10px",
                                              cursor: "default",
                                            }}
                                            fill={"#7d8fb3"}
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M4 4a3 3 0 0 0-3 3v6h6V7a3 3 0 0 0-3-3zm0-1h8a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4zm2.646 1A3.99 3.99 0 0 1 8 7v6h7V7a3 3 0 0 0-3-3H6.646z" />
                                            <path d="M11.793 8.5H9v-1h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.354-.146l-.853-.854zM5 7c0 .552-.448 0-1 0s-1 .552-1 0a1 1 0 0 1 2 0z" />
                                          </svg>{" "}
                                          {parseInt(
                                            address.codePosti
                                          ).toLocaleString("fa-IR", {
                                            useGrouping: false,
                                          })}{" "}
                                        </div>
                                        <div style={{ marginTop: "20px" }}>
                                          {" "}
                                          <svg
                                            style={{
                                              width: "22px",
                                              marginLeft: "10px",
                                              cursor: "default",
                                            }}
                                            fill={"#7d8fb3"}
                                            viewBox="0 0 512 512"
                                          >
                                            <g>
                                              <path d="M348.73,450.06a198.63,198.63,0,0,1-46.4-5.85c-52.43-12.65-106.42-44.74-152-90.36s-77.71-99.62-90.36-152C46.65,146.75,56.15,99.61,86.69,69.07l8.72-8.72a42.2,42.2,0,0,1,59.62,0l50.11,50.1a42.18,42.18,0,0,1,0,59.62l-29.6,29.59c14.19,24.9,33.49,49.82,56.3,72.63s47.75,42.12,72.64,56.31L334.07,299a42.15,42.15,0,0,1,59.62,0l50.1,50.1a42.16,42.16,0,0,1,0,59.61l-8.73,8.72C413.53,439,383.73,450.06,348.73,450.06ZM125.22,78a12,12,0,0,0-8.59,3.56l-8.73,8.72c-22.87,22.87-29.55,60-18.81,104.49,11.37,47.13,40.64,96.1,82.41,137.86s90.73,71,137.87,82.41c44.5,10.74,81.61,4.06,104.48-18.81l8.72-8.72a12.16,12.16,0,0,0,0-17.19l-50.09-50.1a12.16,12.16,0,0,0-17.19,0l-37.51,37.51a15,15,0,0,1-17.5,2.72c-30.75-15.9-61.75-39.05-89.65-66.95s-51-58.88-66.94-89.63a15,15,0,0,1,2.71-17.5l37.52-37.51a12.16,12.16,0,0,0,0-17.19l-50.1-50.11A12.07,12.07,0,0,0,125.22,78Z" />
                                              <path d="M364.75,269.73a15,15,0,0,1-15-15,99.37,99.37,0,0,0-99.25-99.26,15,15,0,0,1,0-30c71.27,0,129.25,58,129.25,129.26A15,15,0,0,1,364.75,269.73Z" />
                                              <path d="M428.15,269.73a15,15,0,0,1-15-15c0-89.69-73-162.66-162.65-162.66a15,15,0,0,1,0-30c106.23,0,192.65,86.43,192.65,192.66A15,15,0,0,1,428.15,269.73Z" />
                                            </g>
                                          </svg>
                                          ۰
                                          {parseInt(
                                            address.userphone
                                          ).toLocaleString("fa-IR", {
                                            useGrouping: false,
                                          })}
                                        </div>
                                      </div>

                                      {lat !== 0 && lon !== 0 && (
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                          <div
                                            id="view"
                                            className="d-flex justify-content-end"
                                            style={{ marginTop: "20px" }}
                                          >
                                            <Mapir
                                              center={[lon, lat]}
                                              Map={Map}
                                              dragPan={false}
                                            >
                                              <Mapir.Marker
                                                coordinates={[lon, lat]}
                                                anchor="bottom"
                                                Image={
                                                  process.env.REACT_APP_MARKER
                                                }
                                              ></Mapir.Marker>
                                            </Mapir>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <hr />
                                </div>
                              );
                            })
                          ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <div style={{ marginTop: "3em" }}>
                                آدرسی یافت نشد .
                              </div>
                              <div
                                data-toggle="modal"
                                data-target="#addaddress"
                                role="button"
                                style={{ marginTop: "2em" }}
                                className="e-btn light"
                              >
                                ثبت آدرس
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="review"
                        role="tabpanel"
                        style={{ paddingBottom: "2em" }}
                      >
                        <div className="tab-content-inner">
                          {basketHistory.length > 0 ? (
                            <div className="">
                              {basketHistory.map((basket) => {
                                return (
                                  <div className="row" key={basket.id}>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                      <div className="d-flex mt-10">
                                        <div>وضعیت پرداخت :</div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {basket.isPaid
                                            ? "پرداخت شده"
                                            : "پرداخت نشده"}
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>مبلغ کل : </div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {parseInt(
                                            basket.totalPrice
                                          ).toLocaleString("fa-IR")}{" "}
                                          ریال
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>شماره تلفن همراه : </div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          ۰
                                          {parseInt(
                                            basket.userphone
                                          ).toLocaleString("fa-IR", {
                                            useGrouping: false,
                                          })}
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>استفاده از کد تخفیف : </div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {basket.isTakhfif ? "بله" : "خیر"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                      <div className="d-flex mt-10">
                                        <div>مبلغ تخفیف :</div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {parseInt(
                                            basket.totalPriceTakhfif
                                          ).toLocaleString("fa-IR")}{" "}
                                          ریال
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>‌تاریخ سفارش :</div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {convert(
                                            moment(basket.date).format("jD")
                                          )}{" "}
                                          /{" "}
                                          {convert(
                                            moment(basket.date).format("jM")
                                          )}{" "}
                                          /{" "}
                                          {convert(
                                            moment(basket.date).format("jYYYY")
                                          )}
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>توضیحات :</div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {basket.description}
                                        </div>
                                      </div>
                                      <div className="d-flex mt-10">
                                        <div>وضعیت :</div>
                                        <div
                                          style={{
                                            color: "#566686",
                                            fontWeight: "bold",
                                          }}
                                          className="mr-1"
                                        >
                                          {basket.isdelivered
                                            ? "تحویل داده شده"
                                            : "تحویل داده نشده"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div
                                        onClick={() => {}}
                                        style={{ marginTop: "3em" }}
                                        className="d-flex justify-content-end"
                                      >
                                        <div
                                          onClick={() => getBasket(basket.id)}
                                          role="button"
                                          data-toggle="modal"
                                          data-target="#basketdetail"
                                          className="e-btn light"
                                        >
                                          جزئیات سفارش
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        backgroundColor: "#eaeaea",
                                        height: "1px",
                                        width: "100%",
                                        marginTop: "20px",
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <div style={{ marginTop: "3em" }}>
                                سفارشی یافت نشد .
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <LoginModal />
          <div className="text-center" style={{ padding: "10em 0" }}>
            <div style={{ fontSize: "1.3em" }}>
              لطفا ابتدا ثبت نام و یا به حساب کاربری خود وارد شوید .
            </div>
            <div className="d-flex justify-content-center">
              <div
                style={{ marginTop: "2em" }}
                data-toggle="modal"
                data-target="#login"
                className="d-flex topmenu-item e-btn light"
              >
                ثبت نام یا ورود
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete address modal  */}
      <div className="e-autho-model modal fade" id="deleteaddress">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-inner">
                <button
                  type="button"
                  className="autho-close"
                  data-dismiss="modal"
                >
                  &times;
                </button>
                <div>آیا از حذف آدرس مطمئن هستید ؟</div>
                <div style={{ marginTop: "20px" }}>
                  <div
                    onClick={deleteAddress}
                    className="btn btn-danger "
                    role="button"
                    data-dismiss="modal"
                  >
                    حذف آدرس
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add address modal  */}
      <div className="e-autho-model modal fade" id="addaddress">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-inner">
                <button
                  type="button"
                  className="autho-close"
                  data-dismiss="modal"
                >
                  &times;
                </button>
                <Formik
                  initialValues={initialValues}
                  onSubmit={addAddress}
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
                    const fieldErrors =
                      (errors.address && values.address) ||
                      (errors.lat && values.lat) ||
                      (errors.lon && values.lon) ||
                      (errors.codeposti && values.codeposti) ||
                      (errors.title && values.title) ||
                      (errors.phone && values.phone);
                    const emptyValues =
                      !values.address ||
                      !values.lon ||
                      !values.lat ||
                      !values.codeposti ||
                      !values.phone ||
                      !values.title;
                    const btnDisabled = fieldErrors && emptyValues;
                    return (
                      <Form>
                        <div className="e-profile-box">
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "17px",
                              marginBottom: "2em",
                            }}
                          >
                            افزودن آدرس
                          </div>
                          <div
                            style={{ marginTop: "2em" }}
                            className="row mb-5"
                          >
                            <div id="add" className="col-md-12">
                              <label style={{ marginBottom: "1em" }}>
                                موقعیت بروی نقشه
                              </label>
                              <Mapir
                                center={[lon, lat]}
                                Map={AddMap}
                                onClick={(map, e) => {
                                  reverseFunction(map, e);
                                  setFieldTouched("lat");
                                  setFieldTouched("lon");
                                  setFieldValue("lat", e.lngLat.lat);
                                  setFieldValue("lon", e.lngLat.lng);
                                }}
                                userLocation
                              >
                                {markerArray}
                              </Mapir>
                              {touched.lat &&
                                touched.lon &&
                                errors.lon &&
                                errors.lat && (
                                  <div className="text-danger mt-10">
                                    {errors.lat}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 ">
                              <div className="e-form-field mb-26">
                                <label>نام آدرس </label>
                                <input
                                  className="e-field-inner require input-font"
                                  type="text"
                                  value={values.title}
                                  onBlur={() => setFieldTouched("title")}
                                  onChange={(e) =>
                                    setFieldValue("title", e.target.value)
                                  }
                                />
                                {touched.title && errors.title && (
                                  <div className="text-danger mt-10">
                                    {errors.title}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 ">
                              <div className="e-form-field mb-26">
                                <label>کدپستی</label>
                                <input
                                  className="e-field-inner require input-font"
                                  type="codeposti"
                                  value={values.codeposti}
                                  onBlur={() => setFieldTouched("codeposti")}
                                  onChange={(e) =>
                                    setFieldValue("codeposti", e.target.value)
                                  }
                                />
                                {touched.codeposti && errors.codeposti && (
                                  <div className="text-danger mt-10">
                                    {errors.codeposti}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="e-form-field mb-26">
                                <label>آدرس</label>
                                <textarea
                                  className="e-field-inner require input-font"
                                  value={values.address}
                                  onBlur={() => setFieldTouched("address")}
                                  onChange={(e) =>
                                    setFieldValue("address", e.target.value)
                                  }
                                />
                                {touched.address && errors.address && (
                                  <div className="text-danger mt-10">
                                    {errors.address}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <button
                                data-dismiss={"modal"}
                                disabled={btnDisabled}
                                onClick={() => submitForm()}
                                type="button"
                                className="e-btn"
                              >
                                ثبت آدرس
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Basket details modal  */}
      <div className="e-autho-model modal fade" id="basketdetail">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-inner">
                <button
                  type="button"
                  className="autho-close"
                  data-dismiss="modal"
                >
                  &times;
                </button>
                <div
                  style={{ fontSize: "20px", color: "", fontWeight: "bold" }}
                >
                  جزئیات سفارش
                </div>
                {basketLoading ? (
                  <div className="mt-2">درحال بارگذاری ...</div>
                ) : (
                  basketDetail &&
                  basketDetail.length > 0 &&
                  basketDetail.map((detail, index) => {
                    return (
                      <div key={detail.id}>
                        <div className={`row`}>
                          <div className="col-12">
                            <div
                              className={`d-flex ${
                                index === 0 ? "mt-3" : "mt-0"
                              }`}
                            >
                              <div>توضیحات :</div>
                            </div>
                            <div
                              style={{
                                color: "#566686",
                                fontWeight: "bold",
                              }}
                              className="mt-2"
                            >
                              {detail && detail.description}
                            </div>
                            <div className="d-flex mt-10">
                              <div>قیمت :</div>
                              <div
                                style={{
                                  color: "#566686",
                                  fontWeight: "bold",
                                }}
                                className="mr-1"
                              >
                                {detail &&
                                  parseInt(detail.price).toLocaleString(
                                    "fa-IR"
                                  )}{" "}
                                تومان
                              </div>
                            </div>
                            <div className="d-flex mt-10">
                              <div>قیمت تخفیف :</div>
                              <div
                                style={{
                                  color: "#566686",
                                  fontWeight: "bold",
                                }}
                                className="mr-1"
                              >
                                {detail &&
                                  parseInt(detail.priceTakhfif).toLocaleString(
                                    "fa-IR"
                                  )}{" "}
                                تومان
                              </div>
                            </div>
                            <div className="d-flex mt-10">
                              <div>تعداد :</div>
                              <div
                                style={{
                                  color: "#566686",
                                  fontWeight: "bold",
                                }}
                                className="mr-1"
                              >
                                {detail &&
                                  parseInt(detail.count).toLocaleString(
                                    "fa-IR"
                                  )}
                              </div>
                            </div>
                            <div className="d-flex mt-10">
                              <div>رنگ :</div>
                              <div
                                style={{
                                  color: "#566686",
                                  fontWeight: "bold",
                                }}
                                className="mr-1"
                              >
                                {detail && detail.colorTitle}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{ marginTop: "2em" }}
                          className="d-flex justify-content-between"
                        >
                          <div style={{ fontSize: "17px" }}>مبلغ نهایی :</div>
                          <div
                            style={{
                              fontWeight: "bold",
                              color: "#566686",
                            }}
                          >
                            {detail &&
                              parseInt(detail.totalPriceTakhfif).toLocaleString(
                                "fa-IR"
                              )}{" "}
                            تومان
                          </div>
                        </div>
                        <div
                          style={{
                            height: "1px",
                            backgroundColor: "#eaeaea",
                            width: "100%",
                            margin: "2em 0",
                          }}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
