import mongoose, { Schema } from 'mongoose';

const CardSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: String,
		number: String,
		expire: String,
		cvv: String,
	},
	{ timestamps: true }
);

const Card = mongoose.model('Card', CardSchema);
export default Card;
