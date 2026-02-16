import { db } from '../config/firebase.js';
import { Room } from '../models/index.js';

export const getRooms = async (req, res) => {
    try {
        const roomsSnapshot = await db.collection(Room.collection).get();
        const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRoom = async (req, res) => {
    try {
        const newRoom = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection(Room.collection).add(newRoom);
        res.status(201).json({ id: docRef.id, ...newRoom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const doc = await db.collection(Room.collection).doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        await db.collection(Room.collection).doc(req.params.id).delete();
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
