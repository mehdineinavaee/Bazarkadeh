import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
const initialValues = {
  email: "",
};
const validationSchema = yup.object({
  email: yup
    .string()
    .typeError("ایمیل وارد نشده .")
    .email("ایمیل وارد شده صحیح نمیباشد .")
    .required("ایمیل وارد نشده ."),
});

function ForgotPassword() {
  const onSubmit = (e) => {
    console.log(e);
  };
  return (
    <Layout title="/">
      {/* <!-- Breadcumbs start --> */}
      <div className="e-breadcumb-wrap text-center">
        <h2 className="e-breadcumb-title">فراموشی رمز عبور</h2>
        <ul className="e-breadcumb-kist">
          <li>
            <NavLink to="/">خانه</NavLink>
          </li>
          <li>
            <NavLink to="/forgotpassword">فراموشی رمز عبور</NavLink>
          </li>
        </ul>
      </div>
      {/* <!-- Product Category start --> */}
      <div className="e-forgotpassword-wrap e-forgotpassword-cloth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="e-fp-box">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    values,
                    errors,
                    setFieldValue,
                    setFieldTouched,
                    submitForm,
                    touched,
                  }) => {
                    return (
                      <Form>
                        <div className="row">
                          <div className="col-md-12">
                            <p className="mb-20">
                              رمز عبور خود را فراموش کرده اید؟ لطفا نام کاربری
                              یا آدرس ایمیل خود را وارد نمایید. پیوندی برای
                              ایجاد گذرواژه جدید از طریق ایمیل دریافت خواهید
                              کرد.
                            </p>
                          </div>
                          <div className="col-md-12">
                            <div className="e-form-field mb-20">
                              <label>ایمیل یا نام کاربری </label>
                              <input
                                onBlur={() => setFieldTouched("email")}
                                value={values.email}
                                onChange={(e) =>
                                  setFieldValue("email", e.target.value)
                                }
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
                          {/* <div className="col-md-12">
                              <div className="e-form-field mb-20">
                                <label>رمز عبور </label>
                                <input className="e-field-inner" type="Password" />
                              </div>
                            </div> */}
                          <div className="col-md-12">
                            <div
                              onClick={() => submitForm()}
                              role="button"
                              className="e-btn"
                            >
                              بازیابی رمز عبور
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
    </Layout>
  );
}

export default ForgotPassword;
