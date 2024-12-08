const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const filePath = path.join(__dirname, 'messages.json');

app.post('/submit', (req, res) => {
    const { name, message } = req.body;

    let messages = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        messages = JSON.parse(data);
    }

    messages.push({ name, message, timestamp: new Date() });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    res.send('<h1>Message received. Thank you for reaching out!</h1>');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
