const { Pool } = require('pg');

const pool = new Pool({
    user: 'learning',
    host: 'localhost',
    database: 'quizdb',
    password: 'passwor1234',
    port: 5432,
});

exports.getQuestion = async (req, res) => {
    const id = req.params.id;
    
    try {
        const question = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
        const options = await pool.query('SELECT o.* FROM options o INNER JOIN questions_options qo ON o.id = qo.option_id WHERE qo.question_id = $1', [id]);
        
        res.json({
            question: question.rows[0],
            options: options.rows
        });
    } catch (error) {
        res.status(500).json({ error: "Database error." });
    }
};

exports.checkAnswer = async (req, res) => {
    const id = req.params.id;
    const userAnswer = req.body.selectedOption;

    try {
        const result = await pool.query('SELECT correctAnswer FROM questions WHERE id = $1', [id]);
        const correctAnswer = result.rows[0].correctanswer;
        
        if (userAnswer == correctAnswer) {
            res.json({ isCorrect: true });
        } else {
            res.json({ isCorrect: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error." });
    }
};
