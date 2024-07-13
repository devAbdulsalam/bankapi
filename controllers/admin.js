import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Account from './../models/Account.js';
import Budget from './../models/Budget.js';
import Vault from './../models/Vault.js';
import {
	getPaginatedPayload,
	userSearchConditions,
	transactionSearchConditions,
} from './../utils/getPaginatedPayload.js';

export const getAdmins = async (req, res) => {
	try {
		const admins = await User.find({ role: 'ADMIN' }).select('-password');
		res.status(200).json(admins);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
export const getUsers = async (req, res) => {
	const page = +(req.query.page || 1);
	const limit = +(req.query.limit || 10);
	const query = req.query.query?.toLowerCase(); // search query
	const inc = req.query.inc?.split(','); // only include fields mentioned in this query

	try {
		let filter = { role: 'USER' };

		if (query) {
			const searchConditions = userSearchConditions(query);
			filter = { ...filter, ...searchConditions };
		}

		const options = {
			lean: true,
			skip: (page - 1) * limit,
			limit: limit,
			select: inc ? inc.join(' ') : '-password -refreshToken',
		};

		const users = await User.find(filter, null, options);
		const totalItems = await User.countDocuments(filter);

		res.status(200).json({
			data: getPaginatedPayload(users, page, limit, totalItems),
			message: 'Users fetched successfully',
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Failed to fetch users', success: false });
	}
};
export const getUser = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.params.userId }).select(
			'-password'
		);
		if (!user) {
			return res.status(400).json({ message: 'Invalid user id' });
		}
		const account = await Account.findOne({
			userId: user._id,
		}).select('-pin');
		const budget = await Budget.find({ userId: user._id });
		const vault = await Vault.find({ userId: user._id });
		res.status(200).json({
			user,
			account,
			budget,
			vault,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
export const updateUser = async (req, res) => {
	try {
		// Define the fields that users are disallowed to update here
		const disAllowedFields = ['password', 'role'];

		// Check if request body contains only allowed fields
		const updates = Object.keys(req.body);
		const isValidOperation = updates.every(
			(update) => !disAllowedFields.includes(update)
		);

		if (!isValidOperation) {
			return res.status(400).json({ error: 'Cannot update password or role' });
		}
		const user = await User.findOneAndUpdate(
			{ _id: req.params.id },
			{ ...req.body },
			{
				new: true,
				runValidators: true,
			}
		).select('-password');
		if (!user) {
			return res.status(400).json({ message: 'Invalid user id' });
		}
		res.status(200).json({
			data: user,
			message: 'User updated succefully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server error' });
	}
};
export const getTransactions = async (req, res) => {
	const page = +(req.query.page || 1);
	const limit = +(req.query.limit || 10);
	const query = req.query.query?.toLowerCase(); // search query
	const inc = req.query.inc?.split(','); // only include fields mentioned in this query

	try {
		let filter;

		if (query) {
			const searchConditions = transactionSearchConditions(query);
			filter = { ...filter, ...searchConditions };
		}

		const options = {
			lean: true,
			skip: (page - 1) * limit,
			limit: limit,
			select: inc ? inc.join(' ') : '-balance',
		};

		const transactions = await Transaction.find(filter, null, options);
		const totalItems = await Transaction.countDocuments(filter);

		res.status(200).json({
			data: getPaginatedPayload(transactions, page, limit, totalItems),
			message: 'Transactions fetched successfully',
			success: true,
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: 'Failed to fetch transactions', success: false });
	}
};
export const getTransaction = async (req, res) => {
	try {
		const { id } = req.params;
		const transaction = await Transaction.findById(id);
		if (!transaction) {
			return res.status(401).json({ message: 'Invalid transaction id' });
		}
		res.status(200).json(transaction);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const createTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findById({
			userId: req.params.id,
			type: '',
			category: 'service',
		});
		if (!transaction) {
			return res.status(401).json({ message: 'Invalid transaction id' });
		}
		res.status(200).json(transaction);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const updateTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findOneAndUpdate(
			{ _id: req.params.id },
			req.body,
			{ new: true }
		);
		if (!transaction) {
			return res.status(401).json({ message: 'Invalid transaction id' });
		}
		res.status(200).json(transaction);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
