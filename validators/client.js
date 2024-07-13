import { body } from 'express-validator';
// import { AvailableUserRoles } from '../constants.js';

export const cardValidator = [
	body('cvv')
		.trim()
		.notEmpty()
		.withMessage('cvv Number is required')
		.isLength({ min: 3, max: 3 })
		.withMessage('Cvv Number must be at lease 3 characters long'),
	body('number')
		.trim()
		.notEmpty()
		.withMessage('Number is required')
		.isLowercase()
		.withMessage('Number must be lowercase')
		.isLength({ min: 12 })
		.withMessage('Number must be at lease 12 characters long'),
	body('name')
		.trim()
		.notEmpty()
		.withMessage('name is required')
		.isLength({ min: 3 })
		.withMessage('name must be at lease 3 characters long'),
	body('expire')
		.trim()
		.notEmpty()
		.withMessage('Expired date is required')
		.isLength({ min: 4 })
		.withMessage('Invalid expired date'),
	,
];
export const accountValidator = [
	body('email').trim().notEmpty().withMessage('Email is required'),
	body('number')
		.trim()
		.notEmpty()
		.withMessage('Number is required')
		.isLowercase()
		.withMessage('Number must be lowercase')
		.isLength({ min: 12 })
		.withMessage('Number must be at lease 12 characters long'),
	body('name')
		.trim()
		.notEmpty()
		.withMessage('name is required')
		.isLength({ min: 3 })
		.withMessage('name must be at lease 3 characters long'),
	body('expire')
		.trim()
		.notEmpty()
		.withMessage('Expired date is required')
		.isLength({ min: 4 })
		.withMessage('Invalid expired date'),
	,
];
export const vaultValidator = [
	body('email').trim().notEmpty().withMessage('Email is required'),
	body('number')
		.trim()
		.notEmpty()
		.withMessage('Number is required')
		.isLowercase()
		.withMessage('Number must be lowercase')
		.isLength({ min: 12 })
		.withMessage('Number must be at lease 12 characters long'),
	body('name')
		.trim()
		.notEmpty()
		.withMessage('name is required')
		.isLength({ min: 3 })
		.withMessage('name must be at lease 3 characters long'),
	body('expire')
		.trim()
		.notEmpty()
		.withMessage('Expired date is required')
		.isLength({ min: 4 })
		.withMessage('Invalid expired date'),
	,
];
export const budgetValidator = [
	body('email').trim().notEmpty().withMessage('Email is required'),
	body('number')
		.trim()
		.notEmpty()
		.withMessage('Number is required')
		.isLowercase()
		.withMessage('Number must be lowercase')
		.isLength({ min: 12 })
		.withMessage('Number must be at lease 12 characters long'),
	body('name')
		.trim()
		.notEmpty()
		.withMessage('name is required')
		.isLength({ min: 3 })
		.withMessage('name must be at lease 3 characters long'),
	body('expire')
		.trim()
		.notEmpty()
		.withMessage('Expired date is required')
		.isLength({ min: 4 })
		.withMessage('Invalid expired date'),
	,
];
