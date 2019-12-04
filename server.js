const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// server.use(helmet())
server.use(express.json());

server.use('/api/hubs', hubsRouter);

// custome middleware
const logger = (req,res,next)=>{
  console.log(`${req.method} to ${req.originalUrl}`);

  next();
}

// gatekeeper that looks for password melon, if not send back status 401.message
  function gatekeeper(req,res,next){
  const password = req.headers.password;

  if(password === "melon"){
    next();
  }else{
    res.status(401).json({message: 'bad password in header'})
  }
}

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';
  
  res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

server.get('/echo', (req,res)=>{
  res.send(req.headers);
})

server.get('/secret', helmet(), gatekeeper(), (req,res)=>{
  res.send(req.headers);
})


module.exports = server;
