const mongoose = require('mongoose')
const db = mongoose.connect(process.env.db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

module.exports = db;