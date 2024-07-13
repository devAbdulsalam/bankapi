import express from 'express';
const router = express.Router();
// const requireAuth = require('../middleware/requireAuth');
import {
	createOrder,
	getOrder,
	getSingleOrder,
	getOrders,
	updateOrder,
	shipOrder,
	deliverOrder,
	deleteOrder,
} from '../controllers/order.js';

// // create order
router.post('/create', createOrder);
// get user order
router.get('/', getOrder);
// get single order
router.get('/:id', getSingleOrder);
// get all orders
router.post('/get', getOrders);
// get update order
router.patch('/update-order', updateOrder);
// get update order
router.patch('/ship-order', shipOrder);
router.patch('/deliver-order', deliverOrder);

router.patch('/delete', deleteOrder);

export default router;
