import { Router } from 'express';
import { getTests, getTestById, submitTest } from '../controllers/main_controller.js';

const router = Router();

router.get('/', getTests);
router.get('/id', getTestById);
router.post('/id/submit', submitTest);

export default router;
