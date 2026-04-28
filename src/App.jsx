import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GenericTable from './components/GenericTable';
import ColumnFilter from './components/ColumnFilter';
import PlaylistGenerator from './components/PlaylistGenerator';
import { tableColumns, generatePlaylistData } from './data/mockData';
import './App.css';

function App() {
  const [playlistData, setPlaylistData] = useState([]);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  
  const hasUnsavedChanges = useMemo(() => {
    if (!savedSnapshot || playlistData.length === 0) return false;
    return JSON.stringify(playlistData) !== savedSnapshot;
  }, [playlistData, savedSnapshot]);

  const [visibleColumnIds, setVisibleColumnIds] = useState(tableColumns.map(col => col.id));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- שינוי: טעינה ראשונית - ללא ייצור נתונים אוטומטי ---
  useEffect(() => {
    const savedData = localStorage.getItem('myPlaylist');
    if (savedData) {
      setPlaylistData(JSON.parse(savedData));
      setSavedSnapshot(savedData);
    } else {
      // עולה ריק! רק מגדירים את הסנאפשוט כמערך ריק כדי למנוע באגים
      setPlaylistData([]);
      setSavedSnapshot('[]');
    }
  }, []);

  const handleSaveChanges = () => {
    const stringifiedData = JSON.stringify(playlistData);
    localStorage.setItem('myPlaylist', stringifiedData);
    setSavedSnapshot(stringifiedData);
  };

  const handleGenerateNewPlaylist = (count) => {
    // אם ביקשו 0, נייצר מערך ריק במקום לקרוא לפונקציה
    const newData = count === 0 ? [] : generatePlaylistData(count);
    const stringifiedNewData = JSON.stringify(newData);
    
    setPlaylistData(newData);
    localStorage.setItem('myPlaylist', stringifiedNewData);
    setSavedSnapshot(stringifiedNewData);
    
    setIsInitialLoad(true); 
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumnIds(prevIds => {
      if (prevIds.includes(columnId)) return prevIds.filter(id => id !== columnId);
      return [...prevIds, columnId];
    });
  };

  const columnsToDisplay = useMemo(() => {
    return tableColumns.filter(col => visibleColumnIds.includes(col.id));
  }, [visibleColumnIds]);

  const handleUpdateRow = useCallback((rowId, columnId, newValue) => {
    setPlaylistData(prevData => 
      prevData.map(row => row.id === rowId ? { ...row, [columnId]: newValue } : row)
    );
    setIsInitialLoad(false); 
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Amit's Playlist 🎵</h1>
        
        {/* --- שינוי: העברנו לקומפוננטה את הכמות הנוכחית של השירים --- */}
        <PlaylistGenerator 
            onGenerate={handleGenerateNewPlaylist} 
            currentCount={playlistData.length} 
        />

        {/* --- שינוי: הטיפ יופיע רק אם יש לפחות שיר אחד בטבלה --- */}
        {isInitialLoad && !hasUnsavedChanges && playlistData.length > 0 && (
          <p className="main-initial-tip">💡 Double-click any field below to modify your playlist</p>
        )}
      </header>
        <main>
        {/* --- הוספנו את התנאי: נרנדר את הסרגל *אך ורק* אם יש שירים בפלייליסט --- */}
        {playlistData.length > 0 && (
          <ColumnFilter 
            columns={tableColumns} 
            visibleColumnIds={visibleColumnIds} 
            onToggleColumn={handleToggleColumn}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSaveChanges}
          />
        )}

        {/* הטבלה תמיד מרונדרת, כי היא יודעת להציג את הודעת ה"אין נתונים" בעצמה */}
        <GenericTable 
          columns={columnsToDisplay} 
          data={playlistData} 
          onUpdateRow={handleUpdateRow}
        />
      </main>
    </div>
  );
}

export default App;