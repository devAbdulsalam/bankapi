import mongoose, { Schema } from 'mongoose';

const SavingGoalSchema = new mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	goalAmount: { type: Number, required: true, default: 0 },
	currentAmount: { type: Number, default: 0 },
});

const SavingGoal = mongoose.model('SavingGoal', SavingGoalSchema);
export default SavingGoal;
