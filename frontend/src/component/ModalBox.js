import "../css/ModalBoxStyle.css";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalBox(props) {
  return (
    <div className="modal">
      <div className="modal__window">
        <span>
          <AiOutlineClose
            className="modal__close"
            onClick={props.closeModalBox}
          />
        </span>
        <p className="modal_text">{props.modal.text.replace(/\\n/g, "\n")}</p>
      </div>
    </div>
  );
}
