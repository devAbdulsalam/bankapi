import express from 'express';
import {
	buyData,
	buyAirtime,
	getBalance,
	getBanks,
	getNetworks,
	getUtility,
	getUtilityServices,
	verifyBVN,
	purchaseBill,
	verifyPhone,
	ValidateService,
	verifyNIN,
} from './../controllers/service.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, verifyPermission(['ADMIN']), getBalance);
router.get('/utilities', requireAuth, getUtilityServices);
router.post('/utilities/validate', requireAuth, ValidateService);
router.get('/utilities/:type', requireAuth, getUtility);
router.get('/banks', requireAuth, getBanks);
router.get('/networks', requireAuth, getNetworks);
router.get('/networks/:id/data', requireAuth, getNetworks);
router.get('/networks/:id/airtime', requireAuth, getNetworks);
router.post('/verify-phone', requireAuth, verifyPhone);
router.post('/buy-data', requireAuth, buyData);
router.post('/buy-airtime', requireAuth, buyAirtime);
router.post('/purchase-bill', requireAuth, purchaseBill);
router.post('/verify-bvn', requireAuth, verifyBVN);
router.post('/verify-nin', requireAuth, verifyNIN);
router.get('/bettings', requireAuth, getNetworks);

export default router;
