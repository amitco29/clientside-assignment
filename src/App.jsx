import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GenericTable from './components/GenericTable';
import ColumnFilter from './components/ColumnFilter';
import PlaylistGenerator from './components/PlaylistGenerator';
import { tableColumns, generatePlaylistData } from './data/mockData';

//  ייבוא נתוני המכוניות
//import { carColumns, generateCarData } from './data/mockDataCars';

import './App.css';

function App() {
  const [playlistData, setPlaylistData] = useState([]);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // הסטייט של המכוניות  
  //const [carData, setCarData] = useState(() => generateCarData(5)); // נייצר 5 רכבים כברירת מחדל

  const hasUnsavedChanges = useMemo(() => {
    if (!savedSnapshot || playlistData.length === 0) return false;
    return JSON.stringify(playlistData) !== savedSnapshot;
  }, [playlistData, savedSnapshot]);

  const [visibleColumnIds, setVisibleColumnIds] = useState(tableColumns.map(col => col.id));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // טעינה ראשונית
  useEffect(() => {
    const savedData = localStorage.getItem('myPlaylist');
    if (savedData) {
      setPlaylistData(JSON.parse(savedData));
      setSavedSnapshot(savedData);
    } else {
      setPlaylistData([]);
      setSavedSnapshot('[]');
    }
  }, []);

  // שמירה ידנית (כפתור Save)
  const handleSaveChanges = () => {
    const stringifiedData = JSON.stringify(playlistData);
    localStorage.setItem('myPlaylist', stringifiedData);
    setSavedSnapshot(stringifiedData);
  };

  // יצירת פלייליסט חדש
  const handleGenerateNewPlaylist = (count) => {
    const newData = count === 0 ? [] : generatePlaylistData(count);
    const stringifiedNewData = JSON.stringify(newData);
    
    setPlaylistData(newData);
    localStorage.setItem('myPlaylist', stringifiedNewData);
    setSavedSnapshot(stringifiedNewData);
    
    setIsInitialLoad(true); 
  };

  // בחירת עמודות לתצוגה
  const handleToggleColumn = (columnId) => {
    setVisibleColumnIds(prevIds => {
      if (prevIds.includes(columnId)) return prevIds.filter(id => id !== columnId);
      return [...prevIds, columnId];
    });
  };

  const columnsToDisplay = useMemo(() => {
    return tableColumns.filter(col => visibleColumnIds.includes(col.id));
  }, [visibleColumnIds]);

  // --- עדכון שורות: מפריד בין עריכת טקסט ללחיצה על כוכב (שמירה אוטומטית) ---
  const handleUpdateRow = useCallback((rowId, columnId, newValue) => {
    
    // 1. עדכון התצוגה (UI) בלבד - כולל טיוטות עריכה
    setPlaylistData(prevData => {
      return prevData.map(row => 
        row.id === rowId ? { ...row, [columnId]: newValue } : row
      );
    });

    // 2. שמירה אוטומטית *רק* עבור שדה המועדפים, מופרדת לחלוטין מהטיוטה!
    if (columnId === 'isFavorite') {
      setSavedSnapshot(prevSnapshot => {
        // שולפים את השמירה ה"נקייה" האחרונה מהזיכרון (שלא כוללת טיוטות טקסט פתוחות)
        const lastSavedData = JSON.parse(prevSnapshot || '[]');
        
        // מעדכנים *רק* את הכוכב על גבי הנתונים הנקיים
        const updatedCleanData = lastSavedData.map(row => 
          row.id === rowId ? { ...row, [columnId]: newValue } : row
        );
        
        const stringifiedData = JSON.stringify(updatedCleanData);
        localStorage.setItem('myPlaylist', stringifiedData);
        return stringifiedData; // מעדכן את ה-Snapshot
      });
    } else {
      // אם זו עריכת טקסט, נוריד את דגל הטעינה הראשונית
      setIsInitialLoad(false); 
    }
    
  }, []);

  // נתונים מסוננים (מציג את כולם או רק את המועדפים)
  const filteredPlaylistData = useMemo(() => {
    if (showFavoritesOnly) {
      return playlistData.filter(song => song.isFavorite === true);
    }
    return playlistData;
  }, [playlistData, showFavoritesOnly]);

  // --- לוגיקה חכמה להודעת "מצב ריק" (Empty States) ---
  const dynamicEmptyMessage = useMemo(() => {
    if (playlistData.length === 0) {
      return "No data to show. Generate a new Playlist above 👆";
    }
    if (showFavoritesOnly && filteredPlaylistData.length === 0) {
      return "No favorites found. Turn off the filter and click the ☆ next to a song to add it! ⭐";
    }
    return "No data found.";
  }, [playlistData.length, showFavoritesOnly, filteredPlaylistData.length]);


  return (
    <div className="app-container">
      <header>
        <h1>Amit's Playlist 🎵</h1>
        
        <PlaylistGenerator 
            onGenerate={handleGenerateNewPlaylist} 
            currentCount={playlistData.length} 
        />

        {/* הודעת ההדרכה - מופיעה רק שיש נתונים וטרם נערכו */}
        {isInitialLoad && !hasUnsavedChanges && playlistData.length > 0 && (
          <p className="main-initial-tip">💡 Double-click any field below to modify your playlist</p>
        )}
      </header>
      
      <main>
        {/* סרגל הכלים העליון - מופיע רק כשיש נתונים בפלייליסט */}
        {playlistData.length > 0 && (
          <ColumnFilter 
            columns={tableColumns} 
            visibleColumnIds={visibleColumnIds} 
            onToggleColumn={handleToggleColumn}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSaveChanges}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={setShowFavoritesOnly}
          />
        )}

        {/* הטבלה המקורית שלנו */}
        <GenericTable 
          columns={columnsToDisplay} 
          data={filteredPlaylistData} 
          onUpdateRow={handleUpdateRow}
          emptyMessage={dynamicEmptyMessage}
        />
                
        {/* אזור טבלת ההדגמה (מכוניות) */}
        {/* 
        <div style={{ marginTop: '50px', borderTop: '2px dashed #cbd5e1', paddingTop: '30px', paddingBottom: '30px' }}>
          <h2 style={{ color: '#475569', marginBottom: '15px', fontSize: '1.2rem' }}>
            🚗 Generic Table Test (Car Data)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
            This section proves the table is 100% generic and can handle different schemas.
          </p>
          <GenericTable 
            columns={carColumns} 
            data={carData} 
            // פונקציית עדכון פשוטה מקומית כדי שהעריכה תעבוד גם ברכבים
            onUpdateRow={(rowId, colId, val) => {
                setCarData(prev => prev.map(car => car.id === rowId ? { ...car, [colId]: val } : car));
            }}
            emptyMessage="No cars to show."
          />
        </div>
        */}
      </main>
    </div>
  );
}

export default App;