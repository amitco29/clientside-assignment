import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ColumnFilter.css';

const ColumnFilter = ({ 
    columns, 
    visibleColumnIds, 
    onToggleColumn, 
    hasUnsavedChanges, 
    onSave,
    showFavoritesOnly,
    onToggleFavorites
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSavedMsg, setShowSavedMsg] = useState(false);
    const dropdownRef = useRef(null);

    // טיפול בסגירת התפריט כשלחצים בחוץ (Click Outside)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // טיימר להודעת השמירה הירוקה שמופיעה רק בלחיצה על כפתור השמירה
    useEffect(() => {
        let timer;
        if (showSavedMsg) {
            timer = setTimeout(() => setShowSavedMsg(false), 2500);
        }
        return () => clearTimeout(timer); 
    }, [showSavedMsg]);

    const handleSaveClick = () => {
        onSave(); 
        setShowSavedMsg(true); 
    };

    return (
        <div className="column-filter-container">
            <div className="dropdown-container" ref={dropdownRef}>
                <button 
                    className="control-btn columns-btn"
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                >
                    ⚙️ Columns
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <span className="dropdown-title">Select columns:</span>
                        {columns.map((col) => (
                            <label key={col.id} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    checked={visibleColumnIds.includes(col.id)}
                                    onChange={() => onToggleColumn(col.id)}
                                />
                                {col.title}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="segmented-control">
                <button 
                    className={`segment-btn ${!showFavoritesOnly ? 'active' : ''}`}
                    onClick={() => onToggleFavorites(false)}
                >
                    All Songs
                </button>
                <button 
                    className={`segment-btn ${showFavoritesOnly ? 'active' : ''}`}
                    onClick={() => onToggleFavorites(true)}
                >
                    ⭐ Favorites
                </button>
            </div>

            <div className="save-action-area">
                <button 
                    className="save-btn" 
                    disabled={!hasUnsavedChanges}
                    onClick={handleSaveClick} 
                >
                    Save Changes
                </button>
                {showSavedMsg && <span className="save-success-msg">Changes Saved ✔️</span>}
            </div>
        </div>
    );
};

ColumnFilter.propTypes = {
    columns: PropTypes.array.isRequired,
    visibleColumnIds: PropTypes.array.isRequired,
    onToggleColumn: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    showFavoritesOnly: PropTypes.bool.isRequired,
    onToggleFavorites: PropTypes.func.isRequired
};

export default ColumnFilter;