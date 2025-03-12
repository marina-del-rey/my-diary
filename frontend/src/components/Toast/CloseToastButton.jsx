import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import "./ToastStyles.scss";

const CloseToastButton = ({ closeToast }) => (
    <button onClick={closeToast} className="custom-close-button">
        <FontAwesomeIcon icon={faXmark} className="fa-icon" />
    </button>
);
  
export default CloseToastButton;