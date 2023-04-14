import React, { useState } from "react";
import "../css/noteStyle.css";
import { IoMdTrash } from "react-icons/io";

export default function Note({ showModalBox, item, deleteNote, submit }) {
  const [thisSubmit, setThisSubmit] = useState(submit);

  const callDeleteNote = (item) => {
    setThisSubmit(true);
    deleteNote(item);
  };

  return (
    <div className="noteCardContainer">
      <div className="noteCardWrapper" onClick={() => showModalBox(item)}>
        <span>{item.text.replace(/\\n/g, "\n")}</span>
      </div>
      <div className="deleteButtonWrapper">
        {thisSubmit ? (
          <div className="loader red"></div>
        ) : (
          <IoMdTrash
            onClick={() => callDeleteNote(item)}
            className="deleteButton"
          />
        )}
      </div>
    </div>
  );
}
