import express from 'express';
const router = express.Router();
// const requireAuth = require('../middleware/requireAuth');
import {
	// getPaymentOption,
	// updatePaymentOption,
	// createPaymentOption,
	verifyAccount,
} from '../controllers/payment.js';

// // get user
router.post('/verify-account', verifyAccount);
// router.get('/get-payment-option', getPaymentOption);
// router.post('/create-payment-option', createPaymentOption);
// router.patch('/update-payment-option', updatePaymentOption);
// router.delete('/', updatePaymentOption);

export default router;
