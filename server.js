const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const dataFilePath = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(express.static('public'));

// Load last meeting date from JSON file
function loadLastMeetingDate() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data).lastMeetingDate;
    } else {
        const initialDate = new Date('June 10, 2024 16:00:00').getTime();
        saveLastMeetingDate(initialDate);
        return initialDate;
    }
}

// Save last meeting date to JSON file
function saveLastMeetingDate(date) {
    const data = { lastMeetingDate: date };
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

app.get('/lastMeetingDate', (req, res) => {
    const lastMeetingDate = loadLastMeetingDate();
    res.json({ lastMeetingDate });
});

app.post('/updateMeetingDate', (req, res) => {
    const { lastMeetingDate } = req.body;
    saveLastMeetingDate(lastMeetingDate);
    res.json({ message: 'Date updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
