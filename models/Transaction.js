import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiverId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		amount: {
			type: Number,
			required: true,
		},
		balance: Number,
		account: {
			type: Number,
			required: true,
		},
		accountName: {
			type: String,
			required: true,
		},
		bank: {
			type: String,
			default: 'savapp',
		},
		type: {
			required: true,
			type: String,
			enum: ['CREDIT', 'DEBIT'],
			default: 'CREDIT',
		},
		status: {
			required: true,
			type: String,
			enum: ['SUCCESS', 'PENDING', 'FAILED'],
			default: 'SUCCESS',
		},
		decription: String,
		category: String,
		naration: String,
	},
	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
