const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
        unique: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
    Todo: Todo
}