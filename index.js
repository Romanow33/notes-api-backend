require('dotenv').config()
require('./dataBaseConnect')
const express = require('express')
const app = express()
const logger = require('./loggerMiddlewar')
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./notFound')
const handlerErrors = require('./handlerErrors')
app.use(express.json())
app.use(logger)
app.use(cors())

//endpoints
app.get('/', (request, response) => {
  response.send('<h1> si podes amigo</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndDelete(id).then(result => {
    response.status(204).end()

  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    response.json(result)
  })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note.content) {
    return response.status(400).json({
      error: 'note should have a content',
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  })

})

//middleware's
app.use(notFound)
app.use(handlerErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`)
})
