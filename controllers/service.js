import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';

const bingPayUrl = 'https://bingpay.ng/api/v1';
const bingPaytoken = '1dd501141dffd9d68f254b241f05871b8f10754c90f4832ad9';
var config = {
	method: 'get',
	maxBodyLength: Infinity,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${bingPaytoken}`,
	},
};
var postConfig = {
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${bingPaytoken}`,
	},
};
export const getBalance = async (req, res) => {
	try {
		const { data } = await axios(`${bingPayUrl}/self/balance`, config);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const getUtilityServices = async (req, res) => {
	try {
		const { data } = await axios(`${bingPayUrl}/all-services`, config);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const getUtility = async (req, res) => {
	try {
		const { data } = await axios(
			`${bingPayUrl}/services/${req.params.type}`,
			config
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const ValidateService = async (req, res) => {
	const { service_id, customer_id } = req.body;
	const info = { service_id, customer_id };
	try {
		const { data } = await axios.post(
			`${bingPayUrl}/validate-service`,
			info,
			postConfig
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const purchaseBill = async (req, res) => {
	const { service_id, customer_id, variation, amount } = req.body;
	const info = { service_id, customer_id, variation, amount };
	try {
		const { data } = await axios.post(
			`${bingPayUrl}/purchase-bill`,
			info,
			postConfig
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const getNetworks = async (req, res) => {
	try {
		const { data } = await axios(`${bingPayUrl}/all-networks`, config);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const verifyPhone = async (req, res) => {
	const { phone } = req.body;
	try {
		const { data } = await axios.post(
			`${bingPayUrl}/verify/phone`,
			{ phone, country: 'NG' },
			postConfig
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const buyData = async (req, res) => {
	const { phone, plan, network } = req.body;
	try {
		const { data } = await axios.post(
			`${bingPayUrl}/buy-data`,
			{ phone, plan, network },
			postConfig
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const buyAirtime = async (req, res) => {
	const { phone, plan, network } = req.body;
	try {
		const { data } = await axios.post(
			`${bingPayUrl}/buy-airtime`,
			{ phone, plan, network },
			postConfig
		);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const getBanks = async (req, res) => {
	try {
		// var config = {
		// 	method: 'get',
		// 	maxBodyLength: Infinity,
		// 	url: 'https://bingpay.ng/api/v1/all-banks',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${bingPaytoken}`,
		// 	},
		// };
		const { data } = await axios(`${bingPayUrl}/all-banks`, config);
		console.log('data.data.length', data.data.length);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		throw new ApiError(400, error);
	}
};
export const verifyBVN = async (req, res) => {
	const { firstname, lastname, phone, bvn } = req.body;
	const data = { firstname, lastname, phone, bvn };
	axios
		.post('https://bingpay.ng/api/v1/verify/bvn', data, postConfig)
		.then(function (response) {
			res.status(200).json(response.data);
		})
		.catch(function (error) {
			console.log(error);
			throw new ApiError(400, error);
		});
};
export const verifyNIN = async (req, res) => {
	const { firstname, lastname, phone, bvn } = req.body;
	const data = { firstname, lastname, phone, nin };
	axios
		.post('https://bingpay.ng/api/v1/verify/nin', data, postConfig)
		.then(function (response) {
			res.status(200).json(response.data);
		})
		.catch(function (error) {
			console.log(error);
			throw new ApiError(400, error);
		});
};
