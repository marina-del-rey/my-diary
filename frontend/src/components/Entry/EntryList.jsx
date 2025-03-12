import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate'; 
import axios from 'axios';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './EntryList.scss';

const EntryList = ({ diaryId, deleteMode, toggleDeleteMode, triggerDelete }) => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const [entries, setEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchEntries = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/diaries/diary/${diaryId}/entries`);                
                const data = res.data.entries;
                // console.log(data); // DEBUG
                setEntries(data);
            } catch (error) {
                console.error('error fetching entries:', error);
            } finally {
                setLoading(false);  
            }
        };

        fetchEntries();
    }, [diaryId]);


    const handleSelectEntry = (entryId) => {
        if (selectedEntries.includes(entryId)) {
            setSelectedEntries(selectedEntries.filter(id => id !== entryId));
        } else {
            setSelectedEntries([...selectedEntries, entryId]);
        }
    };

    const handleDeleteEntries = async () => {
        setLoading(true);
        try {
            for (const entryId of selectedEntries) {
                await axios.delete(`${apiUrl}/diaries/diary/${diaryId}/entries/${entryId}`, { withCredentials: true });
            }
            setEntries(entries.filter(entry => !selectedEntries.includes(entry.entryId)));
            setSelectedEntries([]);
            toggleDeleteMode();
            setTimeout(() => {
                toast.success('entries deleted successfully!', {
                    position: "bottom-right",
                });
            }, 100); 
        } catch (error) {
            console.error('error deleting entries:', error);
            toast.error('error deleting entries!', { position: "bottom-right" });
        } finally {
            setLoading(false);  
        }
    };

    useEffect(() => {
        if (triggerDelete) {
            handleDeleteEntries();
        }
    }, [triggerDelete]);

    return (
        <div className="entry-list">
            {loading ? (
                <div className="loading-container">
                    <LoadingIndicator />
                </div>
            ) : (
                entries ? (  
                    entries.length === 0 ? (
                        <p className="no-entries-message">
                            {"this diary has no entries yet..."}
                        </p>
                    ) : (
                        <ul>
                            {entries.map((entry) => (
                                <li key={entry._id}>
                                    {deleteMode && (
                                        <input 
                                            type="checkbox" 
                                            checked={selectedEntries.includes(entry.entryId)}
                                            onChange={() => handleSelectEntry(entry.entryId)}
                                            className="entry-checkbox"
                                        />
                                    )}
                                    <Link to={`/diary/${diaryId}/entries/${entry.entryId}`}>
                                        <div className="entry-title-container">
                                            <p className="entry-title">{entry.title}</p>
                                            <div className="entry-date-container">
                                                <p className="entry-date">{formatDate(entry.createdAt)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <p>error displaying entries.</p>  
                )
            )}
        </div>
    );
    

}

export default EntryList;