const mongoose = require('mongoose');

const excelSchema = new mongoose.Schema({}, { strict: false });

const ExcelModel = mongoose.model('Excel', excelSchema);

module.exports = ExcelModel;
