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

app.get('/messages', (req, res) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const messages = JSON.parse(data);

        let tableRows = messages.map((msg) => {
            return `
                <tr>
                    <td>${msg.name}</td>
                    <td>${msg.message}</td>
                    <td>${new Date(msg.timestamp).toLocaleString()}</td>
                </tr>
            `;
        }).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Messages</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        padding: 0;
                        background-color: #f4f4f9;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        padding: 10px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1>Submitted Messages</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Message</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        res.send(htmlContent);
    } else {
        res.status(404).send('<h1>No messages found.</h1>');
    }
});

