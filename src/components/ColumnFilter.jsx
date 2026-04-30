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
    // --- 1. ניהול מצב מקומי (Local State) ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSavedMsg, setShowSavedMsg] = useState(false);
    
    // שימוש ב-useRef כדי לשמור רפרנס לאלמנט התפריט ב-DOM. 
    // מאפשר לזהות האם לחיצת עכבר התבצעה בתוך התפריט או מחוץ לו.
    const dropdownRef = useRef(null);

    // --- 2. תבנית Click Outside (סגירת תפריט בלחיצה בחוץ) ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // התנאי בודק שני דברים: 
            // 1. הרפרנס קיים (התפריט מרונדר)
            // 2. אלמנט המטרה של הלחיצה לא נמצא בתוך עץ ה-DOM של התפריט
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        
        // האזנה לאירועי לחיצה ברמת המסמך (Document)
        document.addEventListener('mousedown', handleClickOutside);
        
        // פונקציית ניקוי (Cleanup): הסרת המאזין בעת פירוק (Unmount) של הקומפוננטה 
        // כדי למנוע דליפות זיכרון (Memory Leaks).
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- 3. ניהול טיימר להודעת השמירה (Success Message Timer) ---
    useEffect(() => {
        let timer;
        // מפעיל טיימר של 2.5 שניות רק כאשר הודעת השמירה מוצגת
        if (showSavedMsg) {
            timer = setTimeout(() => setShowSavedMsg(false), 2500);
        }
        
        // פונקציית ניקוי שמבטלת את הטיימר במקרה שהקומפוננטה נופלת לפני סיום הזמן
        return () => clearTimeout(timer); 
    }, [showSavedMsg]);

    // --- 4. לוגיקת כפתור השמירה ---
    const handleSaveClick = () => {
        onSave(); // הפעלת פונקציית השמירה החיצונית שמגיעה מה-App
        setShowSavedMsg(true); // הדלקת ההודעה המקומית
    };

    return (
        <div className="column-filter-container">
            {/* אזור התפריט הנפתח מקושר ל-dropdownRef */}
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

            {/* אזור כפתור הסינון המפוצל (Segmented Control) */}
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

            {/* אזור השמירה, כולל הודעת ההצלחה שצצה מתחתיו */}
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