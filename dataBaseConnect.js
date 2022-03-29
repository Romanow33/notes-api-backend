//conexion a mongoDb
const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URL

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => {
        console.log('Database conected')
    }).catch(err => {
        console.log(err)
    })







