import { useAuth } from '../Context/AuthProvider';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faHouseChimney, faUser, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import CreateDiary from '../Modals/CreateDiary';
import './UserDropdown.scss';

const UserDropdown = ({ username, profilePic }) => {
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewDiaryModalOpen, setIsNewDiaryModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleCreateNewDiary = () => {
    setIsDropdownOpen(false);
    setIsNewDiaryModalOpen(true);
  };

  const handleCloseDiaryModal = () => {
    setIsNewDiaryModalOpen(false);
  };

  const handleViewProfile = () => {
    navigate(`/user/${username}`);
  };

  const handleViewYourDiaries = () => {
    navigate(`/`);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <img src={profilePic} alt={`${username}'s profile`} className="profile-pic" />
        <span className="greeting">Hi, {username}</span>
        <FontAwesomeIcon 
          icon={faAngleDown} 
          className="dropdown-icon"
          style={{ transform: isDropdownOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}
        />
      </div>
      <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
          <div className="user-info">
            <button className='dropdown-button' onClick={handleViewYourDiaries}>
              <FontAwesomeIcon icon={faHouseChimney} className="fa-icon"/>home
            </button>
            <button className="dropdown-button" onClick={handleViewProfile}>
              <FontAwesomeIcon icon={faUser} className="fa-icon"/>profile
            </button>
            <button className="dropdown-button" onClick={handleCreateNewDiary}>
              <FontAwesomeIcon icon={faPlus} className="fa-icon"/>new diary
            </button>
            <div className='logout-button-container'>
              <button className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon"/>logout
              </button>
            </div>
          </div>
        </div>
      <CreateDiary isOpen={isNewDiaryModalOpen} onRequestClose={handleCloseDiaryModal} />
    </div>
  );
};

export default UserDropdown;
