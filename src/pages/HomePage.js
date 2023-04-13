import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../css/homeStyle.css";

export default function HomePage() {
  return (
    <div className="home">
      <h1>Bem vindo!</h1>
      <Link to="/login" className="link">
        Faça o login para acessar suas notas!
      </Link>
      <p className="author">
        Copyright © 2023{" "}
        <a
          href="https://prince-neres.space"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          prince-neres.space.
        </a>
      </p>
    </div>
  );
}
