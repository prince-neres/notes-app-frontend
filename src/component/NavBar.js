import { Link, useHistory } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetData } from "../services/api";
import { SetLogout } from "../redux/actions/auth_actions";
import "../css/NavbarStyle.css";
import { setNotes } from "../redux/actions/main_actions";

export default function NavBar() {
  const auth = useSelector((state) => state.auth_reducers);
  const dispatch = useDispatch();
  const history = useHistory();

  // Encerra sessão
  const logout = async () => {
    try {
      const res = await GetData("logout");
      if (res.status === 200) {
        dispatch(setNotes([]));
        dispatch(SetLogout());
        return history.push("/login");
      } else {
        alert(res.data);
      }
    } catch (e) {
      alert("Ops algum erro ocorreu! tente novamente.");
    }
  };

  if (auth.isLogged) {
    return (
      <ul className="navbarContainer">
        <li className="navbarWrapper">
          <span className="usernameWrapper">Olá {auth.username}</span>
        </li>
        <li className="navbarWrapper">
          <Link className="LinkToWrapper" to="/notes">
            Notas
          </Link>
        </li>
        <li className="navbarWrapper">
          <span className="LinkToWrapperLogout LinkToWrapper" onClick={logout}>
            Sair
          </span>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className="navbarContainer">
        <li className="navbarWrapper">
          <Link className="LinkToWrapper" to="/login">
            Entrar
          </Link>
        </li>
        <li className="navbarWrapper">
          <Link className="LinkToWrapper" to="/registration">
            Cadastrar
          </Link>
        </li>
      </ul>
    );
  }
}
