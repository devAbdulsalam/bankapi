import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// import validator from 'validator';
const UserSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
			min: 2,
			max: 100,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 5,
		},
		phone: {
			type: String,
			min: 10,
			unique: true,
		},
		avatar: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		gender: String,
		role: {
			type: String,
			enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
			default: 'USER',
		},
		isVerified: false,
		isEmailVerified: false,
		loginType: {
			type: String,
			enum: ['GOOGLE', 'GITHUB', 'EMAIL_PASSWORD'],
			default: 'EMAIL_PASSWORD',
		},
		refreshToken: String,
		emailVerificationToken: {
			type: String,
		},
		emailVerificationExpiry: {
			type: Date,
		},
	},
	{ timestamps: true }
);

// static signup method
UserSchema.statics.signup = async function (name, email, password) {
	// //Validator for strong password
	// if(!validator.isStrongPassword(password)){
	//     throw Error('Input a strong password')
	// }
	if (!(password.length > 4)) {
		throw new Error('Input a strong password');
	}

	const user = await this.create({ name, email, password: hash });
	return user;
};

// static login method
UserSchema.statics.login = async function (phone, password) {
	if (!phone && !password) {
		throw Error('All fields must be filled');
	}

	let user = await this.findOne({ phone });

	if (!user) {
		throw Error('email or password is incorrect!!');
	}

	const match = bcrypt.compare(password, user.password);
	if (!match) {
		throw Error('email or password is incorrect!');
	}

	return user;
};
// check password
UserSchema.methods.checkPassword = async function (password) {
	const match = await bcrypt.compare(password, this.password);
	return match;
};

// //change password
UserSchema.methods.hashpsw = async function (password) {
	// if (
	// 	!validator.isStrongPassword(password, {
	// 		minLength: 6,
	// 		minLowercase: 1,
	// 		minUppercase: 1,
	// 		// minNumbers: 1,
	// 		// minSymbols: 1,
	// 	})
	// ) {
	// 	throw Error('Input a strong password');
	// }

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

// module.exports = mongoose.model('User', userSchema);

const User = mongoose.model('User', UserSchema);
export default User;
