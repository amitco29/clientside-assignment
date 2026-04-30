import { faker } from '@faker-js/faker';

// רשימת הז'אנרים מוגדרת כמשתנה חיצוני לטובת שימוש חוזר:
// 1. הזנה לסכמת העמודות עבור רשימת ה-Dropdown בטבלה.
// 2. הזנה ל-Faker לייצור נתוני Mock תואמים.
const genreOptionsList = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical'];

// --- 1. סכמת העמודות (Schema Definition) ---
// הגדרת מבנה הטבלה. הוספתי מאפיינים מעבר לדרישות המקוריות כדי להבטיח גנריות מלאה של הקומפוננטה:
export const tableColumns = [
    { id: 'songName', ordinalNo: 0, title: 'Song Name', type: 'string', width: 250 },
    { id: 'artist', ordinalNo: 1, title: 'Artist', type: 'string', width: 200 },
    { 
        id: 'genre', 
        ordinalNo: 2, 
        title: 'Genre', 
        type: 'selection', // הטיפוס הנדרש במטלה
        width: 150,
        // תוספת 1: העברת מערך האפשרויות (options) ברמת הסכמה. 
        // מונע Hard-coding בתוך קומפוננטת הטבלה ומאפשר רינדור דינמי של אלמנט ה-Select.
        options: genreOptionsList 
    },
    { 
        id: 'duration', 
        ordinalNo: 3, 
        title: 'Duration', 
        type: 'number', 
        width: 120,
        // תוספת 2: הגדרת הרשאת עריכה (editable). נועד לשדות שמיוצרים על ידי המערכת ולא אמורים להיות פתוחים לעריכת משתמש.
        editable: false, 
        // תוספת 3: פונקציית עיצוב (Format). מאפשרת לטבלה לקבל ערך מספרי (שניות) 
        // ולהציג אותו בפורמט מותאם (דקות:שניות) ללוגיקת התצוגה עצמה.
        format: (value) => {
            const minutes = Math.floor(value / 60);
            const seconds = value % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    { id: 'isFavorite', ordinalNo: 4, title: 'Favorite', type: 'boolean', width: 100 }
];

// --- 2. ייצור נתוני דמה (Mock Data Generation) ---
export const generatePlaylistData = (count = 50) => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        const songName = faker.music.songName();
        const artist = faker.person.fullName();
        const duration = faker.number.int({ min: 120, max: 300 });
        const genre = faker.helpers.arrayElement(genreOptionsList);
        const isFavorite = false; 

        // --- יצירת מפתח מורכב (Composite Key) ---
        // יצירת מזהה ייחודי הנגזר מפרטי הרשומה במקום שימוש במספר אקראי.
        const songPrefix = songName.substring(0, 2).toUpperCase();
        const artistPrefix = artist.substring(0, 2).toUpperCase();
        
        /*
        // הערה למקרי קצה (Data Normalization): 
        // אם התווים הראשונים מכילים רווחים או תווים מיוחדים, הגישה הנכונה תהיה להשתמש ב-Regex 
        // לניקוי המחרוזת לפני החיתוך, כדי להבטיח מפתח תקני ונקי:
        // const songPrefix = songName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
        // const artistPrefix = artist.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
        */

        // שרשור הערכים יחד עם האינדקס להבטחת ייחודיות מלאה של המפתח.
        const customId = `${songPrefix}-${artistPrefix}-${duration}-${i}`; 

        data.push({
            id: customId,
            songName: songName,
            artist: artist,
            genre: genre,
            duration: duration,
            isFavorite: isFavorite 
        });
    }
    
    return data;
};