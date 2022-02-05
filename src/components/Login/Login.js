import React, { useState, useEffect, useReducer, useContext } from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT")
    return { value: action.val, isValid: action.val.includes("@") };
  if (action.type === "INPUT_BLUR")
    return { value: state.value, isValid: state.value.includes("@") };
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT")
    return { value: action.val, isValid: action.val.trim().length > 6 };
  if (action.type === "USER_BLUR")
    return { value: state.value, isValid: state.value.trim().length > 6 };

  return { value: "", isValid: false };
};

const Login = (props) => {
  const initState = {
    value: "",
    isValid: null,
  };

  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, initState);
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    initState
  );

  const authCtx = useContext(AuthContext);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    // This will run as a clean up function before useEffect is triggered again:
    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const changeHandler = (event) => {
    let func = event.target.id === "email" ? dispatchEmail : dispatchPassword;

    func({
      type: "USER_INPUT",
      val: event.target.value,
    });
  };

  const validateHandler = (event) => {
    let func = event.target.id === "email" ? dispatchEmail : dispatchPassword;

    func({
      type: "INPUT_BLUR",
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          type="email"
          id="email"
          label="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={changeHandler}
          onBlur={validateHandler}
        />
        <Input
          type="password"
          id="password"
          label="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={changeHandler}
          onBlur={validateHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
