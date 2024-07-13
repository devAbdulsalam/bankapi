import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Account from './../models/Account.js';
import Budget from './../models/Budget.js';
import Vault from './../models/Vault.js';

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
