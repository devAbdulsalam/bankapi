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

export const getClient = async (req, res) => {
	try {
		const user = req.user;
		let account;
		account = await Account.findOne({ userId: user._id });
		if (!account) {
			account = await Account.create({ userId: user._id, balance: 100 });
		}
		const transactions = await Transaction.find({ userId: user._id });
		const data = {
			account,
			transactions,
		};
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const createClient = async (req, res) => {
	try {
		const account = await Account.Create({ userId: req.user._id });
		const data = account;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getBalance = async (req, res) => {
	try {
		const account = await Account.findOne({ userId: req.user._id }).select(
			'balance updatedAt'
		);
		const data = account;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const changeDefaultPin = async (req, res) => {
	try {
		const { oldPin, newPin } = req.body;
		const account = await Account.findOne({ userId: req.user._id }).select(
			'pin'
		);

		const match = await verifyHash(oldPin, account.pin);
		if (!match) {
			return res.status(401).json({ message: 'incorrect old pin' });
		}
		account.pin = await hash(newPin);
		const data = await account.save();

		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const changePin = async (req, res) => {
	try {
		const { pin } = req.body;
		const hash = await hash(pin);
		const account = await Account.findOneAndUpdate(
			{ userId: req.user._id },
			{ pin: hash, isDefaultPin: false },
			{ new: true }
		);
		const data = account;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const addCard = async (req, res) => {
	try {
		const { name, number, cvv, expire } = req.body;
		const userId = req.user._id;
		const { encryptionKey } = await getEncryptionKey(userId);
		const encryptedNumber = encryptData(number, encryptionKey);
		const encryptedCVV = encryptData(cvv, encryptionKey);
		const data = await Card.create({
			userId: req.user._id,
			name,
			number: encryptedNumber,
			cvv: encryptedCVV,
			expire,
		});
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};
export const getCard = async (req, res) => {
	try {
		const userId = req.user._id;
		// Retrieve user's encryption key
		const { encryptionKey } = await getEncryptionKey(userId.toString());

		// Fetch card data from the database
		const card = await Card.findOne({ _id: req.params.id });

		if (!card) {
			return res.status(404).json({ message: 'Card not found' });
		}
		// Decrypt card information using the user's encryption key
		const decryptedNumber = decryptData(card.number, encryptionKey);
		const decryptedCVV = decryptData(card.cvv, encryptionKey);

		// Construct response object with decrypted card information
		const decryptedCard = {
			name: card.name,
			number: decryptedNumber,
			cvv: decryptedCVV,
			expire: card.expire,
		};

		res.status(200).json(decryptedCard);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
export const getCards = async (req, res) => {
	try {
		const card = await Card.find({ userId: req.user._id });
		const data = card;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const deleteCard = async (req, res) => {
	try {
		const card = await Card.findByIdAndDelete({ _id: req.params.id });
		res.status(200).json({ data: card, message: 'Card deleted successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const deleteCards = async (req, res) => {
	try {
		const result = await Card.deleteMany({ userId: req.user._id });
		if (result.deletedCount > 0) {
			return res
				.status(200)
				.json({ message: 'All Cards deleted successfully' });
		} else {
			return res.status(404).json({ message: 'No cards found for deletion' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const addBudget = async (req, res) => {
	try {
		const userId = req.user._id;
		const { amount, type, startDate, endDate } = req.body;
		const account = await Account.findOne({ userId });
		if (!account) {
			return res.status(404).json({ message: 'User account not found' });
		}
		// Check if the account balance is sufficient
		if (account.balance < amount) {
			return res.status(400).json({ message: 'Insufficient account balance' });
		}

		// Check if end date is greater than start date
		if (endDate <= startDate) {
			return res
				.status(400)
				.json({ message: 'End date must be greater than start date' });
		}
		const budget = await Budget.create({
			userId,
			amount,
			balance: amount,
			type,
			startDate,
			endDate,
		});
		const data = budget;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getBudgets = async (req, res) => {
	try {
		const budgets = await Budget.find({ userId: req.user._id });
		const data = budgets;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getBudget = async (req, res) => {
	try {
		const { id } = req.params;
		const budget = await Budget.findOne({ _id: id });
		if (!budget) {
			res.status(400).json({ message: 'Invalid budget id' });
		}
		const data = budget;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const debitBudget = async (req, res) => {
	try {
		const { id } = req.params;
		const vault = await Budget.findByIdAndUpdate(
			{ _id: id },
			{ ...req.body },
			{ new: true }
		);
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const deleteBudget = async (req, res) => {
	try {
		const { id } = req.params;
		const budget = await Budget.findByIdAndDelete({ _id: id });
		if (!budget) {
			res.status(400).json({ message: 'Invalid budget id' });
		}
		const data = budget;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const addVault = async (req, res) => {
	try {
		const vault = await Vault.create({ userId: req.user._id, ...req.body });
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getVault = async (req, res) => {
	try {
		const vault = await Vault.findById({ _id: req.params.id });
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getVaults = async (req, res) => {
	try {
		const vault = await Vault.find({ userId: req.user._id });
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const debitVault = async (req, res) => {
	try {
		const { id } = req.params;
		const vault = await Vault.findByIdAndUpdate(
			{ _id: id },
			{ ...req.body },
			{ new: true }
		);
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const deleteVault = async (req, res) => {
	try {
		const vault = await Vault.findOneAndDelete({ _id: req.params.id });
		const data = vault;
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getBeneficiaries = async (req, res) => {
	try {
		const data = await Beneficiary.find({ userId: req.user.id });
		if (!data) {
			return res.status(400).json({ message: 'Invalid user id' });
		}
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const deleteBeneficiaries = async (req, res) => {
	try {
		const data = await Beneficiary.findById({ _id: req.params.id });
		if (!data) {
			return res.status(400).json({ message: 'Invalid user id' });
		}
		res.status(200).json(data);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getTransactions = async (req, res) => {
	const page = +(req.query.page || 1);
	const limit = +(req.query.limit || 10);
	const query = req.query.query?.toLowerCase(); // search query
	const inc = req.query.inc?.split(','); // only include fields mentioned in this query

	try {
		let filter = { userId: req.user._id };

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
export const postTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.create({
			...req.body,
		});
		let beneficiary;

		beneficiary = await Beneficiary.findOneAndUpdate({
			userId: req.body.userId,
			recent: Date.now(),
		});
		// create beneficiary if the userId does not exist
		if (!beneficiary) {
			beneficiary = await Beneficiary.create({
				...req.body,
				recent: Date.now(),
			});
		}
		res.status(200).json({ transaction, benficiary });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getTransaction = async (req, res) => {
	try {
		const id = req.params.id;
		const transaction = await Transaction.findById(id);
		if (!transaction) {
			res.status(400).json({
				message: 'Invalid transaction id',
			});
		}
		res.status(200).json({
			transaction,
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// export const getGeography = async (req, res) => {
//   try {
//     const users = await User.find();

//     const mappedLocations = users.reduce((acc, { country }) => {
//       const countryISO3 = getCountryIso3(country);
//       if (!acc[countryISO3]) {
//         acc[countryISO3] = 0;
//       }
//       acc[countryISO3]++;
//       return acc;
//     }, {});

//     const formattedLocations = Object.entries(mappedLocations).map(
//       ([country, count]) => {
//         return { id: country, value: count };
//       }
//     );

//     res.status(200).json(formattedLocations);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };
