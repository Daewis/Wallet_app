import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ user_id: userId }).sort({ created_at: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createTransactions(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ error: 'All fields are required fields' });
    }

    await Transaction.create({ user_id, title, amount, category });

    res.status(201).json({ message: 'Transaction created successfully' });

  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteTransactions(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const result = await Transaction.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const result = await Transaction.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          balance: { $sum: '$amount' },
          income: {
            $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] }
          },
          expenses: {
            $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] }
          }
        }
      }
    ]);

    const summary = result[0] || { balance: 0, income: 0, expenses: 0 };

    res.status(200).json({
      balance: Number(summary.balance),
      income: Number(summary.income),
      expenses: Number(summary.expenses)
    });

  } catch (error) {
    console.error("Error getting transaction summary:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}