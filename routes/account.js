import express from 'express';
const router = express.Router();
import { requireAuth, pinVerification } from '../middleware/requireAuth.js';
import {
	createAccount,
	getDashboard,
	transfer,addFund,
	changeTransactionPin,
	updateTransactionPin,
} from '../controllers/account.js';

// // get user
router.get('/', requireAuth, getDashboard);
router.post('/create-account', requireAuth, createAccount);
router.post('/transfer', requireAuth, pinVerification, transfer);
router.post('/change-pin', requireAuth, changeTransactionPin);
router.post('/update-pin', requireAuth, updateTransactionPin);
router.post('/add-fund', requireAuth, addFund);
// router.post('/create-payment-option', createPaymentOption);
// router.patch('/update-payment-option', updatePaymentOption);
// router.delete('/', updatePaymentOption);

export default router;
