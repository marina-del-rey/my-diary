import { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import axios from 'axios';
import './EditProfile.scss';

Modal.setAppElement('#root');

const EditProfile = ({ isOpen, onRequestClose, onUpdateProfilePicture }) => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [profilePicture, setProfilePicture] = useState(null);
    const [newUsername, setNewUsername] = useState(user ? user.username : '');
    const [selectedFileName, setSelectedFileName] = useState("No file chosen");
    const [usernameError, setUsernameError] = useState(""); 
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (!isOpen) {
            setProfilePicture(null);
            setNewUsername(user.username);
            setSelectedFileName("No file chosen");
            setUsernameError(""); 
        }
    }, [isOpen, user.username]);

    const handleFileUpload = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            setProfilePicture(files[0]);
            setSelectedFileName(files[0].name);
        } else {
            setProfilePicture(null);
            setSelectedFileName("No file chosen");
        }
    };

    const handleChangeUsername = (e) => {
        setNewUsername(e.target.value);
        setUsernameError("");  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent multiple submissions if loading

        let updatedUser = {};
        let newUserNameChanged = false;
        setLoading(true);

        try {
            // check if username exists
            if (newUsername && newUsername !== user.username) {
                const usernameExists = await checkUsernameExists(newUsername);
                if (usernameExists) {
                    setUsernameError("Username already taken");
                    return;  
                }
            }

            if (profilePicture) {
                let newProfilePicUrl = user.profilePicture;
                const formData = new FormData();
                formData.append('profilePicture', profilePicture);
    
                const res = await updateProfilePicture(formData);
                newProfilePicUrl = res.data.profilePicture; 
                onUpdateProfilePicture(newProfilePicUrl); 

                toast.success("profile picture updated successfully!", {
                    position: "bottom-right",
                });
            }

            if (newUsername && newUsername !== user.username) {
                await updateUsername(newUsername);
                updatedUser.username = newUsername;
                newUserNameChanged = true;
                toast.success("username updated successfully!", {
                    position: "bottom-right",
                });
            }

            if (newUserNameChanged || profilePicture) {
                updateUser(updatedUser);
            }

            onRequestClose();

            if (newUserNameChanged) {
                navigate(`/user/${newUsername}`);
            }

        } catch (error) {
            console.error("error updating profile:", error);
            toast.error("error updating profile!", {
                position: "bottom-right",
            });
        } finally {
            setLoading(false); 
        }
    };

    const checkUsernameExists = async (username) => {
        try {
            const response = await axios.get(`${apiUrl}/users/check-username/${username}`);
            return response.data.exists;  
        } catch (error) {
            console.error("error checking username:", error);
            return false;  
        }
    };

    const updateUsername = async (newUsername) => {
        return axios.put(`${apiUrl}/users/${user.username}/username`, { newUsername });
    };

    const updateProfilePicture = async (formData) => {
        return axios.post(`${apiUrl}/users/${user.username}/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };


    const isButtonDisabled = !profilePicture && (newUsername === user.username) || loading; 
    
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Edit Profile Picture"
                overlayClassName="custom-modal-overlay" 
                className={`edit-profile-modal-content ${loading ? 'modal-loading' : ''}`} 
            >
                <div className="edit-profile-form">
                    <h3>Edit profile</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Change profile picture<span className="optional-label">(optional)</span></label>
                            <div className="file-upload-wrapper">
                                <label className="file-upload-button">
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="fa-icon"/>Upload file
                                    <input 
                                        type="file" 
                                        name="profilePicture" 
                                        onChange={handleFileUpload} 
                                        accept=".jpg,.jpeg,.png"
                                        className="file-upload-form"
                                    />
                                </label>
                                <span className="filename">{selectedFileName}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Change username<span className="optional-label">(optional)</span></label>
                            <input 
                                type="text" 
                                name="newUsername" 
                                value={newUsername}
                                onChange={handleChangeUsername}
                                className={usernameError ? 'error' : ''}
                            />
                            {usernameError && (
                                <p className="error-message"><FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{usernameError}</p>
                            )}
                        </div>
                        <div className="button-group">
                            <button className="cancel-button" type="button" onClick={onRequestClose}>
                                cancel
                            </button>
                            <button className="submit-button" type="submit" disabled={isButtonDisabled}>
                                {loading ? 'saving' : 'save'} 
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );

};

export default EditProfile;
