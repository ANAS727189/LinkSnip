import express from 'express';
import {handleUrl} from '../controllers/controller.js';
import { handleGetAnalytics } from '../controllers/controller.js';
import { handleGetRecentUrls } from '../controllers/controller.js';

const router = express.Router();

router.post('/', handleUrl);
router.get('/analytics/:shortId', handleGetAnalytics);
router.get('/recent', handleGetRecentUrls);

export default router;
