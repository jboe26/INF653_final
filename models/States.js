const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    stateCode: { type: String, required: true, unique: true },
    funfacts: [String] // Array of fun facts
});

module.exports = mongoose.model('State', StateSchema);
