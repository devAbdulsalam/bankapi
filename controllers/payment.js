import axios from 'axios';
const API_KEY = 'MK_TEST_VKMVS929KW';
const SECRET_KEY = 'X3500BXPGW51TW1K1G3DPZHABAPW1K7B';

export const getToken = async () => {
	const encodedCredentials = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString(
		'base64'
	);
	const authHeader = `Basic ${encodedCredentials}`;

	try {
		const response = await axios.post(
			'https://sandbox.monnify.com/api/v1/auth/login',
			{},
			{
				headers: {
					Authorization: authHeader,
				},
			}
		);

		if (response.data.requestSuccessful) {
			return response.data.responseBody.accessToken;
		} else {
			throw new Error('Failed to get access token');
		}
	} catch (error) {
		console.error('Error getting access token:', error);
		throw error;
	}
};

export const verifyAccount = async (req, res) => {
	try {
		const { account, bank } = req.body;
		const accessToken = await getToken();
		const response = await fetch(
			`https://sandbox.monnify.com/api/v1/disbursements/account/validate?accountNumber=${account}&bankCode=${bank}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`, // Replace with your actual Bearer token
				},
			}
		);
		const data = await response.json();
		console.log('verify data', data.responseBody);
		if (data.requestSuccessful) {
			return res.status(200).json(data.responseBody);
		} else {
			return res.status(401).json({ message: data.responseMessage });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error:
				error?.message ||
				error?.data?.responseMessage ||
				error?.responseMessage ||
				error,
		});
	}
};
