import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { genreOptions } from '../data/mockData';
import './TableRow.css';

const TableRow = ({ row, columns, onUpdateRow }) => {
    console.log(`Rendering row: ${row.id}`);

    const [editingColumnId, setEditingColumnId] = useState(null);
    const [tempEditValue, setTempEditValue] = useState('');

    const formatDuration = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleDoubleClick = (columnId, currentValue) => {
        setEditingColumnId(columnId);
        setTempEditValue(currentValue);
    };

    const handleSave = (columnId) => {
        let finalValue = tempEditValue;
        const columnDef = columns.find(c => c.id === columnId);
        
        if (columnDef && columnDef.type === 'number') {
            finalValue = Number(tempEditValue);
        }

        if (finalValue !== row[columnId]) {
            onUpdateRow(row.id, columnId, finalValue);
        }
        setEditingColumnId(null);
    };

    const handleKeyDown = (e, columnId) => {
        if (e.key === 'Enter') {
            handleSave(columnId);
        }
    };

    return (
        <tr>
            {columns.map((column) => {
                const cellValue = row[column.id];
                const isEditing = editingColumnId === column.id;
                
                const isNonEditable = column.type === 'boolean' || column.id === 'duration';

                let displayContent;
                
                if (column.type === 'boolean') {
                    displayContent = (
                        <span 
                            className="favorite-star"
                            onClick={() => onUpdateRow(row.id, column.id, !cellValue)}
                        >
                            {cellValue ? '⭐' : '☆'}
                        </span>
                    );
                } 
                else if (column.id === 'duration') {
                    displayContent = formatDuration(cellValue);
                }
                else if (isEditing) {
                    if (column.id === 'genre') {
                        // --- השינוי שלנו כאן: שמירה וסגירה מיידית ---
                        displayContent = (
                            <select 
                                autoFocus
                                value={tempEditValue}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    // 1. בודקים אם יש שינוי, ואם כן שומרים ישירות
                                    if (selectedValue !== row[column.id]) {
                                        onUpdateRow(row.id, column.id, selectedValue);
                                    }
                                    // 2. סוגרים את מצב העריכה באותו רגע!
                                    setEditingColumnId(null);
                                }}
                                // גיבוי: למקרה שהמשתמש פתח את הרשימה אבל לחץ בחוץ בלי לבחור כלום
                                onBlur={() => setEditingColumnId(null)}
                                className="edit-input"
                            >
                                {genreOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        );
                    } else {
                        displayContent = (
                            <input 
                                type={column.type === 'number' ? 'number' : 'text'}
                                autoFocus
                                value={tempEditValue}
                                onChange={(e) => setTempEditValue(e.target.value)}
                                onBlur={() => handleSave(column.id)}
                                onKeyDown={(e) => handleKeyDown(e, column.id)}
                                className="edit-input"
                            />
                        );
                    }
                } 
                else {
                    displayContent = cellValue;
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