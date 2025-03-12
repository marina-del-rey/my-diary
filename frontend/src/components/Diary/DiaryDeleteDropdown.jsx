import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 
import ConfirmDeleteDiary from '../Modals/ConfirmDeleteDiary';
import './DiaryDeleteDropdown.scss';

const DiaryDeleteDropdown = ({ diaryId, onDelete }) => {
  const apiUrl = import.meta.env.VITE_API_URL; 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [diaryName, setDiaryName] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const dropdownRef = useRef(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/diaries/diary/${diaryId}`);
      const name = res.data.diary.title;
      setDiaryName(name);
      setIsModalOpen(true);
      //setIsDropdownOpen(false);
    } catch (error) {
      console.error('error deleting diary:', error);
    } finally {
      setLoading(false); 
    }
    setIsDropdownOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(diaryId); 
    setIsModalOpen(false); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
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
    <div className="diary-delete-dropdown" ref={dropdownRef}>
      <button className="dropdown-trigger" onClick={toggleDropdown}>
      <FontAwesomeIcon 
        icon={faAngleDown} 
        className="dropdown-icon"
        style={{ transform: isDropdownOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}
      />
      </button>
        <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
          <button className="dropdown-button" onClick={handleDelete} disabled={loading}>
            <FontAwesomeIcon icon={faTrash} className="fa-icon"/>delete
          </button>        
        </div>
        <ConfirmDeleteDiary 
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          diaryName={diaryName} 
      />
    </div>
  );
};
  
export default DiaryDeleteDropdown;