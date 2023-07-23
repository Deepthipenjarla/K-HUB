const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const ExcelModel = require('./excel');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/excel_db', {
  useNewUrlParser: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

const app = express();
app.use(cors());

// Upload route
app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    // Read the uploaded file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Save JSON data to MongoDB using Mongoose
    await ExcelModel.insertMany(jsonData);

    console.log('Data saved to MongoDB');
    res.status(200).json({ success: true, message: 'Data saved to MongoDB' });
  } catch (err) {
    console.error('Error saving to MongoDB', err);
    res.status(500).json({ success: false, message: 'Failed to save to MongoDB' });
  }
});


// Helper function to calculate the count of repeated values in an array
function countRepeatedValues(arr) {
  const countMap = {};
  for (const item of arr) {
    countMap[item] = (countMap[item] || 0) + 1;
  }

  // Filter out values with a count of 1
  for (const key in countMap) {
    if (countMap[key] === 1) {
      delete countMap[key];
    }
  }

  return countMap;
}

// Route to get counts of repeated values in each column stored in the MongoDB
app.get('/column-counts', async (req, res) => {
  try {
    // Fetch all documents from the MongoDB collection excluding the _id field
    const allDocuments = await ExcelModel.find({}, { _id: 0 });

    // Prepare an object to store counts of repeated values for each column
    const columnCounts = {};

    // Prepare an object to store unique values for each column
    const uniqueValues = {};

    // Iterate over the fetched documents and count repeated values for each column
    for (const document of allDocuments) {
      const docObject = document.toObject(); // Convert the document to a plain JavaScript object
      for (const [column, value] of Object.entries(docObject)) {
        if (!columnCounts[column]) {
          columnCounts[column] = [];
          uniqueValues[column] = new Set();
        }
        columnCounts[column].push(value);
        uniqueValues[column].add(value);
      }
    }

    // Calculate the count of repeated values for each column and exclude unique values
    for (const [column, valuesArray] of Object.entries(columnCounts)) {
      const countMap = countRepeatedValues(valuesArray);
      if (Object.keys(countMap).length === 0) {
        delete columnCounts[column]; // Exclude empty objects
      } else {
        columnCounts[column] = countMap;
      }
    }

    console.log('Column counts:', columnCounts);
    res.status(200).json(columnCounts);
  } catch (err) {
    console.error('Error fetching data from MongoDB', err);
    res.status(500).send('Failed to fetch data from MongoDB');
  }
});




// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 3000');
});
