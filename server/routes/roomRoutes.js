import express from 'express';
import { getRooms, createRoom, getRoomById, deleteRoom } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);
router.post('/', createRoom); // Protect with admin auth later
router.get('/:id', getRoomById);
router.delete('/:id', deleteRoom); // Protect with admin auth later

export default router;
