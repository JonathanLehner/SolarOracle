import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import express from 'express';
import '../common/collections.js';

const app = express();

// this will check the database in the future
const available_servers = [1,3,11,17,22] 
const server_secrets = {1: 5,3: 8,11: 95,17: 31, 22: 15}
let server_production = {}

// body-parser not needed anymore
// needs to be before routes
const exp = app.use(express.json())
app.get('/solar_info', (req, res) => {
  const server_id = req.query.server_id
  console.log(server_id)
  console.log(server_production)
  res.status(200).json({ production: server_production[server_id]});
});

// test with
// curl "http://localhost:3001/solar_info?server_id=3"

app.post('/update', (req, res) => {
  console.log(req.body)
  const body = req.body;
  const server_id = body.server_id;
  const secret = body.secret;
  const production = body.production;
  if(server_secrets[server_id] == secret){
    server_production[server_id] = production;
    res.status(200).json({ message: 'Saved!'});
  }
  else{
    res.status(401).send({ message: 'Wrong secret!'});
  }
});

// test with
// curl -X POST http://localhost:3001/update -H 'Content-Type: application/json' -d '{"server_id": 3,"secret": 8, "production": 500}'

WebApp.connectHandlers.use(exp);

