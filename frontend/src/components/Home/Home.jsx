import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faPlus, faUser, faBook, faCompass } from '@fortawesome/free-solid-svg-icons'; 
import { formatDate } from '../../utils/formatDate'; 
import axios from "axios";
import Breadcrumb from "../Header/Breadcrumb";
import CreateDiary from "../Modals/CreateDiary";
import UserDiariesList from "../Diary/UserDiariesList";
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import "./Home.scss";

const Home = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 
    const { user } = useAuth();

    const [diaries, setDiaries] = useState([]);
    const [recentDiaries, setRecentDiaries] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);  
    const [displayMode, setDisplayMode] = useState('discover'); // for managing tabs

    useEffect(() => {
        if (user) {
            fetchUserDiaries(user.username);
        } else {
            setLoading(false); 
        }
        
        if (recentDiaries.length === 0) {
            fetchRecentDiaries(); 
        }
    }, [user]);

    const fetchUserDiaries = async (username) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/users/username/${username}/diaries`);
            setDiaries(res.data.diaries);
        } catch (error) {
            console.error("error fetching diaries:", error);
        } finally {
            setLoading(false);  
        }  
    };

    const fetchRecentDiaries = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/diaries/recent`);
            //console.log(res.data.diaries); // DEBUG
            setRecentDiaries(res.data.diaries);
        } catch (error) {
            console.error("error fetching recent diaries:", error);
        } finally {
            setLoading(false);  
        }  
    };

    // switch between "your diaries" and "discover new diaries"
    const handleDisplayModeChange = (mode) => {
        setDisplayMode(mode);
    };

    const handleAddNewDiary = (newDiary) => {
        setDiaries(prevDiaries => [newDiary, ...prevDiaries]);  
    };


    const handleCreateDiary = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

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
            toast.error('failed to delete diary.', { position: "bottom-right" });
        }
    };

    return (
        <div className="home-container">
            <div className="breadcrumb-container">
                <Breadcrumb />
            </div>
            <main className="main-content">
                <div className="content-area">
                    {loading ? (
                        <div className="loading-container">
                            <LoadingIndicator /> 
                        </div>
                    ) : (
                        <>
                            <div className="header-title-container">
                                <div className="tabs">
                                    {user && (
                                        <button 
                                            className={displayMode === 'user' ? 'active' : ''} 
                                            onClick={() => handleDisplayModeChange('user')}>
                                            <FontAwesomeIcon icon={faBook} className='fa-icon'/> your diaries
                                        </button>
                                    )}
                                    <button 
                                        className={displayMode === 'discover' ? 'active' : ''} 
                                        onClick={() => handleDisplayModeChange('discover')}>
                                        <FontAwesomeIcon icon={faCompass} className='fa-icon compass'/> discover
                                    </button>
                                </div>

                                {user && (
                                    <button onClick={handleCreateDiary} className="new-diary-button">
                                        <FontAwesomeIcon icon={faPlus} className="icon-plus" /> new diary
                                    </button>
                                )}
                            </div>
    
                            {displayMode === 'user' && user ? (
                                <UserDiariesList 
                                    diaries={diaries} 
                                    username={user.username} 
                                    onDelete={handleDeleteDiary} 
                                />
                            ) : (
                                <div className="discover-container">
                                    <ol>
                                        {recentDiaries.map((diary, index) => (
                                            <li key={index}>
                                                <div className="date-user-container">
                                                    <Link to={`/user/${diary.author.username}`} className="user-icon">
                                                        <FontAwesomeIcon icon={faUser} className='fa-icon'/> {diary.author.username}
                                                    </Link>
                                                    <p className="date">
                                                        {formatDate(diary.createdAt)}
                                                    </p>
                                                </div>
                                                <Link to={`/diary/${diary.diaryId}`} className="diary-title">{diary.title}</Link>
                                                <p className="description">{diary.description}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <CreateDiary
                isOpen={isModalOpen} 
                onRequestClose={handleCloseModal} 
                onDiaryCreated={handleAddNewDiary}
            />
        </div>
    );
    
}

export default Home;