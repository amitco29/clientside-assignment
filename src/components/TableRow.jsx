import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TableRow.css';

const TableRow = ({ row, columns, onUpdateRow }) => {
    // הדפסה למעקב אחרי רינדורים (Performance Check). 
    // מוכיח ששימוש ב-React.memo מונע רינדור מחדש של כל הטבלה בעת עריכת שורה בודדת.
    console.log(`[Render] TableRow: ${row.id}`);
    
    // --- 1. ניהול מצב מקומי (Local State) ---
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [tempEditValue, setTempEditValue] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // --- 2. טיפול באירועים (Event Handlers) ---
    const handleDoubleClick = (columnId, currentValue) => {
        // חסימת כניסה למצב עריכה אם מוצגת כרגע הודעת שגיאה
        if (errorMsg) return; 
        
        setEditingColumnId(columnId);
        setTempEditValue(currentValue);
    };

    const handleSave = (columnId) => {
        let finalValue = tempEditValue;
        const columnDef = columns.find(c => c.id === columnId);
        
        // המרת טיפוס נתונים למספר אם הוגדר כך בסכמה
        if (columnDef && columnDef.type === 'number') {
            finalValue = Number(tempEditValue);
        }

        // מנגנון ולידציה: מניעת שמירת שדה טקסט ריק
        if (typeof finalValue === 'string' && finalValue.trim() === '') {
            setErrorMsg('Field cannot be empty! ⚠️'); 
            
            // הסרת הודעת השגיאה ויציאה ממצב עריכה לאחר 2 שניות
            setTimeout(() => {
                setErrorMsg('');
                setEditingColumnId(null);
            }, 2000);
            
            return; // עצירת תהליך השמירה
        }

        // הפעלת פונקציית העדכון של קומפוננטת האב רק אם הערך אכן השתנה
        if (finalValue !== row[columnId]) {
            onUpdateRow(row.id, columnId, finalValue);
        }
        setEditingColumnId(null);
    };

    const handleKeyDown = (e, columnId) => {
        if (e.key === 'Enter') handleSave(columnId);
    };

    // --- 3. רינדור (Render) ---
    return (
        <tr>
            {columns.map((column) => {
                const cellValue = row[column.id];
                const isEditing = editingColumnId === column.id;
                const isNonEditable = column.editable === false || column.type === 'boolean';
                
                // בדיקה האם קיימת שגיאה ספציפית בעמודה הנוכחית
                const hasError = isEditing && errorMsg !== '';

                let displayContent;
                
                // רינדור מותנה לפי סוג העמודה ומצב העריכה
                if (column.type === 'boolean') {
                    displayContent = (
                        <span className="favorite-star" onClick={() => onUpdateRow(row.id, column.id, !cellValue)}>
                            {cellValue ? '⭐' : '☆'}
                        </span>
                    );
                } 
                else if (isEditing) {
                    if (column.type === 'selection') {
                        displayContent = (
                            <select 
                                autoFocus
                                value={tempEditValue}
                                onChange={(e) => {
                                    onUpdateRow(row.id, column.id, e.target.value);
                                    setEditingColumnId(null);
                                }}
                                onBlur={() => setEditingColumnId(null)}
                                className="edit-input"
                                disabled={hasError} // חסימת השדה בעת הצגת שגיאה
                                name={column.id} 
                            >
                                {column.options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        );
                    } else {
                        displayContent = (
                            <div className="input-wrapper">
                                <input 
                                    type={column.type === 'number' ? 'number' : 'text'}
                                    autoFocus
                                    value={tempEditValue}
                                    onChange={(e) => setTempEditValue(e.target.value)}
                                    onBlur={() => handleSave(column.id)}
                                    onKeyDown={(e) => handleKeyDown(e, column.id)}
                                    className={`edit-input ${hasError ? 'error-border' : ''}`}
                                    disabled={hasError} // חסימת הקלדה בעת שגיאה
                                    name={column.id} // מניעת הערות נגישות בקונסול
                                />
                                {hasError && <span className="cell-error-msg">{errorMsg}</span>}
                            </div>
                        );
                    }
                } 
                else {
                    // הפעלת פונקציית עיצוב (Format) אם קיימת בסכמה, אחרת הצגת הערך הגולמי
                    displayContent = column.format ? column.format(cellValue) : cellValue;
                }

                return (
                    <td 
                        key={`${row.id}-${column.id}`}
                        onDoubleClick={!isNonEditable ? () => handleDoubleClick(column.id, cellValue) : undefined}
                        className={!isNonEditable ? "editable-cell" : ""}
                        title={!isNonEditable ? "Double click to edit" : ""}
                    >
                        {displayContent}
                    </td>
                );
            })}
        </tr>
    );
};

TableRow.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    onUpdateRow: PropTypes.func.isRequired
};

// שימוש ב-React.memo לאופטימיזציית רינדורים: השורה תרונדר מחדש רק אם ה-Props שלה ישתנו
export default React.memo(TableRow);