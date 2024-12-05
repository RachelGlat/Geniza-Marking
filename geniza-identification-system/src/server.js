const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/file', (req, res) => {
  const filePath = 'C:/Users/tichnut/Desktop/newFile.txt';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file.');
      return;
    }
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
