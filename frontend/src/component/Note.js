import React from "react";
import "../css/noteStyle.css";
import { IoMdTrash } from "react-icons/io";

export default function Note(props) {
  return (
    <div className="noteCardContainer">
      <div
        className="noteCardWrapper"
        onClick={() => props.showModalBox(props.item)}
      >
        <span>{props.item.text.replace(/\\n/g, "\n")}</span>
      </div>
      <div className="deleteButtonWrapper">
        <IoMdTrash
          onClick={() => props.deleteNote(props.item)}
          className="deleteButton"
          disabled={true}
        />
      </div>
    </div>
  );
}
