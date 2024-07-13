const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Generate referral code for a new user
// router.post('/generateReferralCode/:userId', async (req, res) => {
export const generateReferralCode = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send('User not found');
		}

		// Generate a unique referral code
		const referralCode = generateReferralCode();

		// Add the referral code to the user's profile
		user.referrals.push({ code: referralCode });

		await user.save();
		res.status(200).send({ referralCode });
	} catch (err) {
		res.status(400).send(err);
	}
}

// Register referral and award rewards
// router.post(
// 	'/registerReferral/:referralCode/:referredUserId',
export const registerReferral =	async (req, res) => {
		try {
			const { referralCode, referredUserId } = req.params;

			const referringUser = await User.findOne({
				'referrals.code': referralCode,
			});
			if (!referringUser) {
				return res.status(404).send('Referral code not found');
			}

			const referredUser = await User.findById(referredUserId);
			if (!referredUser) {
				return res.status(404).send('Referred user not found');
			}

			// Check if the referred user has already been referred
			const alreadyReferred = referringUser.referrals.some((ref) =>
				ref.referredUsers.includes(referredUser._id)
			);
			if (alreadyReferred) {
				return res.status(400).send('User has already been referred');
			}

			// Register referral
			referringUser.referrals
				.find((ref) => ref.code === referralCode)
				.referredUsers.push(referredUser._id);

			// Award rewards (example: $10 for both referring and referred users)
			referringUser.balance += 10;
			referredUser.balance += 10;

			await referringUser.save();
			await referredUser.save();

			res.status(200).send('Referral registered successfully');
		} catch (err) {
			res.status(400).send(err);
		}
	}


