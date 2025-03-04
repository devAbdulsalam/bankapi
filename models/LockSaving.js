import mongoose, { Schema } from 'mongoose';
const LockedSavingSchema = new mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	amount: { type: Number, required: true, default: 0 },
	lockInPeriod: {
		type: String,
		required: true,
	},
	startDate: { type: Date, default: Date.now },
	endDate: { type: Date, required: true },
	penaltyRate: { type: Number, required: true },
});

const LockedSaving = mongoose.model('LockedSaving', LockedSavingSchema);
export default LockedSaving;
