import mongoose, { Schema } from 'mongoose';

const VaultSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: String,
		type: String,
		cycle: String,
		frequency: String,
	},
	{ timestamps: true }
);

const Vault = mongoose.model('Vault', VaultSchema);
export default Vault;
