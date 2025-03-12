import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/formatDate'; 
import DiaryDeleteDropdown from './DiaryDeleteDropdown'; 
import './UserDiariesList.scss';

const UserDiariesList = ({ diaries, username, onDelete }) => {
    const { user } = useAuth(); 

    const isCurrentUser = user && user.username === username; 

    return (
        <div className="user-diaries-list">
            {diaries.length === 0 ? ( 
                <p className="no-diaries-message">
                    {isCurrentUser ? 'looks like you haven’t created any diaries yet...' : `${username} has no diaries yet...`}
                </p>
            ) : (
            <ol>
                {diaries.map((diary) => (
                    <li key={diary._id}>
                        <div className="date-user-container">
                            <Link to={`/user/${username}`} className="user-icon">
                                <FontAwesomeIcon icon={faUser} className='fa-icon'/> {username}
                            </Link>
                            <p className="date">
                                {formatDate(diary.createdAt)}
                            </p>
                            {user && user.username === username && (
                                <DiaryDeleteDropdown diaryId={diary.diaryId} onDelete={() => onDelete(diary.diaryId)} /> 
                            )}
                        </div>
                        <Link to={`/diary/${diary.diaryId}`} className="diary-title">{diary.title}</Link>
                        <p className="description">{diary.description}</p>
                    </li>
                ))}
            </ol>
            )}
        </div>
    );

}

export default UserDiariesList;