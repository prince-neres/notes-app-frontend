import "../css/ModalBoxStyle.css";
import { FaRegWindowClose, FaPencilAlt, FaSave } from "react-icons/fa";
import { useState } from "react";
import { PostData } from "../services/api";
import { SetLogout } from "../redux/actions/auth_actions";
import { useDispatch } from "react-redux";

export default function ModalBox({
  closeModalBox,
  modal,
  editMode,
  setEditMode,
  setSubmit,
  setNotes,
  main,
  history,
}) {
  const dispatch = useDispatch();
  const [noteText, setNoteText] = useState(modal.text.replace(/\\n/g, "\n"));
  const [saveSubmit, setSaveSubmit] = useState(false);

  const handleChangeNote = (event) => {
    const newText = event.target.value;
    setNoteText(newText);
  };

  // Salva alterações da nota
  const SaveNoteApiCall = async () => {
    setSaveSubmit(true);
    modal.text = noteText;

    try {
      const res = await PostData("save/note", modal);
      if (res.status === 200) {
        setSaveSubmit(false);
        let notes = main.noteList;
        let noteIndex = main.noteList.findIndex((note) => note.id === modal.id);
        notes[noteIndex] = modal;
        dispatch(setNotes(notes));
        closeModalBox();
      } else if (res.status === 401) {
        alert("Você provavelmente saiu, faça o login novamente!");
        dispatch(SetLogout());
      } else {
        alert(res.data);
      }
      setSaveSubmit(false);
    } catch (e) {
      if (e === undefined) {
        alert("Ops algum erro ocorreu! tente novamente.");
        setSaveSubmit(false);
      } else if (e.status === 401) {
        alert("Você provavelmente saiu, faça o login novamente!");
        dispatch(SetLogout());
        return history.push("/login");
      } else {
        alert("Ops algum erro ocorreu! tente novamente.");
        setSaveSubmit(false);
      }
    }
  };

  return (
    <div className="modal">
      {editMode ? (
        <div className="modal_change_note">
          <div className="modal_edit_actions">
            {saveSubmit ? (
              <div className="loader green"></div>
            ) : (
              <FaSave
                className="modal_save"
                onClick={SaveNoteApiCall}
                aria-label="salvar"
              />
            )}
            <FaRegWindowClose className="modal_close" onClick={closeModalBox} />
          </div>
          <textarea
            className="modal_textarea"
            value={noteText}
            onChange={handleChangeNote}
          />
        </div>
      ) : (
        <div className="modal_window">
          <span className="modal_icons">
            <FaPencilAlt
              className="modal_edit"
              onClick={() => setEditMode(true)}
            />
            <FaRegWindowClose className="modal_close" onClick={closeModalBox} />
          </span>
          <p className="modal_text">{noteText}</p>
        </div>
      )}
    </div>
  );
}
