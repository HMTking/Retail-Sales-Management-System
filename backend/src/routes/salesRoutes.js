import express from 'express';
import {
  getSales,
  getFilterOptions,
  getSaleById,
} from '../controllers/salesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSales);
router.get('/filters', protect, getFilterOptions);
router.get('/:id', protect, getSaleById);

export default router;
