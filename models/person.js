const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

mongoose.connect(url).then(result => {
    console.log("Connection MongoDB")
}).catch(error => {
    console.log("Error connection MongoDB", error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^\{2,3}-\d+$/.test(v)
            },
            message: (props) => `${props.value} no es un número de teléfono valido`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)