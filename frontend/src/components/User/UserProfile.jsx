import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; 
import { toast } from 'react-toastify';
import axios from 'axios';
import Breadcrumb from '../Header/Breadcrumb';
import UserDiariesList from '../Diary/UserDiariesList';
import CreateDiary from '../Modals/CreateDiary';
import EditProfile from '../Modals/EditProfile';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './UserProfile.scss';

const UserProfile = () => {
    const { username } = useParams(); 
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [profileUser, setProfileUser] = useState(null); 
    const [diaries, setDiaries] = useState([]);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false); 
    const [isNewDiaryModalOpen, setIsNewDiaryModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/users/username/${username}`); 
                setProfileUser(res.data.user); 

                if (res.data.success) {
                    const res = await axios.get(`${apiUrl}/users/username/${username}/diaries`);
                    setDiaries(res.data.diaries);
                }

            } catch (error) {
                console.error('error fetching user data:', error); 
            } finally {
                setLoading(false);  
            }
        };

        fetchUser();
    }, [username]);


    const handleNewDiary = () => setIsNewDiaryModalOpen(true);
    const handleCloseDiaryModal = () => setIsNewDiaryModalOpen(false);

    const handleAddNewDiary = (newDiary) => {
        setDiaries(prevDiaries => [newDiary, ...prevDiaries]);  
    };

    const handleDeleteDiary = async (diaryId) => {
        try {
            const res = await axios.delete(`${apiUrl}/diaries/diary/${diaryId}`, { withCredentials: true });

            if (res.data.success) {
                setDiaries(prevDiaries => prevDiaries.filter(diary => diary.diaryId !== diaryId));
                toast.success('diary deleted successfully!', {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error('failed to delete diary:', error);
            toast.error('failed to delete diary. Please try again.', {
                position: "bottom-right",
            });
        }
    };

    const handleEditProfile = () => setIsEditProfileModalOpen(true);
    const handleCloseEditProfileModal = () => setIsEditProfileModalOpen(false);

    const updateProfilePicture = (newProfilePicture) => {
        // console.log(newProfilePicture); // DEBUG
        setProfileUser((prevProfileUser) => ({
            ...prevProfileUser,
            profilePicture: newProfilePicture,
        }));
        // console.log(profileUser.profilePicture); // DEBUG
    };

    return (
        <div className="user-profile-container">
            <div className="breadcrumb-container">
                <Breadcrumb />
            </div>
            <main className="main-content">
                <div className="content-area">
                    <div className="profile-detail">
                    {loading ? ( 
                            <div className="loading-container">
                                <LoadingIndicator />
                            </div>
                        ) : (profileUser && diaries ? (
                            <>
                                <div className="user-info-container">
                                    <div className="profile-header">
                                        <img 
                                            src={`${apiUrl}/${profileUser.profilePicture}`} 
                                            alt={`${profileUser.username}'s profile`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                            className="profile-picture"
                                        />
                                        <div className="profile-info">
                                            <h2 className="username">{profileUser.username}</h2>
                                            <p className="joined-date-text">
                                                joined&nbsp;{new Date(profileUser.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {user && user.username === profileUser.username && (
                                        <div className="buttons-container">
                                            <button onClick={handleEditProfile}>
                                                <FontAwesomeIcon icon={faPenToSquare} className="icon-edit"/>edit
                                            </button>
                                            <button onClick={handleNewDiary}>
                                                <FontAwesomeIcon icon={faPlus} className="icon-plus"/>new diary
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <UserDiariesList diaries={diaries} username={username} onDelete={handleDeleteDiary} />
                                {user && user.username === profileUser.username && (
                                <>
                                    <EditProfile 
                                        isOpen={isEditProfileModalOpen}
                                        onRequestClose={handleCloseEditProfileModal} 
                                        onUpdateProfilePicture={updateProfilePicture}
                                    />
                                    <CreateDiary 
                                        isOpen={isNewDiaryModalOpen} 
                                        onRequestClose={handleCloseDiaryModal} 
                                        onDiaryCreated={handleAddNewDiary}
                                    />
                                </>
                                )}
                            </>
                        ) : (
                            <div className="user-not-found-container">
                                <p>user not found.</p>
                            </div>
                        ))}
                    </div>
                </div>
           </main>
        </div>
    );

};

export default UserProfile;
