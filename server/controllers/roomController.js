import { db } from '../config/firebase.js';

const COLLECTION_NAME = 'rooms';

export const getRooms = async (req, res) => {
    try {
        const result = await db.collection(COLLECTION_NAME).get();
        let rooms = [];

        // Handle Firestore QuerySnapshot
        if (result.docs) {
            rooms = result.docs.map(doc => {
                const data = typeof doc.data === 'function' ? doc.data() : doc.data;
                // Check if data is a function (LocalDB mock returns object with data function) 
                // or if it is the data object itself (if we simplified LocalDB). 
                // Our LocalDB implementation returns { id, data: () => item } in docs array.
                const roomData = typeof data === 'function' ? data() : data;
                return { id: doc.id, ...roomData };
            });
        }

        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const createRoom = async (req, res) => {
    try {
        const newRoom = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        const result = await db.collection(COLLECTION_NAME).add(newRoom);
        res.status(201).json({ id: result.id, ...newRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const doc = await db.collection(COLLECTION_NAME).doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const data = typeof doc.data === 'function' ? doc.data() : doc.data;
        res.status(200).json({ id: doc.id, ...data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        await db.collection(COLLECTION_NAME).doc(req.params.id).delete();
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
