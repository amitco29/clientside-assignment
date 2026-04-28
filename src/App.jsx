import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GenericTable from './components/GenericTable';
import ColumnFilter from './components/ColumnFilter';
import PlaylistGenerator from './components/PlaylistGenerator'; // ייבוא המחולל החדש
import { tableColumns, generatePlaylistData } from './data/mockData';
import './App.css';

function App() {
  const [playlistData, setPlaylistData] = useState([]);
  
  // --- חדש (סעיף 2): שמירת "תמונת המצב" של הנתונים כפי שהם ב-LocalStorage ---
  const [savedSnapshot, setSavedSnapshot] = useState('');
  
  // המתג עכשיו מחושב אוטומטית! אין צורך ב-setHasUnsavedChanges
  // אנחנו פשוט משווים את הנתונים הנוכחיים לתמונת המצב השמורה
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
      setSavedSnapshot(savedData); // שומרים את תמונת המצב
    } else {
      const initialData = generatePlaylistData(20);
      setPlaylistData(initialData);
      const initialString = JSON.stringify(initialData);
      localStorage.setItem('myPlaylist', initialString);
      setSavedSnapshot(initialString); // שומרים את תמונת המצב
    }
  }, []);

  // פונקציית שמירה ל-LocalStorage
  const handleSaveChanges = () => {
    const stringifiedData = JSON.stringify(playlistData);
    localStorage.setItem('myPlaylist', stringifiedData);
    setSavedSnapshot(stringifiedData); // מעדכנים את תמונת המצב כך שהמתג יחזור ל-IDLE
  };

  // --- חדש (סעיף 3): פונקציה לייצור פלייליסט חדש לחלוטין ---
  const handleGenerateNewPlaylist = (count) => {
    const newData = generatePlaylistData(count);
    const stringifiedNewData = JSON.stringify(newData);
    
    // דורסים הכל!
    setPlaylistData(newData);
    localStorage.setItem('myPlaylist', stringifiedNewData);
    setSavedSnapshot(stringifiedNewData);
    
    // מציגים רמז למשתמש מחדש כי זו טבלה חדשה
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
        
        {/* המחולל החדש שיושב בדיוק פה */}
        <PlaylistGenerator onGenerate={handleGenerateNewPlaylist} />

        {isInitialLoad && !hasUnsavedChanges && (
          <p className="main-initial-tip">💡 Double-click any field below to modify your playlist</p>
        )}
      </header>
      
      <main>
        <ColumnFilter 
          columns={tableColumns} 
          visibleColumnIds={visibleColumnIds} 
          onToggleColumn={handleToggleColumn}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSaveChanges}
        />

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