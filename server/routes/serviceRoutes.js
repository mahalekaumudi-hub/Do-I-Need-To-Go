import express from 'express';
import {
  getAllServices,
  getServiceById,
  searchServices,
  getAnswerContext,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/api/services', getAllServices);
router.get('/api/services/search', searchServices);
router.get('/api/services/answer', getAnswerContext);
router.get('/api/services/:id', getServiceById);
router.post('/api/services', createService);
router.put('/api/services/:id', updateService);
router.delete('/api/services/:id', deleteService);

export default router;
