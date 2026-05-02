import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GenericTable from './components/GenericTable';
import ColumnFilter from './components/ColumnFilter';
import PlaylistGenerator from './components/PlaylistGenerator';
import { tableColumns, generatePlaylistData } from './data/mockData';

// ייבוא נתוני המכוניות
// import { carColumns, generateCarData } from './data/mockDataCars';

import './App.css';

function App() {
  // --- 1. ניהול מצב (State Management) ---
  
  // הסטייט המרכזי שמחזיק את הנתונים שמוצגים כרגע במסך (כולל טיוטות שעוד לא נשמרו)
  const [playlistData, setPlaylistData] = useState([]);
  
  // הסטייט הזה שומר "צילום מצב" (Snapshot) של מה ששמור כרגע ב-LocalStorage
  // זה מאפשר לנו להשוות בין המסך לזיכרון ולדעת מתי להדליק את כפתור השמירה
  const [savedSnapshot, setSavedSnapshot] = useState('');
  
  // הסטייט של כפתור הפילטר (הצג הכל / הצג רק מועדפים)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // הסטייט של המכוניות  
  // const [carData, setCarData] = useState(() => generateCarData(5)); // נייצר 5 רכבים כברירת מחדל
  
  // סטייט שמנהל אילו עמודות מוסתרות ואילו מוצגות
  const [visibleColumnIds, setVisibleColumnIds] = useState(tableColumns.map(col => col.id));
  
  // דגל שיודע אם אנחנו בטעינה ראשונית כדי להציג את הודעת ההדרכה (Tooltip)
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  // --- 2. חישובים ואופטימיזציה (useMemo) ---
  
  // בודק אם יש שינויים שלא נשמרו. useMemo מבטיח שהחישוב יקרה רק אם הנתונים השתנו
  const hasUnsavedChanges = useMemo(() => {
    if (!savedSnapshot || playlistData.length === 0) return false;
    return JSON.stringify(playlistData) !== savedSnapshot;
  }, [playlistData, savedSnapshot]);

  // מסנן את העמודות שיועברו לטבלה לפי מה שהמשתמש בחר בתפריט ה-Columns
  const columnsToDisplay = useMemo(() => {
    return tableColumns.filter(col => visibleColumnIds.includes(col.id));
  }, [visibleColumnIds]);

  // מכין את הנתונים לטבלה: אם כפתור המועדפים לחוץ, נחזיר רק אותם.
  const filteredPlaylistData = useMemo(() => {
    if (showFavoritesOnly) {
      return playlistData.filter(song => song.isFavorite === true);
    }
    return playlistData;
  }, [playlistData, showFavoritesOnly]);

  // מייצר הודעה ריקה דינמית שמשתנה בהתאם לסיבה שבגללה אין נתונים
  const dynamicEmptyMessage = useMemo(() => {
    if (playlistData.length === 0) return "No data to show. Generate a new Playlist above 👆";
    if (showFavoritesOnly && filteredPlaylistData.length === 0) return "No favorites found. Turn off the filter and click the ☆ next to a song to add it! ⭐";
    return "No data found.";
  }, [playlistData.length, showFavoritesOnly, filteredPlaylistData.length]);


  // --- 3. פעולות (Actions & Side Effects) ---

  // useEffect שרץ רק פעם אחת בטעינת האפליקציה ושולף נתונים מ-LocalStorage
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

  // פונקציית שמירה ידנית: לוקחת את הנתונים מהמסך, הופכת לסטרינג ושומרת
  const handleSaveChanges = () => {
    const stringifiedData = JSON.stringify(playlistData);
    localStorage.setItem('myPlaylist', stringifiedData);
    setSavedSnapshot(stringifiedData);
  };

  // פונקצייה לייצור נתונים חדשים
  const handleGenerateNewPlaylist = (count) => {
    const newData = count === 0 ? [] : generatePlaylistData(count);
    const stringifiedNewData = JSON.stringify(newData);
    
    setPlaylistData(newData);
    localStorage.setItem('myPlaylist', stringifiedNewData);
    setSavedSnapshot(stringifiedNewData);
    
    setIsInitialLoad(true); 
  };

  // מדליק או מכבה עמודה מסוימת במערך העמודות הנראות
  const handleToggleColumn = (columnId) => {
    setVisibleColumnIds(prevIds => {
      if (prevIds.includes(columnId)) return prevIds.filter(id => id !== columnId);
      return [...prevIds, columnId];
    });
  };


  // --- 4.  פונקציית העדכון (Update Logic) ---
  
  // שימוש ב-useCallback כדי שה-React.memo ב-TableRow לא ירנדר שורות סתם.
  const handleUpdateRow = useCallback((rowId, columnId, newValue) => {
    
    // שלב א': תמיד נעדכן את ה-UI (מצב ה-Draft)
    setPlaylistData(prevData => {
      return prevData.map(row => 
        row.id === rowId ? { ...row, [columnId]: newValue } : row
      );
    });

    // שלב ב': הפרדת רשויות - שמירה אוטומטית רק לכוכב (מועדפים)
    if (columnId === 'isFavorite') {
      setSavedSnapshot(prevSnapshot => {
        const lastSavedData = JSON.parse(prevSnapshot || '[]');
        
        const updatedCleanData = lastSavedData.map(row => 
          row.id === rowId ? { ...row, [columnId]: newValue } : row
        );
        
        const stringifiedData = JSON.stringify(updatedCleanData);
        localStorage.setItem('myPlaylist', stringifiedData);
        return stringifiedData; 
      });
    } else {
      setIsInitialLoad(false); 
    }
  }, []);


  // --- 5. הרינדור (JSX) ---
  return (
    <div className="app-container">
      <header>
        <h1>Amit's Playlist 🎵</h1>
        
        <PlaylistGenerator 
            onGenerate={handleGenerateNewPlaylist} 
            currentCount={playlistData.length} 
        />

        {/* הודעת ההדרכה - תוצג רק בהתחלה, כל עוד יש נתונים ועוד לא התחילו לערוך אותם */}
        {isInitialLoad && !hasUnsavedChanges && playlistData.length > 0 && (
          <p className="main-initial-tip">💡 Double-click any field below to modify your playlist</p>
        )}
      </header>
      
      
      <main>
        {/* סרגל הכלים של הטבלה - לא יוצג אם אין נתונים בכלל */}
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
        {/* טבלה גנרית - מקבלת רק נתונים מעובדים, מסוננים ומאופטמים מראש */}
        <GenericTable 
          columns={columnsToDisplay} 
          data={filteredPlaylistData} 
          onUpdateRow={handleUpdateRow}
          emptyMessage={dynamicEmptyMessage}
        />
                
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