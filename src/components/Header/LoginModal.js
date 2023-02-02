import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const initialValues = {
  number: "",
};
const phoneRegExp =
  /(0|\+98)?([ ]|,|-|[()]){0,2}9[1|2|3|4]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8}/;

const validationSchema = yup.object({
  phonenumber: yup
    .string()
    .typeError("شماره موبایل وارد نشده")
    .matches(phoneRegExp, "شماره موبایل صحیح نیست")
    .required("شماره موبایل وارد نشده"),
  code: yup
    .string()
    .min(4, "کد تایید وارد شده باید ۴ رقم باشد")
    .max(4, "کد تایید وارد شده باید ۴ رقم باشد")
    .typeError("کد تایید وارد نشده")
    .required("کد تایید وارد نشده"),
});
function LoginModal({ history, setAuth }) {
  const [codesent, setCodesent] = useState(false);
  const [codeVerified, setCodeverified] = useState(false);
  const [phone, setPhone] = React.useState("");
  const onSubmit = (e) => {
    const body = document.body;
    const el = document.querySelector(".modal-backdrop");
    if (el.classList.contains("show")) {
      el.classList.remove("show");
    }
    if (el.classList.contains("fade")) {
      el.classList.remove("fade");
    }
    if (el.classList.contains("modal-backdrop")) {
      el.classList.remove("modal-backdrop");
    }
    if (el.classList.contains("show")) {
      el.classList.remove("show");
    }
    if (body.classList.contains("modal-open")) {
      body.classList.remove("modal-open");
    }
    window.location.reload();
    // setLoginSuccess(true);
    // setTimeout(() => {
    //   setLoginSuccess(false);
    // }, 2000);
  };
  return (
    <div className="e-autho-model modal fade" id="login">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="modal-inner">
              <div className="row">
                <div className="col-md-12">
                  <div className="modal-inner-box">
                    <div className="autho-model-header text-center">
                      <img
                        src={require("../../assets/images/index1/big_logo.png")}
                        alt="logo"
                        style={{ height: "80px" }}
                        className="img-fluid"
                      />
                      <h2 className="autho-model-ttl mb-10 mt-10">
                        ثبت نام یا ورود
                      </h2>
                      <p className="autho-model-sttl">
                        {codesent
                          ? "کد تایید ارسال شده را وارد نمایید"
                          : "شماره تلفن همراه خود را وارد نمایید"}
                      </p>
                    </div>
                    <div className="autho-model-filed">
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

                          setFieldError,
                          setTouched,
                        }) => {
                          const sendCode = () => {
                            setCodesent(true);
                            axios
                              .get(
                                `${process.env.REACT_APP_BASE_URL}LoginRegister.aspx?phone=${values.phonenumber}`
                              )
                              .then((res) => {
                                setCodesent(true);
                              })
                              .catch((e) => {
                                alert(
                                  "ارسال کد تایید ناموفق بود لطفا دوباره تلاش کنید"
                                );
                                setCodesent(false);
                                console.log(e);
                              });
                          };
                          const verifyCode = () => {
                            localStorage.setItem(
                              "phone",
                              JSON.stringify(phone)
                            );
                            axios
                              .get(
                                `${process.env.REACT_APP_BASE_URL}VerifySMSCode.aspx?phone=${phone}&smscode=${values.code}`
                              )
                              .then((res) => {
                                if (res.data === "-1") {
                                  alert("بعلت مشکل فنی لطفا دوباره تلاش کنید");
                                } else {
                                  if (res.data === "0") {
                                    setFieldError(
                                      "code",
                                      "کد تایید وارد شده نادرست میباشد"
                                    );
                                  } else {
                                    onSubmit();
                                    setAuth(true);
                                    window.localStorage.setItem("auth", "true");
                                    setCodeverified(true);
                                  }
                                }
                              })
                              .catch((e) => {
                                console.log(e);
                              });
                          };
                          return (
                            <Form>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="e-form-field mt-20 mb-20">
                                    <label>
                                      {codesent
                                        ? "کد تایید"
                                        : "شماره موبایل همراه"}
                                    </label>
                                    {codesent ? (
                                      <>
                                        <input
                                          onChange={(e) =>
                                            setFieldValue(
                                              "code",
                                              e.target.value
                                            )
                                          }
                                          value={values.code}
                                          onBlur={() => setFieldTouched("code")}
                                          className="e-field-inner input-font"
                                          type="number"
                                          name="code"
                                        />
                                        <div
                                          role="button"
                                          style={{
                                            margin: "20px 0",
                                            fontSize: "14px",
                                          }}
                                          onClick={() => setCodesent(false)}
                                        >
                                          تغییر شماره تلفن همراه
                                        </div>
                                        {errors.code && touched.code && (
                                          <div className="text-danger mt-2">
                                            {errors.code}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          onChange={(e) => {
                                            setFieldValue(
                                              "phonenumber",
                                              e.target.value
                                            );
                                            setPhone(e.target.value);
                                          }}
                                          value={values.phonenumber}
                                          onBlur={() =>
                                            setFieldTouched("phonenumber")
                                          }
                                          className="e-field-inner input-font"
                                          type="number"
                                          name="phonenumber"
                                        />
                                        {errors.phonenumber &&
                                          touched.phonenumber && (
                                            <div className="text-danger mt-2">
                                              {errors.phonenumber}
                                            </div>
                                          )}
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div
                                    style={{ width: "100%" }}
                                    role="button"
                                    onClick={() => {
                                      if (codesent) {
                                        if (
                                          values.code &&
                                          !errors.code &&
                                          touched.code
                                        ) {
                                          verifyCode();
                                        } else {
                                          alert(
                                            "لطفا کد تایید ارسال شده را وارد کنید ."
                                          );
                                        }
                                      } else {
                                        if (
                                          values.phonenumber &&
                                          !errors.phonenumber &&
                                          touched.phonenumber
                                        ) {
                                          sendCode();
                                          setFieldValue("phonenumber", "");
                                          setFieldValue("code", "");
                                          setTouched([
                                            { phonenumber: false },
                                            { code: "false" },
                                          ]);
                                        } else {
                                          alert(errors.phonenumber);
                                        }
                                      }
                                    }}
                                    className="e-btn"
                                  >
                                    {codesent ? "ورود" : "ارسال کد تایید"}
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
            <button
              onClick={() => setCodesent(false)}
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
  );
}

export default withRouter(LoginModal);
