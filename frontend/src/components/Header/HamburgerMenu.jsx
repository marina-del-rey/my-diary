import { useAuth } from '../Context/AuthProvider';
import { useState, useRef, useEffect } from 'react';
import SearchBar from '../Search/SearchBar';
import UserDropdown from './UserDropdown';
import CreateDiary from '../Modals/CreateDiary';
import './HamburgerMenu.scss'; 

const HamburgerMenu = ({ user, handleNavigation, profilePic }) => {
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isNewDiaryModalOpen, setIsNewDiaryModalOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        handleNavigation("/login");
        setMenuOpen(false);
    };

    const handleLogin = () => {
        handleNavigation('/login');
        setMenuOpen(false);
    };

    const handleSignup = () => {
        handleNavigation('/signup');
        setMenuOpen(false);
    };

    const handleCreateNewDiary = () => {
        setIsNewDiaryModalOpen(true);
        setMenuOpen(false); 
    };

    const handleViewYourDiaries = () => {
        handleNavigation(`/`);
    };

    const handleCloseDiaryModal = () => {
        setIsNewDiaryModalOpen(false);
    };

    const handleViewProfile = () => {
        handleNavigation(`/user/${user.username}`);
    };

    useEffect(() => {
        if (menuOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="hamburger-container" ref={menuRef}>
            <div className="hamburger-icon" onClick={toggleMenu}>
                &#9776; 
            </div>
            {menuOpen && (
                <div className="hamburger-menu">
                    {!user ? (
                        <>
                            <button className="nav-button log-in" onClick={handleLogin}>
                                log in
                            </button>
                            <button className="nav-button sign-up" onClick={handleSignup}>
                                sign up
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav-button profile-pic-container" onClick={handleViewProfile}>
                                <img src={profilePic} alt={`${user.username}'s profile`} className="profile-pic" />
                                {user.username}
                            </button>
                            <button className='nav-button home' onClick={handleViewYourDiaries}>
                                home
                            </button>
                            <button className="nav-button dropdown-button" onClick={handleCreateNewDiary}>
                                new diary
                            </button>
                            <div className='logout-button-container'>
                                <button className="nav-button logout-button" onClick={handleLogout}>
                                    logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
            <CreateDiary isOpen={isNewDiaryModalOpen} onRequestClose={handleCloseDiaryModal} />
        </div>
    );
};

export default HamburgerMenu;
