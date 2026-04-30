import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import './GenericTable.css';

const GenericTable = ({ columns, data, onUpdateRow, emptyMessage }) => {
    
    // --- 1. ניהול דפדוף (Pagination State) ---
    const [currentPage, setCurrentPage] = useState(1);
    const ROWS_PER_PAGE = 50; // הגדרת כמות השורות המקסימלית לעמוד אחד

    // חישוב סך כל העמודים על בסיס כמות הנתונים שהתקבלו
    const totalPages = Math.ceil((data?.length || 0) / ROWS_PER_PAGE) || 1;

    // "מנגנון הגנה": אם המשתמש נמצא בעמוד 3 והנתונים סוננו כך שנשאר רק עמוד אחד, 
    // ה-useEffect יקפיץ את המשתמש חזרה לעמוד האחרון הרלוונטי כדי שלא יראה מסך ריק.
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // --- 2. לוגיקת סדר עמודות (Sorting Columns) ---
    // שימוש ב-useMemo כדי למיין את העמודות לפי ה-ordinalNo שהוגדר בסכמה.
    // הפעולה קורית רק אם מערך העמודות השתנה, מה שחוסך משאבי עיבוד ברינדורים חוזרים.
    const sortedColumns = useMemo(() => {
        return [...columns].sort((a, b) => a.ordinalNo - b.ordinalNo);
    }, [columns]);

    // --- 3. חיתוך הנתונים לתצוגה (Data Slicing) ---
    // לוגיקה קריטית לביצועים: במקום לרנדר את כל 1000 השורות ב-DOM, 
    // אנחנו מחשבים ומציגים רק את ה"פרוסה" (Slice) הרלוונטית לעמוד הנוכחי.
    const paginatedData = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage]);

    // טיפול במצב שבו אין נתונים להצגה (Empty State)
    if (!data || data.length === 0) {
        return <div className="no-data">{emptyMessage || "No data to show"}</div>;
    }

    return (
        <div className="table-wrapper">
            
            {/* סרגל ניווט עליון - יוצג רק אם יש יותר מעמוד אחד של נתונים */}
            {totalPages > 1 && (
                <div className="table-top-bar">
                    <span className="page-info-text">
                        Page <strong>{currentPage}</strong> of {totalPages}
                    </span>
                    
                    <div className="pagination-pill">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="page-nav-btn"
                            title="Previous Page"
                        >
                            &#10094; 
                        </button>
                        
                        <div className="page-divider"></div>
                        
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="page-nav-btn"
                            title="Next Page"
                        >
                            &#10095; 
                        </button>
                    </div>
                </div>
            )}

            {/* רינדור מבנה הטבלה הסטנדרטי */}
            <div className="table-container">
                <table className="generic-table">
                    <thead>
                        <tr>
                            {sortedColumns.map((column) => (
                                <th 
                                    key={column.id} 
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* מעבר על הנתונים החתוכים (Paginated) ורינדור שורות */}
                        {paginatedData.map((row) => (
                            <TableRow 
                                key={row.id} 
                                row={row} 
                                columns={sortedColumns} 
                                onUpdateRow={onUpdateRow} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

GenericTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onUpdateRow: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string 
};

export default GenericTable;