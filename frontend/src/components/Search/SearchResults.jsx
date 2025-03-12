import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/formatDate'; 
import axios from 'axios';
import Breadcrumb from '../Header/Breadcrumb';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import './SearchResults.scss';

const SearchResults = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);  
    const apiUrl = import.meta.env.VITE_API_URL; 

    const query = new URLSearchParams(location.search).get('query');
    const category = new URLSearchParams(location.search).get('category') || 'diaries';

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${apiUrl}/search/${category}?query=${query}`);
                    setResults(res.data.results);
                    // console.log(res); // DEBUG
                } catch (error) {
                    console.error('error fetching search results:', error);
                } finally {
                    setLoading(false);  
                } 
            };
            fetchResults();
        }
    }, [query, category]);

    return (
        <div className="search-results-container">
            <div className="breadcrumb-container">
                <Breadcrumb />
            </div>
            <main className="main-content">
                <div className="content-area">
                    <h3>search results</h3>
                    {loading ? (  
                        <div className="loading-container">
                            <LoadingIndicator />
                        </div>
                    ) : (
                        results.length > 0 ? (
                            <>
                                <p>{results.length} results found for <b>{query}</b> in <b>{category}</b>:</p>
                                {category === 'users' ? (
                                    <div className="user-result-container">
                                        <ul>
                                            {results.map((result, index) => (
                                                <li key={index}>
                                                    <Link to ={`/user/${result.username}`}>
                                                        <div className="profile-header">
                                                            <img 
                                                                src={`http://localhost:4000/${result.profilePicture}`} 
                                                                alt={`${result.username}'s profile`}
                                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                                                className="profile-picture"
                                                            />
                                                            <div className="profile-info">
                                                                <h2 className="username">{result.username}</h2>
                                                                <p className="joined-date-text">
                                                                    joined&nbsp;{new Date(result.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="diary-result-container">
                                        <ol>
                                            {results.map((result, index) => (
                                                <li key={index}>
                                                    <div className="date-user-container">
                                                        <Link to={`/user/${result.author.username}`} className="user-icon">
                                                            <FontAwesomeIcon icon={faUser} className='fa-icon'/> {result.author.username}
                                                        </Link>
                                                        <p className="date">
                                                            {formatDate(result.createdAt)}
                                                        </p>
                                                    </div>
                                                    <Link to={`/diary/${result.diaryId}`} className="diary-title">{result.title}</Link>
                                                    <p className="description">{result.description}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>no results found.</p>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};    

export default SearchResults;