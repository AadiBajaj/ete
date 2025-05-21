import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
} from '../Controllers/complaint.controller.js';

import { validateComplaint, validateObjectId } from '../Middlewares/validation.middleware.js';
const router = express.Router();

router.post('/complaints', validateComplaint, createComplaint);
router.get('/complaint', getAllComplaints);
router.get('/complaints/:id', validateObjectId, getComplaintById);
router.put('/complaints/:id', validateObjectId, validateComplaint, updateComplaint);
router.delete('/complaints/:id', validateObjectId, deleteComplaint);

export default router;
