import express from 'express';
import { auth } from '../controllers/authentication.controller';
import { main } from '../controllers/index.controller';
import { qrimage } from '../controllers/qrimages.controllers';
import { acceptRequest } from '../controllers/request.controller';
import { test } from '../controllers/test.controller';
import { verify } from '../controllers/verification.controller';


const router = express.Router();

router.get('/', main);
router.post('/request', acceptRequest);
router.get('/test', test);
router.get('/qrimage/:id', qrimage)
router.get('/verify/:id', verify);
router.get('/auth/:id/:id2', auth);
export default router;