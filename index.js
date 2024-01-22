const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (request, response) => {
    console.log('Retrieving persons....', persons)
    response.json(persons)
})

app.get('/info', (request, response) => {
    console.log('Accessing /info pages')
    const date = new Date().toString()
    console.log(date)
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('Accessing person with id: ', id)
    const person = persons.find(p => p.id === id)

    if (person) {
        console.log('Found the person: ', person)
        response.json(person)
    } else {
        console.log('Person cant be found.')
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('Deleting person with id: ', id)

    persons = persons.filter(ps => ps.id !== id)
    response.status(204).end()

})

const generateId = () => {
    return Math.floor(Math.random(10000) * 1000) * Date.now()
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('request body: ', body)

    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'name and number fields must be filled!'
        })
    }

    const validateName = persons.find((ps) => {
        return ps.name === body.name
    })

    console.log('person found:', validateName);

    if (validateName !== null && validateName !== undefined) {
        
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})