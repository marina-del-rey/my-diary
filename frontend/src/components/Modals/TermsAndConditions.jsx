import Modal from 'react-modal';
import './TermsAndConditions.scss';

Modal.setAppElement('#root');

const TermsAndConditions = ({ isOpen, onClose }) => {
    return (
        <div>
            <Modal 
                isOpen={isOpen} 
                onRequestClose={onClose}
                contentLabel="Terms and Conditions"
                overlayClassName="custom-modal-overlay"
                className="terms-conditions-modal-content"
            >
            <div className="terms-conditions-content">
                <h3>Terms and conditions</h3>
                <p>
                    By signing up to MyDiary, you agree to the following terms and conditions:
                </p>
                <ol>
                    <li>Don&apos;t post anything illegal, harmful, or offensive.</li>
                    <li>Don&apos;t use the site to harass or impersonate others.</li>
                    <li>Don&apos;t share content that isn&apos;t yours without permission.</li>
                    <li>We might remove content or close accounts if needed.</li>
                </ol>
                <div className="button-group">
                    <button className="close-button" onClick={onClose}>close</button>
                </div>
            </div>
            </Modal>
        </div>
    );
};


export default TermsAndConditions;