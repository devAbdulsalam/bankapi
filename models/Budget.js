import mongoose, { Schema } from 'mongoose';

const BudgetSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			require: true,
		},
		name: String,
		balance: Number,
		type: String,
		cycle: String,
		frequency: String,
		startDate: {
			type: Date,
			require: true,
		},
		endDate: {
			type: Date,
			require: true,
		},
	},
	{ timestamps: true }
);

const Budget = mongoose.model('Budget', BudgetSchema);
export default Budget;
