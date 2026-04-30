import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import './GenericTable.css';

const GenericTable = ({ columns, data, onUpdateRow, emptyMessage }) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const ROWS_PER_PAGE = 50; 

    const totalPages = Math.ceil((data?.length || 0) / ROWS_PER_PAGE) || 1;

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const sortedColumns = useMemo(() => {
        return [...columns].sort((a, b) => a.ordinalNo - b.ordinalNo);
    }, [columns]);

    const paginatedData = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage]);

    if (!data || data.length === 0) {
        return <div className="no-data">{emptyMessage || "No data to show"}</div>;
    }

    return (
        <div className="table-wrapper">
            
            {/* --- אזור הפגינציה החדש: ממוקם מעל הטבלה ובצד ימין --- */}
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
                            title="Previous Page" /* זה מה שמייצר את חלונית ההסבר בריחוף! */
                        >
                            &#10094; {/* קוד HTML לחץ שמאלה אלגנטי */}
                        </button>
                        
                        <div className="page-divider"></div> {/* קו ההפרדה */}
                        
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="page-nav-btn"
                            title="Next Page" /* זה מה שמייצר את חלונית ההסבר בריחוף! */
                        >
                            &#10095; {/* קוד HTML לחץ ימינה אלגנטי */}
                        </button>
                    </div>
                </div>
            )}

            {/* --- הטבלה עצמה --- */}
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