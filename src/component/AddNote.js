import React, { useState } from "react";
import "../css/formStyle.css";
import { PostData } from "../services/api";
import { v4 as uuidv4 } from "uuid";
import { addNote } from "../redux/actions/main_actions";
import { useDispatch } from "react-redux";
import { SetLogout } from "../redux/actions/auth_actions";
import { useHistory } from "react-router-dom";

export default function AddNote() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [noteText, setNoteText] = useState("");
  const [noteTextError, setNoteTextError] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
    setNoteTextError(false);
  };

  const AddNoteApiCall = async () => {
    if (noteText !== "") {
      setSubmit(true);
      const new_noteText = noteText.replace(/\r?\n/gm, "\\n");

      const body = { id: uuidv4(), text: new_noteText };

      try {
        const res = await PostData("add/note", body);
        if (res.status === 200) {
          setSubmit(false);
          dispatch(addNote(body));
          setNoteText("");
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
    } else {
      setNoteTextError(true);
    }
  };

  return (
    <div className="notesInputContainer">
      <div className="noteInputWrapper">
        <textarea
          className="noteInput"
          value={noteText}
          placeholder={"Adicionar nota"}
          onChange={handleNoteChange}
        />
        {noteTextError ? (
          <span className="errorSpan">Nota está vázia.</span>
        ) : null}
      </div>
      <button
        disabled={submit}
        className="styledButton"
        onClick={AddNoteApiCall}
      >
        {submit ? <div className="loader green"></div> : "Adicionar"}
      </button>
    </div>
  );
}
