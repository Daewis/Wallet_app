import pool from '../config/db.js';

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json(result.rows); 
  } catch (error) {
    console.error("Error getting transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function createTransactions(req,res) {
    try {
        const{title, amount, category, user_id} = req.body;

        if(!title || !category || !user_id || amount === undefined) {
            return res.status(400).json({error: 'All fields are required fields'});
        }

        await pool.query(
            'INSERT INTO transactions (user_id, title, amount, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, title, amount, category]
        );

        res.status(201).json({message: 'Transaction created successfully'});

    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export async function deleteTransactions(req,res) {
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Invalid Transaction ID" });
        }

        const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );

        if(result.rowCount === 0){
            return res.status(404).json({message: 'Transaction not found'})
        }
        res.status(200).json({message: 'Transaction deleted successfully'})

    } catch (error) {
        console.error("Error deleting transaction:", error);
    res.status(500).json({ error: 'Internal server error' });
    }
};

export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT 
                COALESCE(SUM(amount), 0) AS balance,
                COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS expenses
            FROM transactions
            WHERE user_id = $1`,
            [userId]
        );

        const row = result.rows[0];
        
        res.status(200).json({
            balance: Number(row.balance),
            income: Number(row.income),
            expenses: Number(row.expenses)
        });

    } catch (error) {
        console.error("Error getting transaction summary:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};