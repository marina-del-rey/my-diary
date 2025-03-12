import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/formatDate'; 
import { truncateText } from '../../utils/truncateText';
import { toast } from 'react-toastify';
import axios from 'axios';
import Breadcrumb from '../Header/Breadcrumb';
import ConfirmDeleteEntry from '../Modals/ConfirmDeleteEntry';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './EntryDetail.scss';

const EntryDetail = () => {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    const { diaryId, entryId } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [entry, setEntry] = useState(null);
    const [author, setAuthor] = useState("");
    const [diaryTitle, setDiaryTitle] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [loading, setLoading] = useState(true);  
    const [deletingEntry, setDeletingEntry] = useState(false); 
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        const fetchEntry = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/diaries/diary/${diaryId}/entries/${entryId}`);
                const data = res.data.entry;
                //console.log(data); // DEBUG
                setEntry(data);

                // fetch author username
                const diaryRes = await axios.get(`${apiUrl}/diaries/diary/${diaryId}`);
                const diaryData = diaryRes.data.diary;
                //console.log(diaryData); // DEBUG
                setDiaryTitle(diaryData.title);

                const authorRes = await axios.get(`${apiUrl}/users/${diaryData.author}`);
                const username = authorRes.data.user.username;
                setAuthor(username);
            } catch (error) {
                console.error('error fetching entry\n', error);
            } finally {
                setLoading(false);  
            }  
        };
        fetchEntry();   
        
    }, [entryId, diaryId]);

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

    const handleDeleteEntry = async () => {
        setDeletingEntry(true);
        try {
            const res = await axios.delete(`${apiUrl}/diaries/diary/${diaryId}/entries/${entryId}`, { withCredentials: true });
            if (res.data.success) {
                navigate(`/diary/${diaryId}`);
                setTimeout(() => {
                    toast.success('entry deleted successfully!', {
                        position: "bottom-right",
                    });
                }, 100); 
            } else {
                console.error('error deleting entry:', res.data.message);
                toast.error('error deleting entry!', { position: "bottom-right" });
            }
        } catch (error) {
            console.error('error deleting entry:', error);
            toast.error('error deleting entry!', { position: "bottom-right" });
        } finally {
            setDeletingEntry(false);  
        }  
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true); 
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false); 
    };

    const handleConfirmDelete = () => {
        handleDeleteEntry(); 
        closeDeleteModal(); 
    };

    const showSidebar = user && user.username === author;

    return (
        <div className="entry-detail-container">
            <div className="breadcrumb-container">
                <Breadcrumb />
            </div>

            <main className="main-content">
                <div className={`content-area ${showSidebar ? "with-sidebar" : "full-width"}`}>
                    {isMobile && showSidebar && (
                        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
                            {isSidebarVisible ? 'close sidebar' : 'open sidebar'}
                        </button>
                    )}
                    <div className="entry-detail">
                        {loading ? (
                            <div className="loading-container">
                                <LoadingIndicator />
                            </div>
                        ) : entry ? (
                            <>
                                <div className="date-user-container">
                                    <Link to={`/diary/${entry.diary}`} className="book-icon">
                                        <FontAwesomeIcon icon={faBook} className="fa-icon"/>{truncateText(diaryTitle, 15)}
                                    </Link>
                                    <Link to={`/user/${author}`} className="user-icon">
                                        <FontAwesomeIcon icon={faUser} className='fa-icon'/>{author}
                                    </Link>
                                    <p className="date">{formatDate(entry.createdAt)}</p>
                                </div>
                                <div className='entry-title-container'>
                                    <h3 className='entry-title'>{entry.title}</h3>
                                </div>
                                <div className="entry-content">
                                {entry.content.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                                </div>
                            </>
                        ) : (
                            <div className="entry-not-found-container">
                                <p>entry not found.</p>  
                            </div>
                        )}
                    </div>
                </div>
                {showSidebar && (
                    <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
                        <ul>
                            <li>
                                <button onClick={openDeleteModal} disabled={deletingEntry}>
                                    <FontAwesomeIcon icon={faTrashCan} className="fa-icon"/>
                                    {deletingEntry ? "deleting" : "delete entry"}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <ConfirmDeleteEntry
                    isOpen={isDeleteModalOpen}
                    onRequestClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                    entryName={entry ? entry.title : ''} 
                />
            </main>
        </div>
    );

}

export default EntryDetail;
