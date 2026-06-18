const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public: list rooms with optional filters
router.get('/', async (req, res) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.maxPrice) filter.pricePerNight = { $lte: Number(req.query.maxPrice) };
    if (req.query.capacity) filter.capacity = { $gte: Number(req.query.capacity) };
    const rooms = await Room.find(filter).sort({ pricePerNight: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: check availability
router.get('/check-availability', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'roomId, checkIn, checkOut required' });
    }
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $nin: ['cancelled'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });
    res.json({ available: !conflict });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create room
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: update room
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete room
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
