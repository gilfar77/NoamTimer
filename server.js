const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const dataFilePath = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function initializeJsonFile() {
    if (!fs.existsSync(dataFilePath)) {
        const initialDate = new Date('June 10, 2024 16:00:00').getTime();
        saveLastMeetingDate(initialDate);
        console.log(`Initialized data.json with date: ${initialDate}`);
    } else {
        console.log('data.json already exists.');
    }
}

function loadLastMeetingDate() {
    const data = fs.readFileSync(dataFilePath);
    const lastMeetingDate = JSON.parse(data).lastMeetingDate;
    console.log(`Loaded lastMeetingDate: ${lastMeetingDate}`);
    return lastMeetingDate;
}

function saveLastMeetingDate(date) {
    const data = { lastMeetingDate: date };
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
    console.log(`Saved lastMeetingDate: ${date}`);
}

initializeJsonFile();

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
