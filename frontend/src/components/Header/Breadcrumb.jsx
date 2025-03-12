import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons'; 
import { truncateText } from '../../utils/truncateText'; 
import axios from 'axios';
import './Breadcrumb.scss'; 

const Breadcrumb = () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const [names, setNames] = useState({});
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchNames = async () => {
            setLoading(true);
            try {
                let updatedNames = {};
                for (let i = 0; i < pathnames.length; i++) {
                    if (pathnames[i] === 'diary' && pathnames[i + 1]) {
                        const diaryId = pathnames[i + 1];
                        if (!updatedNames[diaryId]) {
                            const diaryRes = await axios.get(`${apiUrl}/diaries/diary/${diaryId}`);
                            updatedNames[diaryId] = diaryRes.data.diary.title;
                        }
                    } else if (pathnames[i] === 'entries' && pathnames[i + 1]) {
                        const entryId = pathnames[i + 1];
                        if (!updatedNames[entryId]) {
                            const entryRes = await axios.get(`${apiUrl}/diaries/diary/${pathnames[i - 1]}/entries/${entryId}`);
                            updatedNames[entryId] = entryRes.data.entry.title;
                        }
                    }
                }
                setNames((prevNames) => ({ ...prevNames, ...updatedNames }));
            } catch (error) {
                console.error('error getting paths\n', error); 
            } finally {
                setLoading(false);  
            }  
        };

        fetchNames();
    }, [location.pathname]);

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link to="/" className="home-link">
                        <span className="home-group">
                            <FontAwesomeIcon icon={faHouseChimney} className="icon-home" /> home
                        </span>
                    </Link>
                </li>
                {loading ? (
                    // Display loading indicator while data is being fetched
                    <li>
                    </li>
                ) : (
                    pathnames.map((value, index) => {
                        if (value === 'home') return null; 
                        
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        const name = truncateText(names[value] || value.replace(/-/g, ' '), 15); 
        
                        if (value === 'diary' || value === 'user') {
                            return (
                                <li key={to}>
                                    <span>{value}</span>
                                </li>
                            );
                        }
                        
                        return (
                            <li key={to}>
                                {!isLast ? (
                                    <Link to={to}>{name}</Link>
                                ) : (
                                    <span>{name}</span>
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </nav>
    );
}    

export default Breadcrumb;
