const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)

const connection = mongoose.connection;

connection.on('error', (error) => {
  console.log(error)
})

connection.once('connected', () => {
  console.log('Database Connected');
})
