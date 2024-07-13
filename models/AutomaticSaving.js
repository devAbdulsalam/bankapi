import mongoose, { Schema } from 'mongoose';

const AutomaticSavingSchema = new mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	amount: { type: Number, required: true },
	frequency: {
		type: String,
		enum: ['daily', 'weekly', 'monthly'],
		required: true,
	},
});

const AutomaticSaving = mongoose.model(
	'AutomaticSaving',
	AutomaticSavingSchema
);
export default AutomaticSaving;
