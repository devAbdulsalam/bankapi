import express from 'express';
import {
	getAdmins,
	getUsers,
	getUser,
	updateUser,
	getTransactions,
	createTransaction,
	getTransaction,
	updateTransaction,
} from '../controllers/admin.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';
import { loginAdmin } from '../controllers/user.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/', requireAuth, verifyPermission(['ADMIN']), getAdmins);
router.get('/users', requireAuth, verifyPermission(['ADMIN']), getUsers);
router.get('/users/:userId', requireAuth, verifyPermission(['ADMIN']), getUser);
router.patch(
	'/users/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	updateUser
);
router.get(
	'/transactions',
	requireAuth,
	verifyPermission(['ADMIN']),
	getTransactions
);
router.get(
	'/transactions/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	getTransaction
);
router.post(
	'/transactions/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	createTransaction
);
router.patch(
	'/transactions/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	updateTransaction
);
// router.get("/performance/:id", getUserPerformance);

export default router;
