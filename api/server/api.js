import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import express from 'express';
import '../common/collections.js';

const app = express();

app.get('/solar_info', (req, res) => {
  res.status(200).json({ message: 'Hello from Express!!!'});
});

app.post('/update', (req, res) => {
  res.status(200).json({ message: 'Hello from Express!!!'});
});

WebApp.connectHandlers.use(app);

