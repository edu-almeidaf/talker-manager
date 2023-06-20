const express = require('express');
const { getTalkers } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
})

module.exports = app;