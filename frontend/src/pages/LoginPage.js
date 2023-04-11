import React, { useState } from "react";
import "../css/formStyle.css";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { PostData } from "../services/api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLogin } from "../redux/actions/auth_actions";

export default function LoginPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [submit, setSubmit] = useState(false);

  // Valida string
  const isEmpty = (str) => {
    return !str.trim().length;
  };

  // Handle Change
  const handleFormChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "email":
        form.email = value;
        setForm({ ...form });
        setEmailError(false);
        break;
      case "password":
        form.password = value;
        setForm({ ...form });
        setPasswordError(false);
        break;
      default:
        break;
    }
  };

  // Mostra e esconde senha
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  // Validação de E-mail
  const validateEmail = () => {
    const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      form.email
    );
    return emailValid;
  };

  // Validação de inputs
  const validateLogin = () => {
    let valid = true;

    // Checa email
    if (!validateEmail()) {
      valid = false;
      setEmailError(true);
    }

    // Checa senha
    if (isEmpty(form.password)) {
      valid = false;
      setPasswordError(true);
    }

    return valid;
  };

  // Login
  const login = async () => {
    if (validateLogin()) {
      setSubmit(true);
      const body = {
        email: form.email.toLowerCase(),
        password: form.password.trim(),
      };

      try {
        const res = await PostData("login", body);
        if (res.status === 200) {
          // Altera primeira letra para maiúscula
          const username =
            res.data.username.charAt(0).toUpperCase() +
            res.data.username.slice(1);
          // Dispatch Login
          dispatch(
            SetLogin({ username: username, accessToken: res.data.accessToken })
          );
          // Redireciona para Home page
          return history.push("/home");
        } else {
          alert(res.data.message);
          setSubmit(false);
        }
      } catch (e) {
        if (e === undefined) {
          alert("Ops algum erro ocorreu! tente novamente.");
          setSubmit(false);
        } else if (e.status === 404) {
          alert(e.data.message);
          setSubmit(false);
        } else {
          alert("Ops algum erro ocorreu! tente novamente.");
          setSubmit(false);
        }
      }
    }
  };

  // Quando pressiona enter
  const onKeyPress = (e) => {
    if (e.which === 13) login();
  };
  return (
    <div className="formContainer" onKeyPress={onKeyPress}>
      <h1>Entrar</h1>

      <div className="inputWrapper">
        <input
          type="email"
          name="email"
          className="fieldInput"
          value={form.email}
          placeholder={"E-mail"}
          onChange={handleFormChange}
        />
        {emailError ? <span className="errorSpan">Email inválido</span> : null}
      </div>
      <div className="inputWrapper">
        <div>
          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            className="fieldInput"
            value={form.password}
            placeholder={"Senha"}
            onChange={handleFormChange}
            maxLength={6}
          />
          {passwordShown ? (
            <AiOutlineEyeInvisible
              className="togglePassword"
              onClick={togglePassword}
            />
          ) : (
            <AiOutlineEye className="togglePassword" onClick={togglePassword} />
          )}
        </div>
        {passwordError ? (
          <span className="errorSpan">Senha inválida</span>
        ) : null}
      </div>
      <button disabled={submit} className="styledButton" onClick={login}>
        Entrar
      </button>
      <Link to="/registration" className="haveAccountP">
        Você não tem uma conta? Cadastrar
      </Link>
      <Link to="/recovery" className="haveAccountP">
        Esqueceu sua senha? Clique aqui
      </Link>
      {submit ? <div className="loader"></div> : null}
    </div>
  );
}
