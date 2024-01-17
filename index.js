const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public')); 


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const buffer = req.file.buffer;
  const csvData = buffer.toString('utf-8');

  csv({ headers: true })
    .fromString(csvData)
    .on('data', (row) => {
      console.log(row);
    })
    .on('end', () => {
      res.send('File uploaded and processed successfully.');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
