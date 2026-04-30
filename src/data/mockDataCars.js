import { faker } from '@faker-js/faker';

const colorsList = ['Red', 'Blue', 'Black', 'White', 'Silver'];

// --- סדר עמודות משוגע ושונה לחלוטין! ---
// 1. קודם כל כוכב (בוליאני)
// 2. אחריו מספר (מחיר)
// 3. טקסט חופשי (מותג)
// 4. רשימה נפתחת (צבע)
// 5. טקסט חופשי (מודל)
export const carColumns = [
    { id: 'isElectric', ordinalNo: 0, title: 'EV ⚡', type: 'boolean', width: 80 },
    { 
        id: 'price', 
        ordinalNo: 1, 
        title: 'Price', 
        type: 'number', 
        width: 120,
        // נוסיף גם פורמט מיוחד למחיר רק כדי להקשות
        format: (val) => `$${val.toLocaleString()}` 
    },
    { id: 'brand', ordinalNo: 2, title: 'Brand', type: 'string', width: 150 },
    { id: 'color', ordinalNo: 3, title: 'Color', type: 'selection', width: 120, options: colorsList },
    { id: 'model', ordinalNo: 4, title: 'Model', type: 'string', width: 180 }
];

export const generateCarData = (count = 5) => {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        data.push({
            id: `CAR-${faker.string.alphanumeric(5).toUpperCase()}`,
            isElectric: faker.datatype.boolean(),
            price: faker.number.int({ min: 15000, max: 80000 }),
            brand: faker.vehicle.manufacturer(),
            color: faker.helpers.arrayElement(colorsList),
            model: faker.vehicle.model()
        });
    }
    
    return data;
};