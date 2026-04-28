import { faker } from '@faker-js/faker';

// 1. הגדרת העמודות של הטבלה
// ה-id פה הוא קריטי: הוא המפתח שיחבר בין העמודה לבין המידע שנמצא בתוך השורות.
export const tableColumns = [
    { id: 'songName', ordinalNo: 0, title: 'Song Name', type: 'string', width: 250 },
    { id: 'artist', ordinalNo: 1, title: 'Artist', type: 'string', width: 200 },
    { id: 'genre', ordinalNo: 2, title: 'Genre', type: 'selection', width: 150 },
    { id: 'duration', ordinalNo: 3, title: 'Duration', type: 'number', width: 120 },
    { id: 'isFavorite', ordinalNo: 4, title: 'Favorite', type: 'boolean', width: 100 }
];

// האפשרויות שיופיעו כשהמשתמש ירצה לערוך את הז'אנר (רשימה נפתחת)
export const genreOptions = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical'];

// 2. פונקציה שמייצרת לנו את השירים המזויפים כדי שיהיה לנו עם מה לעבוד
// כברירת מחדל היא תייצר 50 שירים, אבל נוכל לבקש ממנה גם 1000 כדי לבדוק עומס
export const generatePlaylistData = (count = 50) => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        // 1. קודם נייצר את הנתונים ונשמור אותם במשתנים
        const songName = faker.music.songName();
        const artist = faker.person.fullName();
        const duration = faker.number.int({ min: 120, max: 300 });
        const genre = faker.helpers.arrayElement(genreOptions);
        const isFavorite = false; // ברירת מחדל

        // 2. נייצר את ה-ID המיוחד שלנו (Composite Key)
        // ניקח 2 אותיות ראשונות, נהפוך לאותיות גדולות (כדי שייראה טוב), נשרשר אורך, ונוסיף את i כגיבוי
        const songPrefix = songName.substring(0, 2).toUpperCase();
        const artistPrefix = artist.substring(0, 2).toUpperCase();
        const customId = `${songPrefix}-${artistPrefix}-${duration}-${i}`; 
        // דוגמה לתוצאה: "HE-AD-210-5" (Hello, Adele, 210 seconds, index 5)

        // 3. נדחוף את הכל לאובייקט
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
