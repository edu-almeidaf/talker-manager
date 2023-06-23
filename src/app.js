const express = require('express');
const { getTalkers, getTalkerById, writeTalker, updateTalker, deleteTalker,
  searchTalkerByQuery, updateRate } = require('./utils/fsUtils');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const generateToken = require('./utils/generateToken');
const validateToken = require('./middlewares/validateToken');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const validateRateQuery = require('./middlewares/validateRateQuery');
const validateDateQuery = require('./middlewares/validateDateQuery');
const validateRatePatch = require('./middlewares/validateRatePatch');
const findAll = require('./db/talkers.model');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
});

app.get('/talker/db', async (_req, res) => {
  const talkers = await findAll();
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

app.get('/talker/search', validateToken, validateRateQuery, validateDateQuery,
async (req, res) => {
  const { q, rate, date } = req.query;

  const filteredTalkers = await searchTalkerByQuery(q, Number(rate), date);

  return res.status(200).json(filteredTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talker = await getTalkerById(Number(id));

  if (!talker) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(talker);
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
  const { id } = req.params;
  const updatedTalker = await updateTalker(Number(id), req.body);

  if (updatedTalker === null) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(updatedTalker);
});

app.patch('/talker/rate/:id', validateToken, validateRatePatch, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  const verifyId = await updateRate(Number(id), rate);
  if (verifyId === null) {
    return res.status(404).json({ message: 'ID não encontrado' });
  }
  return res.status(204).end();
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  await deleteTalker(Number(id));

  return res.status(204).end();
});

module.exports = app;