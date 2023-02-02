import React from "react";
import { NavLink } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
const initialValues = {
  email: "",
  password: "",
};
const validationSchema = yup.object({
  name: yup.string().typeError("نام وارد نشده .").required("نام وارد نشده ."),
  email: yup
    .string()
    .typeError("ایمیل وارد نشده .")
    .email("ایمیل وارد شده صحیح نمیباشد .")
    .required("ایمیل وارد نشده ."),
  password: yup
    .string()
    .typeError("رمز عبور وارد نشده .")
    .required("رمز عبور وارد نشده ."),
});

function RegisterModal() {
  const onSubmit = (e) => {
    console.log(e);
  };
  return (
    <div className="e-autho-model modal fade" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="modal-inner">
              <div className="row">
                <div className="col-md-12">
                  <div className="modal-inner-box">
                    <div className="autho-model-header text-center">
                      <NavLink to="/">
                        <img
                          src={require("../../assets/images/index1/big_logo.png")}
                          alt="logo"
                          className="img-fluid"
                        />
                      </NavLink>
                      <p className="autho-model-sttl">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت
                        چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون
                        بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.
                      </p>
                      <h2 className="autho-model-ttl">ثبت نام </h2>
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
                          submitForm,
                        }) => {
                          return (
                            <Form>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="e-form-field mb-20">
                                    <label>نام </label>
                                    <input
                                      onChange={(e) =>
                                        setFieldValue("name", e.target.value)
                                      }
                                      value={values.name}
                                      onBlur={() => setFieldTouched("name")}
                                      className="e-field-inner"
                                      type="text"
                                    />
                                    {errors.name && touched.name && (
                                      <div className="text-danger mt-2">
                                        {errors.name}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="e-form-field mb-20">
                                    <label>ایمیل </label>
                                    <input
                                      onChange={(e) =>
                                        setFieldValue("email", e.target.value)
                                      }
                                      value={values.email}
                                      onBlur={() => setFieldTouched("email")}
                                      className="e-field-inner"
                                      type="email"
                                    />
                                    {errors.email && touched.email && (
                                      <div className="text-danger mt-2">
                                        {errors.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="e-form-field mb-20">
                                    <label>رمز عبور </label>
                                    <input
                                      onChange={(e) =>
                                        setFieldValue(
                                          "password",
                                          e.target.value
                                        )
                                      }
                                      value={values.password}
                                      onBlur={() => setFieldTouched("password")}
                                      className="e-field-inner"
                                      type="Password"
                                    />
                                    {errors.password && touched.password && (
                                      <div className="text-danger mt-2">
                                        {errors.password}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div
                                    role="button"
                                    onClick={() => submitForm()}
                                    className="e-btn"
                                  >
                                    ثبت نام
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
            <button type="button" className="autho-close" data-dismiss="modal">
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
