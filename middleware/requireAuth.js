import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Account from '../models/Account.js';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';

export const requireAuth = async (req, res, next) => {
	// verify user is authenticated
	const { authorization } = req.headers;
	const token =
		req.cookies?.accessToken ||
		authorization?.split(' ')[1] ||
		req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'Authorization token required' });
	}
	try {
		const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findOne({ _id }).select('-password -refreshToken');
		if (!user) {
			return res.status(401).json({ error: 'Invalid access token' });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: 'Request is not authorized' });
	}
};

export const verifyPermission = (roles = []) =>
	asyncHandler(async (req, res, next) => {
		if (!req.user?._id) {
			throw new Error(401, 'Unauthorized request');
		}
		if (roles.includes(req.user?.role)) {
			next();
		} else {
			throw new Error(403, 'You are not allowed to perform this action');
		}
	});

export const pinVerification = async (req, res, next) => {
	const { pin } = req.body;
	const userId = req.user._id;

	try {
		const account = await Account.findOne(userId);
		if (!account) {
			return res.status(404).json({ error: 'Account not found' });
		}
		// Verify PIN
		const match = await bcrypt.compare(pin, account.pin);
		if (!match) {
			return res.status(401).json({ message: 'Incorrect PIN.' });
		}
		next();
	} catch (err) {
		res.status(400).send(err);
	}
};
