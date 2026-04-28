import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { genreOptions } from '../data/mockData'; // ייבוא האפשרויות לרשימה הנפתחת

const TableRow = ({ row, columns, onUpdateRow }) => {
    // בכל פעם ששורה מתרנדרת, נדפיס ללוג כדי שנוכל לראות בעיניים
    console.log(`Rendering row: ${row.id}`);

    // State לניהול מצב העריכה - זוכר איזה תא נערך כרגע ומה הערך הזמני שלו
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [tempEditValue, setTempEditValue] = useState('');

    // פתיחת מצב עריכה בדאבל-קליק
    const handleDoubleClick = (columnId, currentValue) => {
        setEditingColumnId(columnId);
        setTempEditValue(currentValue);
    };

    // שמירת הנתונים ויציאה ממצב עריכה
    const handleSave = (columnId) => {
        let finalValue = tempEditValue;
        
        // מוצאים את העמודה הנוכחית כדי לבדוק את ה-type שלה
        const columnDef = columns.find(c => c.id === columnId);
        
        // אם זו עמודת מספר, נמיר את המחרוזת חזרה למספר אמיתי!
        if (columnDef && columnDef.type === 'number') {
            finalValue = Number(tempEditValue);
        }

        // עכשיו ההשוואה תעבוד מושלם
        if (finalValue !== row[columnId]) {
            onUpdateRow(row.id, columnId, finalValue);
        }
        setEditingColumnId(null);
    };

    // שמירה בעת לחיצה על Enter
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
                let displayContent;
                
                // טיפול תצוגה מיוחד לשדה הבוליאני (הכוכב)
                if (column.type === 'boolean') {
                    displayContent = (
                        <span 
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
                            onClick={() => onUpdateRow(row.id, column.id, !cellValue)}
                        >
                            {cellValue ? '⭐' : '☆'}
                        </span>
                    );
                } 
                // אם התא כרגע במצב עריכה
                else if (isEditing) {
                    if (column.id === 'genre') {
                        // רשימה נפתחת עבור ז'אנר
                        displayContent = (
                            <select 
                                autoFocus
                                value={tempEditValue}
                                onChange={(e) => setTempEditValue(e.target.value)}
                                onBlur={() => handleSave(column.id)}
                                className="edit-input"
                            >
                                {genreOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        );
                    } else {
                        // שדה קלט טקסטואלי או מספרי עבור שאר השדות
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
                // תצוגה רגילה עבור טקסט/מספר שאינם בעריכה
                else {
                    displayContent = cellValue;
                }

                return (
                    <td 
                        key={`${row.id}-${column.id}`}
                        onDoubleClick={column.type !== 'boolean' ? () => handleDoubleClick(column.id, cellValue) : undefined}
                        className={column.type !== 'boolean' ? "editable-cell" : ""}
                        title={column.type !== 'boolean' ? "Double click to edit" : ""}
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

// אנחנו מייצאים את הקומפוננטה עטופה ב-memo
// עכשיו השורה הזו תתרנדר מחדש *אך ורק* אם הנתונים של השיר הספציפי הזה השתנו
export default React.memo(TableRow);