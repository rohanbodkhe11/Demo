import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Initialize DB file if not exists
if (!fs.existsSync(dbPath)) {
    const initialData = {
        rooms: [
            {
                id: "1",
                name: "Deluxe Suite",
                type: "Deluxe",
                price: 2500,
                amenities: ["AC", "WiFi", "TV", "Breakfast"],
                maxOccupancy: 3,
                availability: true,
                image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Experience the ultimate comfort in our Deluxe Suite."
            },
            {
                id: "2",
                name: "Standard AC Room",
                type: "AC",
                price: 1800,
                amenities: ["AC", "WiFi", "TV"],
                maxOccupancy: 2,
                availability: true,
                image: "https://images.unsplash.com/photo-1590490360182-f33db0930327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Comfortable AC room for a pleasant stay."
            },
            {
                id: "3",
                name: "Budget Non-AC",
                type: "Non-AC",
                price: 1200,
                amenities: ["WiFi", "TV"],
                maxOccupancy: 2,
                availability: true,
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Affordable accommodation with essential amenities."
            }
        ],
        bookings: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

const readDB = () => {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const localDB = {
    collection: (name) => {
        return {
            get: async () => {
                const db = readDB();
                const items = db[name] || [];
                return {
                    docs: items.map(item => ({
                        id: item.id,
                        data: () => item
                    }))
                };
            },
            add: async (data) => {
                const db = readDB();
                const newItem = { id: Date.now().toString(), ...data };
                if (!db[name]) db[name] = [];
                db[name].push(newItem);
                writeDB(db);
                return { id: newItem.id };
            },
            doc: (id) => {
                return {
                    get: async () => {
                        const db = readDB();
                        const item = db[name]?.find(i => i.id === id);
                        return {
                            exists: !!item,
                            id: id,
                            data: () => item
                        };
                    },
                    delete: async () => {
                        const db = readDB();
                        if (db[name]) {
                            db[name] = db[name].filter(i => i.id !== id);
                            writeDB(db);
                        }
                    },
                    update: async (updates) => {
                        const db = readDB();
                        const index = db[name]?.findIndex(i => i.id === id);
                        if (index !== -1) {
                            db[name][index] = { ...db[name][index], ...updates };
                            writeDB(db);
                        }
                    }
                };
            }
        };
    }
};
