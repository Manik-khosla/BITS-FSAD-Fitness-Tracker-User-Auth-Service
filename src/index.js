require('../config/mongoose')
const server = require('./app')
const port  = process.env.PORT
const host = process.env.HOST
server.listen(port, host, ()=> {
  console.log('server is running on port ' + port)    
})
