import React, { useState } from 'react';
import './PlaylistGenerator.css';

// מקבל עכשיו גם את currentCount
const PlaylistGenerator = ({ onGenerate, currentCount }) => {
    const [count, setCount] = useState('');

    const handleChange = (e) => {
        setCount(e.target.value);
    };

    const handleBlur = () => {
        if (count === '') return;
        
        let num = Number(count);
        
        if (isNaN(num) || num < 0) {
            num = 0;
        } else if (num > 1000) {
            num = 1000;
        }
        
        setCount(num.toString()); 
    };

    const handleGenerate = () => {
        const numToGenerate = count === '' ? 20 : Math.max(0, Math.min(1000, Number(count)));
        onGenerate(numToGenerate);
    };

    return (
        /* מעטפת חדשה שתחזיק גם את הכפתורים וגם את הטקסט למטה */
        <div className="generator-wrapper">
            <div className="generator-container">
                <span className="generator-label">Create new playlist:</span>
                
                <input 
                    type="number" 
                    value={count} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="1000"
                    placeholder="20"
                    className="generator-input"
                />
                
                <span className="generator-suffix">songs</span>
                
                <button 
                    onClick={handleGenerate}
                    className="generator-button"
                >
                    Generate 🚀
                </button>
            </div>
            
            {/* --- הטקסט החדש שלנו --- */}
            <div className="current-count-text">
                Current playlist contains <strong>{currentCount}</strong> songs
            </div>
        </div>
    );
};

export default PlaylistGenerator;