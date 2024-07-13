import express from 'express';
import {
	getClient,
	changePin,
	getBalance,
	getBeneficiaries,
	deleteBeneficiaries,
	postTransaction,
	getTransactions,
	getTransaction,
	addCard,
	getCards,
	getCard,
	deleteCards,
	deleteCard,
	getBudgets,
	getBudget,
	addBudget,
	deleteBudget,
	addVault,
	getVault,
	debitBudget,
	deleteVault,
	debitVault,
} from '../controllers/client.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.get('/', requireAuth, getClient);
router.get('/balance', requireAuth, getBalance);
router.get('/beneficiaries', requireAuth, getBeneficiaries);
router.get('/beneficiaries/:id', requireAuth, getBeneficiaries);
router.delete('/beneficiaries/:id', requireAuth, deleteBeneficiaries);
router.get('/budgets', requireAuth, getBudgets);
router.post('/budgets', requireAuth, addBudget);
router.get('/budgets/:id', requireAuth, getBudget);
router.post('/budgets/:id', requireAuth, debitBudget);
router.delete('/budgets/:id', requireAuth, deleteBudget);
router.get('/cards', requireAuth, getCards);
router.get('/cards/:id', requireAuth, getCard);
router.post('/cards', requireAuth, addCard);
router.delete('/cards', requireAuth, deleteCards);
router.delete('/cards/:id', requireAuth, deleteCard);
router.post('/change-pin', requireAuth, changePin);
router.get('/vaults', requireAuth, getBudgets);
router.post('/vaults', requireAuth, addVault);
router.get('/vaults/:id', requireAuth, getVault);
router.post('/vaults/:id', requireAuth, debitVault);
router.delete('/vaults/:id', requireAuth, deleteVault);
router.post('/transactions', requireAuth, postTransaction);
router.get('/transactions', requireAuth, getTransactions);
router.get('/transactions/:id', requireAuth, getTransaction);
export default router;
