const mongoose = require('mongoose');
const {Schema} = mongoose;

const stockSchema = new Schema({
    symbol: { type: String, required: true },
    likes: { type: [String], required: true }
})