import express from 'express';
const router = express.Router();
import { requireAuth, pinVerification } from '../middleware/requireAuth.js';
import { createAccount, getDashboard } from '../controllers/account.js';

// // get user
router.get('/',requireAuth, getDashboard);
router.get('/', requireAuth, createAccount);
router.post('/create-account', requireAuth, createAccount);
// router.get('/get-payment-option', getPaymentOption);
// router.post('/create-payment-option', createPaymentOption);
// router.patch('/update-payment-option', updatePaymentOption);
// router.delete('/', updatePaymentOption);

export default router;
