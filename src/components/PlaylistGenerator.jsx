import React, { useState } from 'react';
import './PlaylistGenerator.css';

const PlaylistGenerator = ({ onGenerate, currentCount }) => {
    // --- 1. ניהול מצב (State) ---
    const [count, setCount] = useState('');

    // --- 2. טיפול באירועים (Event Handlers) ---
    
    // עדכון המצב בעת הקלדה מתוך שדה הקלט
    const handleChange = (e) => {
        setCount(e.target.value);
    };

    // מנגנון הגנה בעת יציאה מהשדה (Blur): 
    // מונע הזנת ערכים שליליים או חריגה מהמגבלה העליונה
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

    // הפעלת פונקציית הייצור המועברת מרכיב האב (App.jsx)
    const handleGenerate = () => {
        // קביעת ערך ברירת מחדל של 20 במידה והשדה נותר ריק
        const numToGenerate = count === '' ? 20 : Math.max(0, Math.min(1000, Number(count)));
        onGenerate(numToGenerate);
    };

    // --- 3. רינדור (Render) ---
    return (
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
                    name="playlistCount" 
                />
                
                <span className="generator-suffix">songs</span>
                
                <button 
                    onClick={handleGenerate}
                    className="generator-button"
                >
                    Generate 🚀
                </button>
            </div>
            
            {/* תצוגת כמות הנתונים הקיימת כעת בסטייט המרכזי */}
            <div className="current-count-text">
                Current playlist contains <strong>{currentCount}</strong> songs
            </div>
        </div>
    );
};

export default PlaylistGenerator;