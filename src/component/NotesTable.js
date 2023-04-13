import React, { useState } from "react";
import Note from "./Note";
import "../css/tableStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { setNotes } from "../redux/actions/main_actions";
import { PostData } from "../services/api";
import { SetLogout } from "../redux/actions/auth_actions";
import { useHistory } from "react-router-dom";
import ModalBox from "./ModalBox";

export default function NotesTable() {
  const history = useHistory();
  const main = useSelector((state) => state.main_reducers);
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({});

  const closeModalBox = () => {
    setShowModal(false);
    setModal({});
  };

  const showModalBox = (item) => {
    setShowModal(true);
    setModal(item);
  };

  // Deleta nota
  const DeleteNoteApiCall = async (body) => {
    try {
      const res = await PostData("delete/note", body);
      if (res.status === 200) {
        setSubmit(false);
        let NoteList = main.noteList.filter((note) => body.id !== note.id);
        dispatch(setNotes(NoteList));
      } else if (res.status === 401) {
        alert("Você provavelmente saiu, faça o login novamente!");
        dispatch(SetLogout());
      } else {
        alert(res.data);
      }
      setSubmit(false);
    } catch (e) {
      if (e === undefined) {
        alert("Ops algum erro ocorreu! tente novamente.");
        setSubmit(false);
      } else if (e.status === 401) {
        alert("Você provavelmente saiu, faça o login novamente!");
        dispatch(SetLogout());
        return history.push("/login");
      } else {
        alert("Ops algum erro ocorreu! tente novamente.");
        setSubmit(false);
      }
    }
  };
  return (
    <div className="notes">
      {showModal ? (
        <ModalBox closeModalBox={closeModalBox} modal={modal} />
      ) : null}
      {main.noteList.map((item) => (
        <Note
          key={item.id}
          item={item}
          submit={submit}
          showModalBox={showModalBox}
          deleteNote={DeleteNoteApiCall}
        />
      ))}
    </div>
  );
}
