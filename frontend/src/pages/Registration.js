import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import "../css/formStyle.css";
import { useHistory } from "react-router-dom";
import { PostData } from "../services/api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLogin } from "../redux/actions/auth_actions";

export default function Registration() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    schoolName: "",
  });
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);

  // Validação de strings
  const isEmpty = (str) => {
    return !str.trim().length;
  };

  // Handle Change
  const handleFormChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "username":
        form.username = value;
        setForm({ ...form });
        setUsernameError(false);
        break;
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
      case "schoolName":
        form.schoolName = value;
        setForm({ ...form });
        setSchoolNameError(false);
        break;
      default:
        break;
    }
  };

  // Mostra e esconde senha
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  //validação de E-mail
  const validateEmail = () => {
    const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      form.email
    );
    return emailValid;
  };

  // Validação de inputs
  const validateLogin = () => {
    let valid = true;

    // Checa nome de usuário
    if (isEmpty(form.username)) {
      valid = false;
      setUsernameError(true);
    }

    // Checa E-mail
    if (!validateEmail()) {
      valid = false;
      setEmailError(true);
    }

    // Checa senha
    if (isEmpty(form.password)) {
      valid = false;
      setPasswordError(true);
    }

    if (isEmpty(form.schoolName)) {
      valid = false;
      setSchoolNameError(true);
    }

    return valid;
  };

  // Cadastro
  const Registration = async () => {
    if (validateLogin()) {
      setSubmit(true);
      const body = {
        username: form.username.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password.trim(),
        schoolName: form.schoolName.trim(),
      };

      try {
        const res = await PostData("registration", body);
        if (res.status === 201) {
          dispatch(
            SetLogin({
              username: form.username.trim(),
              accessToken: res.data.accessToken,
            })
          );
          return history.push("/home");
        } else {
          alert(res.data);
        }
        setSubmit(false);
      } catch (e) {
        if (e === undefined) {
          alert("Ops algum erro ocorreu! tente novamente.");
          setSubmit(false);
        } else if (e.status === 400) {
          alert(e.data.message);
          setSubmit(false);
        } else {
          alert("Ops algum erro ocorreu! tente novamente.");
          setSubmit(false);
        }
      }
    }
  };

  // Ao pressionar enter
  const onKeyPress = (e) => {
    if (e.which === 13) Registration();
  };

  return (
    <div className="formContainer" onKeyPress={onKeyPress}>
      <h1>Cadastrar</h1>
      <div className="inputWrapper">
        <input
          type="text"
          name="username"
          className="fieldInput"
          value={form.username}
          placeholder={"Nome de usuário"}
          onChange={handleFormChange}
        />
        {usernameError ? (
          <span className="errorSpan">Nome de usuário inválido</span>
        ) : null}
      </div>
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
      <div className="inputWrapper">
        <input
          type="text"
          className="fieldInput"
          name="schoolName"
          value={form.schoolName}
          placeholder={"Nome da sua escola quando criança"}
          maxLength={20}
          onChange={handleFormChange}
        />
        {schoolNameError ? (
          <span className="errorSpan">Nome de escola inválido</span>
        ) : null}
      </div>

      <button disabled={submit} className="styledButton" onClick={Registration}>
        Cadastrar
      </button>
      <Link to="/login" className="haveAccountP">
        Você não tem uma conta? Cadastrar
      </Link>

      {submit ? <div className="loader"></div> : null}
    </div>
  );
}
