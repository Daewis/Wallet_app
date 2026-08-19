import express from 'express';

import {getTransactionsByUserId} from '../controllers/transactionsController.js';
import {createTransactions} from '../controllers/transactionsController.js';
import {deleteTransactions} from '../controllers/transactionsController.js';
import {getSummaryByUserId} from '../controllers/transactionsController.js';

const router = express.Router();

router.post('/', createTransactions);
router.get('/summary/:userId', getSummaryByUserId);
router.get('/:userId', getTransactionsByUserId);
router.delete('/:id', deleteTransactions);




export default router;