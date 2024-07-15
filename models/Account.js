import mongoose, { Schema } from 'mongoose';

const AccountSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		balance: {
			type: Number,
			default: 100,
		},
		name: {
			type: String,
			required: true,
		},
		totalSavings: { type: Number, default: 0 },
		savingsPercentage: { type: Number, required: true },
		dailySpending: { type: Number, default: 0 },
		lastSavingsDate: { type: Date, default: Date.now },
		stars: { type: Number, default: 0 },
		level: { type: String, default: 'Beginner' },
		rank: { type: String, default: 'Bronze' },
		pin: {
			type: String,
			min: 4,
		},
		isDefaultPin: {
			type: Boolean,
			default: true,
		},
		savingsPercentage: {
			type: Number,
			default: 0,
		},
		isAutosavePercentage: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Account = mongoose.model('Account', AccountSchema);
export default Account;
