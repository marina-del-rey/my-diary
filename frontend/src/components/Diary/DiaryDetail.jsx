import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Route, Routes } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrashCan, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/formatDate'; 
import axios from 'axios';
import ConfirmDeleteDiary from '../Modals/ConfirmDeleteDiary';
import EntryList from '../Entry/EntryList';
import AddEntry from '../Modals/AddEntry';
import Breadcrumb from '../Header/Breadcrumb';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './DiaryDetail.scss';

const DiaryDetail = () => {
    const { user } = useAuth(); 
    const { diaryId } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [diary, setDiary] = useState(null);
    const [author, setAuthor] = useState("");
    const [deleteEntriesMode, setDeleteEntriesMode] = useState(false);
    const [triggerDelete, setTriggerDelete] = useState(false);  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [loading, setLoading] = useState(false);  
    const [deletingDiary, setDeletingDiary] = useState(false);
    const [deletingEntries, setDeletingEntries] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const diaryRes = await axios.get(`${apiUrl}/diaries/diary/${diaryId}`);
                const diaryData = diaryRes.data.diary;
                setDiary(diaryData);

                const authorRes = await axios.get(`${apiUrl}/users/${diaryData.author}`);
                const username = authorRes.data.user.username;
                setAuthor(username);

            } catch (error) {
                console.error('error fetching diary\n', error);
            } finally {
                setLoading(false);  
            }  
        };

        fetchData();
    }, [diaryId]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleAddEntry = () => {
        navigate(`/diary/${diaryId}/compose/entry`);
    };

    const handleDeleteDiary = async () => {
        setDeletingDiary(true);
        try {
            const res = await axios.delete(`${apiUrl}/diaries/diary/${diaryId}`, { withCredentials: true });
            if (res.data.success) {
                navigate('/');
                setTimeout(() => {
                    toast.success('diary deleted successfully!', {
                        position: "bottom-right",
                    });
                }, 100);
            } else {
                console.error('error deleting diary:', res.data.message);
                toast.error('error deleting diary!', { position: "bottom-right" });
            }
        } catch (error) {
            console.error('error deleting diary:', error);
            toast.error('error deleting diary!', { position: "bottom-right" });
        } finally {
            setDeletingDiary(false);
        }
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);  
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false); 
    };

    const handleConfirmDeleteDiary = () => {
        handleDeleteDiary();  
        closeDeleteModal();  
    };

    const handleConfirmDeleteEntry = () => {
        setDeletingEntries(true);
        setTriggerDelete(true); 
        setTimeout(() => {
            setTriggerDelete(false);
            setDeletingEntries(false); 
        }, 500); 
    };
    
    const toggleDeleteEntriesMode = () => {
        setDeleteEntriesMode(!deleteEntriesMode);
        setIsSidebarVisible(!isSidebarVisible);
    };

    const showSidebar = user && user.username === author;
    
    return (
        <div className="diary-detail-container">
            <div className={`breadcrumb-container ${showSidebar ? "with-sidebar" : "full-width"}`}>
                <Breadcrumb />
            </div>            
            <main className="main-content">
                <div className={`content-area ${showSidebar ? "with-sidebar" : "full-width"}`}>
                    {isMobile && showSidebar && (
                        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
                            {isSidebarVisible ? 'close sidebar' : 'open sidebar'}
                        </button>
                    )}
                    <div className="diary-detail">
                        {loading ? (
                            <div className="loading-container">
                                <LoadingIndicator />
                            </div>
                        ) : diary ? (
                            <>
                                <div className="date-user-container">
                                    <Link to={`/user/${author}`} className="user-icon">
                                        <FontAwesomeIcon icon={faUser} className='fa-icon'/>{author}
                                    </Link>
                                    <p className="date">{formatDate(diary.createdAt)}</p>
                                </div>
                                <div className='diary-title-container'>
                                    <h3 className='diary-title'>{diary.title}</h3>
                                </div>
                                <p className='description'>{diary.description}</p>
                                <p className='entry-list-text'>entries</p>   
                                <EntryList 
                                    diaryId={diary.diaryId} 
                                    deleteMode={deleteEntriesMode} 
                                    toggleDeleteMode={toggleDeleteEntriesMode}
                                    triggerDelete={triggerDelete} 
                                />
                            </>
                            ) : (
                                <div className="diary-not-found-container">
                                    <p>diary not found.</p> 
                                </div>
                            )}
                            <Routes>
                                <Route
                                    path="/compose/entry"
                                    element={
                                        <AddEntry
                                            diaryId={diaryId}
                                            isOpen={true}
                                            onRequestClose={() => navigate(`/diary/${diaryId}`)} 
                                        />
                                    }
                                />
                            </Routes>
                    </div>
                </div>
                {showSidebar && (
                    <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
                        <ul>
                            {deleteEntriesMode ? (
                                <>
                                    <li>
                                        <button onClick={handleConfirmDeleteEntry} disabled={deletingEntries}>
                                            <FontAwesomeIcon icon={faCheck} className="fa-icon"/>
                                            {deletingEntries ? "deleting" : "confirm"}
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={toggleDeleteEntriesMode}>
                                            <FontAwesomeIcon icon={faTrashCan} className="fa-icon"/>cancel
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button onClick={handleAddEntry} className="add-entry-button">
                                            <FontAwesomeIcon icon={faPlus} className="fa-icon"/>add entry
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={toggleDeleteEntriesMode} className="delete-entries-button">
                                            <FontAwesomeIcon icon={faTrashCan} className="fa-icon"/>delete entries
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={openDeleteModal} disabled={deletingDiary} className="delete-diary-button">
                                            <FontAwesomeIcon icon={faTrashCan} className="fa-icon"/>
                                            {deletingDiary ? "deleting" : "delete diary"}
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>   
                    </div>
                )}

                {/* overlay for mobile view */}
                <div className={`overlay ${isSidebarVisible ? "visible" : ""}`} onClick={toggleSidebar}></div>

                <ConfirmDeleteDiary 
                    isOpen={isDeleteModalOpen}
                    onRequestClose={closeDeleteModal}
                    onConfirm={handleConfirmDeleteDiary}
                    diaryName={diary ? diary.title : ''}  
                />
            </main>
        </div>
    );
}

export default DiaryDetail;
