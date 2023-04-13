import React, { useEffect } from "react";
import NotesTable from "../component/NotesTable";
import AddNote from "../component/AddNote";
import { GetData } from "../services/api";
import { useDispatch } from "react-redux";
import { setNotes } from "../redux/actions/main_actions";
import { SetLogout } from "../redux/actions/auth_actions";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pega Notas
  const getNotes = () => {
    GetData("get/notes")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setNotes(res.data.notes));
        } else {
          alert("Ops algum erro ocorreu! tente novamente.");
        }
      })
      .catch((e) => {
        if (e === undefined) {
          alert("Ops algum erro ocorreu! tente novamente.");
        } else if (e.status === 401) {
          alert("Você provavelmente saiu, faça o login novamente!");
          // Encerra
          dispatch(SetLogout());
          // Redireciona para página de login
          return history.push("/login");
        } else {
          alert("Ops algum erro ocorreu! tente novamente.");
        }
      });
  };

  return (
    <div>
      <AddNote />
      <NotesTable />
    </div>
  );
}
