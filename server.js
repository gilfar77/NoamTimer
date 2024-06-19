const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE meeting (id INTEGER PRIMARY KEY, lastMeetingDate INTEGER)");
    db.run("INSERT INTO meeting (lastMeetingDate) VALUES (?)", [new Date('June 10, 2024 16:00:00').getTime()]);
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/lastMeetingDate', (req, res) => {
    db.get("SELECT lastMeetingDate FROM meeting WHERE id = 1", (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({lastMeetingDate: row.lastMeetingDate});
    });
});

app.post('/updateMeetingDate', (req, res) => {
    const { lastMeetingDate } = req.body;
    db.run("UPDATE meeting SET lastMeetingDate = ? WHERE id = 1", [lastMeetingDate], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({ message: 'Date updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
