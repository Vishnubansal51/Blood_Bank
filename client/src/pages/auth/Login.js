import React from "react";
// import InputType from './../../components/shared/Form/InputType';
import Form from "./../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";


const Login = () => {
  const { loading } = useSelector((state) => state.auth);


  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          <div className="col-md-8 form-banner ">
            <img src="./assets/images/logg.jpg" alt="login img" />
          </div>
          <div className="col-md-4 form-container back">

            <Form
              formTitle={"Login Page"}
              submitBtn={"Login"}
              formType={"login"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
