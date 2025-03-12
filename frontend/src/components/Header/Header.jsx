import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UserDropdown from './UserDropdown';
import HamburgerMenu from './HamburgerMenu'; 
import SearchBar from '../Search/SearchBar';
import './Header.scss';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (user && user.username) {
                try {
                    const response = await axios.get(`${apiUrl}/users/${user.username}/profile-picture`, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfilePic(imageUrl);
                } catch (error) {
                    console.error('error fetching profile picture:', error);
                }
            }
        };

        fetchProfilePic();
    }, [user]);

    const handleNavigation = (path) => {
        navigate(path);
    }

    return (
      <div className="header">
        <div className="header-content">
            <Link to="/" className="header-title-link">
                <h2 className="header-title">MyDiary</h2>
            </Link>
            <div className="nav-items">
                <SearchBar />
                {!user ? (
                    <>
                        <button className="nav-button log-in" onClick={() => handleNavigation('/login')}>
                            Log in
                        </button>
                        <button className="nav-button sign-up" onClick={() => handleNavigation('/signup')}>
                            Sign up
                        </button>
                    </>
                ) : (
                    <UserDropdown username={user.username} profilePic={profilePic} />
                )}
            </div>
            <HamburgerMenu user={user} handleNavigation={handleNavigation} profilePic={profilePic} />
        </div>
      </div>
    );
  };
  
  export default Header;