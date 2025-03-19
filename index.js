const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

morgan.token("body", (req) => (req.method === "POST" ? JSON.stringify(req.body) : ""));
app.use(morgan(":method :url :status :res[content-length] - :response-time - ms :body"));

const requestLogger = (request, response, next) => {
    console.log("Method", request.method)
    console.log("Path", request.path)
    console.log("Body", request.body)
    console.log("---")
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: "unknown endpoint"
    })
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const date = new Date

const generateId = () => {
    const maxId = Math.floor(Math.random(persons.length)*1000)
    return maxId  
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(!person){
        return response.status(404).json({
            error: "person not found"
        })
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    const nameExist = persons.find(p => p.name === body.name)

    if(body.name && nameExist){
        return response.status(401).json({
            error: "name must be unique"
        })
    }

    persons = persons.concat(person)

    response.status(201).json(person)
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} persons</p>
        <br/>
        <p>${date.toString()}</p>
    `)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})