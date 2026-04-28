import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow'; // ייבוא של השורה הממוטבת
import './GenericTable.css'; // ייבוא של קובץ העיצוב

const GenericTable = ({ columns, data, onUpdateRow }) => {
    // הגנת קצה: אם אין נתונים בכלל, נציג הודעה במקום טבלה ריקה
    if (!data || data.length === 0) {
        return <div className="no-data">אין נתונים להצגה בטבלה</div>;
    }

    return (
        <div className="table-container">
            <table className="generic-table">
                {/* צייר את כותרות העמודות */}
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th 
                                key={column.id} 
                                // את הרוחב אנחנו משאירים פה כי הוא מידע דינמי שמגיע מהאבא
                                style={{ width: column.width ? `${column.width}px` : 'auto' }}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* צייר את שורות הנתונים */}
                <tbody>
                    {data.map((row) => (
                        <TableRow 
                            key={row.id} 
                            row={row} 
                            columns={columns} 
                            onUpdateRow={onUpdateRow} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// הגדרת החוזים
GenericTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onUpdateRow: PropTypes.func.isRequired // הוספנו את פונקציית העדכון לחוזים
};

export default GenericTable;