const express = require('express');
const { getTalkers, getTalkerById, writeTalker } = require('./utils/fsUtils');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const generateToken = require('./utils/generateToken');
const validateToken = require('./middlewares/validateToken');
const {
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate } = require('./middlewares/validateFields');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  // const userLogin = req.body;
  const token = generateToken();

  return res.status(200).json({ token });
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
  const newTalker = await writeTalker(req.body);

  return res.status(201).json(newTalker);
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