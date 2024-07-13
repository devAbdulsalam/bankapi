import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getDashboardStats = async (req, res) => {
	try {
		// hardcoded values
		// const currentMonth = "November";
		// const currentYear = 2021;
		// const currentDay = "2021-11-15";

		/* Recent Transactions */
		const transactions = await Transaction.find()
			.limit(50)
			.sort({ createdOn: -1 });
		const totalCustomers = await User.find({ role: 'user' });

		res.status(200).json({
			totalCustomers,
			transactions,
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
