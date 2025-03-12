import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './SearchBar.scss';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('diaries');
  const [showSearchBar, setShowSearchBar] = useState(false); 

  const dropdownRef = useRef(null); 
  const searchBarRef = useRef(null);
  const navigate = useNavigate();  

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  const clearSearch = (e) => {
    e.stopPropagation();
    setSearchQuery(''); 
  };

  const performSearch = async () => {
    if (searchQuery.trim()) {
      try {
        navigate(`/search?query=${searchQuery}&category=${selectedCategory}`);
      } catch (error) {
        console.error('error searching:', error);
      }
    }
  };

  const toggleSearchBar = (e) => {
    e.stopPropagation();
    setShowSearchBar(prevState => !prevState);
  };

  const handleSearchButtonClick = (e) => {
    if (showSearchBar && searchQuery.trim()) {
      performSearch(e);
    } else {
      toggleSearchBar(e);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(prevState => !prevState);
  };

  const handleCategorySelect = (category, e) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    } else if (!dropdownOpen && searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch(e);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen, showSearchBar]);

  return (
    <>
      <div className={`search-bar ${showSearchBar ? 'show' : ''}`} ref={searchBarRef}>
        <div className="dropdown" ref={dropdownRef}>
          <div className="dropdown-text" onClick={toggleDropdown}>
            <span>{selectedCategory}</span>
            <FontAwesomeIcon 
              icon={faAngleDown} 
              className="angle-down-icon"
              style={{ transform: dropdownOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}
            />
          </div>
          {dropdownOpen && (
            <ul className={`dropdown-list ${dropdownOpen ? 'show' : ''}`}>
              <li className="dropdown-list-item" onClick={(e) => handleCategorySelect('diaries', e)}>diaries</li>
              <li className="dropdown-list-item" onClick={(e) => handleCategorySelect('users', e)}>users</li>
            </ul>
          )}
        </div>
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`search for ${selectedCategory}...`}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-button" onClick={clearSearch}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </div>
      <button className="search-button" onClick={(e) => handleSearchButtonClick(e)}>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </button>
    </>
  );
};

export default SearchBar;
