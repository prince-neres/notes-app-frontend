import "../css/formStyle.css";
import React, { useState } from "react";
import { PostData } from "../services/api";
import { Link } from "react-router-dom";

export default function PasswordRecovery() {
  const [form, setForm] = useState({ email: "", schoolName: "" });

  const [emailError, setEmailError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [password, setPassword] = useState("");

  // Validação de strings
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
      case "schoolName":
        form.schoolName = value;
        setForm({ ...form });
        setSchoolNameError(false);
        break;
      default:
        break;
    }
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

    // Checa E-mail
    if (!validateEmail()) {
      valid = false;
      setEmailError(true);
    }

    // Checa senha
    if (isEmpty(form.schoolName)) {
      valid = false;
      setSchoolNameError(true);
    }

    return valid;
  };

  // Login
  const passwordRecoveryAPI = async () => {
    if (validateLogin()) {
      setSubmit(true);
      const body = {
        email: form.email.toLowerCase(),
        schoolName: form.schoolName.trim(),
      };

      try {
        const res = await PostData("recovery", body);
        if (res.status === 200) {
          setPassword(res.data.password);
          setSubmit(false);
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

  // Ao pressionar enter
  const onKeyPress = (e) => {
    if (e.which === 13) passwordRecoveryAPI();
  };

  return (
    <div onKeyPress={onKeyPress}>
      {password ? (
        <h1 style={{ textAlign: "center" }}>
          Sua senha:
          <br />
          {password}
        </h1>
      ) : (
        <div className="formContainer">
          <h1>Recuperação de Senha</h1>
          <div className="inputWrapper">
            <input
              type="email"
              name="email"
              className="fieldInput"
              value={form.email}
              placeholder={"E-mail"}
              onChange={handleFormChange}
            />
            {emailError ? (
              <span className="errorSpan">Email inválido</span>
            ) : null}
          </div>
          <div className="inputWrapper">
            <input
              type="text"
              name="schoolName"
              className="fieldInput"
              value={form.schoolName}
              placeholder={"Nome da sua escola quando criança"}
              maxLength={20}
              onChange={handleFormChange}
            />
            {schoolNameError ? (
              <span className="errorSpan">Nome de escola inválido</span>
            ) : null}
          </div>
          <button
            disabled={submit}
            className="styledButton"
            onClick={passwordRecoveryAPI}
          >
            Enviar
          </button>
          <Link to="/login" className="haveAccountP">
            Você não tem uma conta? Cadastrar
          </Link>
          {submit ? <div className="loader"></div> : null}
        </div>
      )}
    </div>
  );
}
