import mongoose, { Schema } from 'mongoose';

const ReferralSchema = new mongoose.Schema({
	code: { type: String, required: true, unique: true },
	referredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	rewardsEarned: { type: Number, default: 0 },
});
const Referral = mongoose.model('Referral', ReferralSchema);
export default Referral;
