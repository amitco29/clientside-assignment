import { faker } from '@faker-js/faker';

// האפשרויות שיופיעו כשהמשתמש ירצה לערוך את הז'אנר
// (שמנו אותן פה למעלה כדי שנוכל להזין אותן לתוך הסכמה ולתוך הפייקר)
const genreOptionsList = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical'];

// 1. הגדרת העמודות של הטבלה - עכשיו גנרית לחלוטין!
export const tableColumns = [
    { id: 'songName', ordinalNo: 0, title: 'Song Name', type: 'string', width: 250 },
    { id: 'artist', ordinalNo: 1, title: 'Artist', type: 'string', width: 200 },
    { 
        id: 'genre', 
        ordinalNo: 2, 
        title: 'Genre', 
        type: 'selection', // הטיפוס הנדרש במטלה
        width: 150,
        options: genreOptionsList // <-- תוספת חכמה: הטבלה תקרא מפה את האפשרויות ל-Dropdown
    },
    { 
        id: 'duration', 
        ordinalNo: 3, 
        title: 'Duration', 
        type: 'number', 
        width: 120,
        editable: false,
        // תוספת חכמה: פונקציית עיצוב שעוברת לטבלה מבלי שהטבלה תדע שזה "זמן"
        format: (value) => {
            const minutes = Math.floor(value / 60);
            const seconds = value % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    { id: 'isFavorite', ordinalNo: 4, title: 'Favorite', type: 'boolean', width: 100 }
];

// 2. פונקציה שמייצרת את הנתונים
export const generatePlaylistData = (count = 50) => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        const songName = faker.music.songName();
        const artist = faker.person.fullName();
        const duration = faker.number.int({ min: 120, max: 300 });
        const genre = faker.helpers.arrayElement(genreOptionsList);
        const isFavorite = false; 

        // --- יצירת ID מורכב (Composite Key) ---
        
        // הלוגיקה הפעילה (לוקחת 2 אותיות ראשונות כפי שהן):
        const songPrefix = songName.substring(0, 2).toUpperCase();
        const artistPrefix = artist.substring(0, 2).toUpperCase();
        
        /*
        // חשבתי גם על מקרי קצה שבהם התווים הראשונים הם רווחים או תווים מיוחדים. 
        // אפשר להשתמש ב-Regex הבא כדי לנקות את המחרוזת ורק אז לחתוך, כדי לשמור על מפתח שלם:
        // const songPrefix = songName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
        // const artistPrefix = artist.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
        */

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