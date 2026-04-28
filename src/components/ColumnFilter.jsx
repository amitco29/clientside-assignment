import React from 'react';
import PropTypes from 'prop-types';
import './ColumnFilter.css';

const ColumnFilter = ({ 
    columns, 
    visibleColumnIds, 
    onToggleColumn, 
    hasUnsavedChanges, 
    onSave 
}) => {
    return (
        <div className="column-filter-container">
            {/* חלק 1: בחירת עמודות להצגה */}
            <div className="filter-section">
                <span className="filter-title">Columns to display:</span>
                <div className="checkbox-group">
                    {columns.map((col) => (
                        <label key={col.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={visibleColumnIds.includes(col.id)}
                                onChange={() => onToggleColumn(col.id)}
                            />
                            {col.title}
                        </label>
                    ))}
                </div>
            </div>

            {/* חלק 2: מתג השמירה (Toggle) */}
            <div className="save-toggle-section">
                <div className="save-toggle-wrapper">
                    <label className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={!hasUnsavedChanges} 
                            onChange={onSave}
                            disabled={!hasUnsavedChanges} 
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className={`save-status-text ${hasUnsavedChanges ? 'unsaved' : 'saved'}`}>
                        {hasUnsavedChanges ? 'Toggle to Save' : 'Changes Saved'}
                    </span>
                </div>
            </div>
        </div>
    );
};

ColumnFilter.propTypes = {
    columns: PropTypes.array.isRequired,
    visibleColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleColumn: PropTypes.func.isRequired,
    hasUnsavedChanges: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired
};

export default ColumnFilter;