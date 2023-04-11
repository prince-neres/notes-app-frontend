import "../css/ModalBoxStyle.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function ModalBox(props) {
  return (
    <div className="modal">
      <div className="modal__window">
        <AiOutlineCloseCircle
          className="modal__close"
          onClick={props.closeModalBox}
        />
        <p className="modal_text">{props.modal.text.replace(/\\n/g, "\n")}</p>
      </div>
    </div>
  );
}
