import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthProvider";
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';
import './CreateDiary.scss';

Modal.setAppElement('#root');

const CreateDiary = ({ isOpen, onRequestClose, onDiaryCreated }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setDescription('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent multiple submissions if loading

        setLoading(true);

        try {
            const userRes = await axios.get(`${apiUrl}/users/username/${user.username}`);
            // console.log(userRes.data.user._id); // DEBUG
            const userId = userRes.data.user._id;
            
            const res = await axios.post(`${apiUrl}/diaries/create`, {
                author: userId,
                title: title,
                description: description,
            },
            { withCredentials: true }
            );

            // console.log(res); // DEBUG
            if (res.data.success) {
                const newDiary = res.data.savedDiary; 
                if (onDiaryCreated) {
                    onDiaryCreated(newDiary);
                }
                onRequestClose();
                setTimeout(() => {
                    toast.success('diary created successfully!', {
                        position: "bottom-right",
                    });
                }, 100);  
            }
        } catch (error) {
            console.error('error creating diary\n', error);
            toast.error('error creating diary!', { position: "bottom-right" });
        } finally {
            setLoading(false); 
        }
    };

    const isButtonDisabled = !title || loading;

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Create diary modal"    
                overlayClassName="custom-modal-overlay" 
                className={`create-diary-modal-content ${loading ? 'modal-loading' : ''}`}  
            >
                <div className="create-diary-form">
                    <h3>Create new diary</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title<span className="required-asterisk">*</span></label>
                            <input 
                                type="text"     
                                value={title} 
                                placeholder="Diary title"
                                onChange={(e) => setTitle(e.target.value)} 
                                maxLength={100} // title character limit 
                                required 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description<span className="optional-label">(optional)</span></label>
                            <textarea 
                                value={description} 
                                placeholder="Diary description"
                                onChange={(e) => setDescription(e.target.value)} 
                                maxLength={200} // description character limit
                                disabled={loading}
                            />
                        </div>
                        <div className="button-group">
                            <button className="cancel-button" type="button" onClick={onRequestClose}>
                                cancel
                            </button>
                            <button className="submit-button" type="submit" disabled={isButtonDisabled}>
                                {loading ? 'creating' : 'create'} 
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CreateDiary;