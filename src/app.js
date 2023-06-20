const express = require('express');
const { getTalkers, getTalkerById } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talker = await getTalkerById(Number(id));

  if (!talker) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(talker);
});

module.exports = app;