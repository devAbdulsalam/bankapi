import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Account from './../models/Account.js';
import Beneficiary from './../models/Beneficiary.js';
import Card from './../models/Card.js';
import Vault from './../models/Vault.js';
import Budget from './../models/Budget.js';
import {
	hash,
	verifyHash,
	encryptData,
	decryptData,
	getEncryptionKey,
} from '../utils/hash.js';
import {
	getPaginatedPayload,
	transactionSearchConditions,
} from '../utils/getPaginatedPayload.js';
import { sendNotification } from './notification.js';

export const getDashboard = async (req, res) => {
	try {
		const userId = req.user._id;

		let accounts = await Account.find({ userId }).select('-pin');

		if (accounts.length === 0) {
			const hashedPassword = await hash('1234');
			await Account.create({
				userId,
				balance: 1000,
				savingsPercentage: 0,
				name: 'savings',
				pin: hashedPassword,
			});
			accounts = await Account.find({ userId }).select('-pin');
		}
		const transactions = await Transaction.find({ userId });
		const data = {
			accounts,
			transactions,
		};
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createAccount = async (req, res) => {
	try {
		const { savingsPercentage } = req.body;
		const account = await Account.create({
			userId: req.user._id,
			savingsPercentage,
		});
		const data = account;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Add spending and savings transactions for a user
export const Spend = async (req, res) => {
	try {
		const { userId } = req.params;
		const { amount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		const savings = (user.savingsPercentage / 100) * amount;
		const spending = amount - savings;

		// Ensure user has enough balance to cover the spending
		if (user.balance < spending) {
			return res.status(400).send('Insufficient balance');
		}

		user.balance -= spending;
		user.totalSavings += savings;

		// Record transactions
		user.transactions.push({ type: 'spending', amount: spending });
		user.transactions.push({ type: 'savings', amount: savings });

		await user.save();

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Add funds to user account
export const addFund = async (req, res) => {
	try {
		const { userId } = req.params;
		const { amount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		user.balance += amount;

		// Record transaction
		user.transactions.push({ type: 'addFunds', amount });

		await user.save();

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

export const dailySpending = async (req, res) => {};

// router.post('/lockSavings/:userId', async (req, res) => {
export const lockSavings = async (req, res) => {
	try {
		const { userId } = req.params;
		const { amount, lockInPeriod } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		if (user.balance < amount) {
			return res.status(400).send('Insufficient balance');
		}

		const lockInDurations = {
			monthly: 1,
			quarterly: 3,
			sixMonths: 6,
			yearly: 12,
		};

		const penaltyRates = {
			monthly: 5,
			quarterly: 10,
			sixMonths: 15,
			yearly: 20,
		};

		const lockInMonths = lockInDurations[lockInPeriod];
		const penaltyRate = penaltyRates[lockInPeriod];
		const endDate = new Date();
		endDate.setMonth(endDate.getMonth() + lockInMonths);

		user.balance -= amount;
		user.lockedSavings.push({
			amount,
			lockInPeriod,
			endDate,
			penaltyRate,
		});

		await user.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Request withdrawal from locked savings
// router.post('/requestWithdrawal/:userId', async (req, res) => {
export const requestWithdrawal = async (req, res) => {
	try {
		const { userId } = req.params;
		const { lockedSavingsId, amount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		const lockedSavings = user.lockedSavings.id(lockedSavingsId);
		if (!lockedSavings) {
			return res.status(404).send('Locked savings not found');
		}

		const currentDate = new Date();
		if (currentDate < lockedSavings.endDate) {
			const penalty = (lockedSavings.penaltyRate / 100) * amount;
			const amountAfterPenalty = amount - penalty;
			user.balance += amountAfterPenalty;
			user.transactions.push({
				type: 'withdrawal',
				amount: amountAfterPenalty,
			});
		} else {
			user.balance += amount;
			user.transactions.push({ type: 'withdrawal', amount });
		}

		lockedSavings.amount -= amount;
		if (lockedSavings.amount <= 0) {
			user.lockedSavings.id(lockedSavingsId).remove();
		}

		await user.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Set savings goal
// router.post('/setSavingsGoal/:userId', async (req, res) => {
export const setSavingsGoal = async (req, res) => {
	try {
		const { userId } = req.params;
		const { goalAmount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		user.savingsGoals.push({ goalAmount });
		await user.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Track savings progress
// router.post('/trackSavingsProgress/:userId', async (req, res) => {
export const trackSavingsProgress = async (req, res) => {
	try {
		const { userId } = req.params;
		const { goalId, amount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		const goal = user.savingsGoals.id(goalId);
		if (!goal) {
			return res.status(404).send('Savings goal not found');
		}

		goal.currentAmount += amount;
		await user.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Update gamification metrics (e.g., stars, level, rank)
// router.post('/updateGamification/:userId', async (req, res) => {
export const updateRank = async (req, res) => {
	try {
		const { userId } = req.params;
		const { starsEarned } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		user.stars += starsEarned;

		// Update level and rank based on stars
		if (user.stars >= 50) {
			user.level = 'Advanced';
			user.rank = 'Silver';
		} else if (user.stars >= 20) {
			user.level = 'Intermediate';
			user.rank = 'Gold';
		} else {
			user.level = 'Beginner';
			user.rank = 'Bronze';
		}

		await user.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// router.post('/setAutomaticSavings/:userId', async (req, res) => {
export const setAutomaticSavings = async (req, res) => {
	try {
		const { userId } = req.params;
		const { amount, frequency } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		user.automaticSavings.push({ amount, frequency });
		await user.save();

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};

// Withdraw funds (with PIN verification)
// router.post('/withdrawFunds/:userId', pinVerification, async (req, res) => {
export const withdrawFunds = async (req, res) => {
	try {
		const { userId } = req.params;
		const { amount } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		if (user.balance < amount) {
			return res.status(400).send('Insufficient funds');
		}

		// Deduct from balance
		user.balance -= amount;

		// Record transaction
		user.transactions.push({ type: 'withdrawal', amount });

		await user.save();

		// Send notification (optional)
		if (user.notificationsEnabled) {
			sendNotification(
				userId,
				`Withdrawal of $${amount} processed successfully.`
			);
		}

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
};
