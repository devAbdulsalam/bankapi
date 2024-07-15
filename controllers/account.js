import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Account from './../models/Account.js';
import Beneficiary from './../models/Beneficiary.js';
import Card from './../models/Card.js';
import Vault from './../models/Vault.js';
import Budget from './../models/Budget.js';
import Saving from './../models/Saving.js';
import bcrypt from 'bcryptjs';
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
export const transfer = async (req, res) => {
	try {
		const userId = req.user._id;
		const {
			accountName,
			accountNumber,
			bank,
			bankImage,
			amount,
			remark,
			pin,
			isSavePercentage,
		} = req.body;

		// Find the user's account
		const userAccount = await Account.findOne({ userId, name: 'savings' });
		if (!userAccount) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Verify transaction pin
		const isPinValid = await bcrypt.compare(pin, userAccount.pin);
		if (!isPinValid) {
			return res.status(401).json({ message: 'Incorrect transaction pin' });
		}

		// Calculate savings and spending amounts
		let savings = 0;
		let spending = amount;

		if (isSavePercentage) {
			savings = (userAccount.savingsPercentage / 100) * amount;
			spending += savings;
		}

		// Ensure sufficient balance
		if (userAccount.balance < spending) {
			return res.status(400).json({ message: 'Insufficient balance' });
		}

		// Update user account balance and save
		userAccount.balance -= spending;
		await userAccount.save();

		// Update or create saving account
		const savingAccount = await Saving.findOneAndUpdate(
			{ userId },
			{ $inc: { balance: savings }, $setOnInsert: { startDate: Date.now() } },
			{ new: true, upsert: true }
		);

		// Record transactions
		await Transaction.create({
			userId,
			type: 'spending',
			amount: spending,
			remark,
			accountName,
			accountNumber,
			bank,
			icon: bankImage,
		});

		if (isSavePercentage) {
			await Transaction.create({
				type: 'savings',
				amount: savings,
				userId,
				remark,
				accountName,
				accountNumber,
				bank,
				icon: bankImage,
			});
		}

		return res.status(200).json({ account: userAccount });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export const Transfer2 = async (req, res) => {
	try {
		const userId = req.user;
		const {
			accountName,
			accountNumber,
			bank,
			bankImage,
			amount,
			remark,
			pin,
			isSavePercentage,
		} = req.body;

		// const user = await User.findById(userId);
		const userAccount = await Account.findOne({ userId, name: 'savings' });
		if (!userAccount) {
			return res.status(404).send('User not found');
		}
		const match = await bcrypt.compare(pin, userAccount.pin);
		if (!match) {
			return res.status(401).json({ message: 'Incorrect transaction pin' });
		}
		if (isSavePercentage) {
			const savings = (userAccount.savingsPercentage / 100) * amount;
			const spending = amount + savings;

			// Ensure user has enough balance to cover the spending
			if (userAccount.balance < spending) {
				return res.status(400).send('Insufficient balance');
			}
			const savingAccount = await Saving.findOne({ userId });
			if (!savingAccount) {
				await Saving.create({ balance: savings, startDate: new Date.now() });
				userAccount.balance -= spending;
				await userAccount.save();
			} else {
				userAccount.balance -= spending;
				savingAccount.balance += savings;
				await userAccount.save();
				await savingAccount.save();
			}

			// Record transactions
			await Transaction.create({ type: 'spending', amount: spending });
			await Transaction.create({
				type: 'savings',
				amount: savings,
				remark,
				accountName,
				accountNumber,
				bank,
				icon: bankImage,
			});

			return res.status(200).json({ account: userAccount });
		} else {
			// Ensure user has enough balance to cover the spending
			if (userAccount.balance < amount) {
				return res.status(400).send('Insufficient balance');
			}

			userAccount.balance -= amount;
			await userAccount.save();

			// Record transactions
			await Transaction.create({ type: 'spending', amount: spending });

			return res.status(200).json({ account: userAccount });
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

// Add funds to user account
export const addFund = async (req, res) => {
	try {
		const userId = req.user;
		const { amount } = req.body;

		const account = await Account.findOne(userId);
		if (!account) {
			return res.status(404).send('account not found');
		}

		account.balance += amount;

		// Record transaction
		await Transaction.create({ type: 'addFunds', amount });

		await account.save();

		res.status(200).json(account);
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
