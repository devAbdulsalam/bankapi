import mongoose, { Schema } from 'mongoose';
const SavingSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			default: 0,
		},
		name: String,
		balance: Number,
		percent: Number,
		type: String,
		cycle: String,
		frequency: String,
		startDate: {
			type: Date,
			require: true,
			default: Date.now(),
		},
		endDate: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Saving = mongoose.model('Saving', SavingSchema);
export default Saving;
