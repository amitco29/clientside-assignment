import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TableRow.css';

const TableRow = ({ row, columns, onUpdateRow }) => {
    // --- הדפסה למעקב אחרי רינדורים (Performance Check) ---
    // יעזור לך לוודא שרק השורה שנערכת מרונדרת מחדש, ולא כל הטבלה!
    console.log(`[Render] TableRow: ${row.id}`);
    
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [tempEditValue, setTempEditValue] = useState('');
    
    // --- 1. סטייט חדש להודעת שגיאה מקומית ---
    const [errorMsg, setErrorMsg] = useState('');

    const handleDoubleClick = (columnId, currentValue) => {
        // מונע כניסה לעריכה אם אנחנו כרגע מציגים שגיאה
        if (errorMsg) return; 
        
        setEditingColumnId(columnId);
        setTempEditValue(currentValue);
    };

    const handleSave = (columnId) => {
        let finalValue = tempEditValue;
        const columnDef = columns.find(c => c.id === columnId);
        
        if (columnDef && columnDef.type === 'number') {
            finalValue = Number(tempEditValue);
        }

        // --- 2. ולידציה לשדה ריק ---
        if (typeof finalValue === 'string' && finalValue.trim() === '') {
            setErrorMsg('Field cannot be empty! ⚠️'); // מדליקים את השגיאה
            
            // מחכים 2 שניות, ואז מעלימים את השגיאה וחוזרים למצב הרגיל
            setTimeout(() => {
                setErrorMsg('');
                setEditingColumnId(null);
            }, 2000);
            
            return; // עוצרים את פונקציית השמירה כאן
        }

        if (finalValue !== row[columnId]) {
            onUpdateRow(row.id, columnId, finalValue);
        }
        setEditingColumnId(null);
    };

    const handleKeyDown = (e, columnId) => {
        if (e.key === 'Enter') handleSave(columnId);
    };

    return (
        <tr>
            {columns.map((column) => {
                const cellValue = row[column.id];
                const isEditing = editingColumnId === column.id;
                const isNonEditable = column.editable === false || column.type === 'boolean';
                
                // האם יש שגיאה ספציפית בעמודה הזו כרגע?
                const hasError = isEditing && errorMsg !== '';

                let displayContent;
                
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
                                disabled={hasError} // חוסם את השדה כשיש שגיאה
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
                                    disabled={hasError} // חוסם הקלדה בזמן השגיאה
                                />
                                {/* --- 3. הודעת הפופ-אפ האדומה --- */}
                                {hasError && <span className="cell-error-msg">{errorMsg}</span>}
                            </div>
                        );
                    }
                } 
                else {
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

export default React.memo(TableRow);