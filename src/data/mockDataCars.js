import { faker } from '@faker-js/faker';

// רשימת צבעים שתשמש אותנו לבדיקת עמודה מסוג "רשימה נפתחת" (selection)
const colorsList = ['Red', 'Blue', 'Black', 'White', 'Silver'];

// יצרתי פה סכמה בכוונה שונה לגמרי מהשירים כדי "לאתגר" את הטבלה:
// 1. העמודה הראשונה היא בכלל כוכב (boolean) במקום טקסט.
// 2.  עמודת מחיר (number) עם פונקציית עיצוב (format) שמוסיפה סימן $.
// הטבלה לא יודעת שאלו מכוניות, היא רק קוראת את הסכמה הזו ומציירת את עצמה בהתאם!
export const carColumns = [
    { id: 'isElectric', ordinalNo: 0, title: 'EV ⚡', type: 'boolean', width: 80 },
    { 
        id: 'price', 
        ordinalNo: 1, 
        title: 'Price', 
        type: 'number', 
        width: 120,
        //  פונקציית עיצוב דינמית: הטבלה רק מפעילה
        format: (val) => `$${val.toLocaleString()}` 
    },
    { id: 'brand', ordinalNo: 2, title: 'Brand', type: 'string', width: 150 },
    { id: 'color', ordinalNo: 3, title: 'Color', type: 'selection', width: 120, options: colorsList },
    { id: 'model', ordinalNo: 4, title: 'Model', type: 'string', width: 180 }
];

// --- 2. ייצור נתוני המכוניות ---
// פונקציה שמייצרת אובייקטים של רכבים. 
//  המפתחות פה (brand, price , ...) תואמים ל-id של העמודות למעלה.
export const generateCarData = (count = 5) => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        data.push({
            id: `CAR-${faker.string.alphanumeric(5).toUpperCase()}`, // יצירת מזהה ייחודי לרכב - בדומה ללוחית רישוי
            isElectric: faker.datatype.boolean(),
            price: faker.number.int({ min: 15000, max: 80000 }),
            brand: faker.vehicle.manufacturer(),
            color: faker.helpers.arrayElement(colorsList),
            model: faker.vehicle.model()
        });
    }
    
    return data;
};