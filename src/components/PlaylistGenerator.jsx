import React, { useState } from 'react';

const PlaylistGenerator = ({ onGenerate }) => {
    const [count, setCount] = useState(20);

    const handleGenerate = () => {
        // מוודאים שהמספר תקין
        const num = Math.max(1, Math.min(1000, Number(count)));
        onGenerate(num);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
            backgroundColor: '#f8fafc',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
        }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Create a new playlist:</span>
            <input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(e.target.value)}
                min="1" 
                max="1000"
                style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>songs</span>
            <button 
                onClick={handleGenerate}
                style={{
                    backgroundColor: '#aa3bff',
                    color: 'white',
                    border: 'none',
                    padding: '6px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: '0.2s'
                }}
            >
                Generate 🚀
            </button>
        </div>
    );
};

export default PlaylistGenerator;