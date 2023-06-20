const fs = require('fs/promises');
const { join, resolve } = require('path');

const path = '../talker.json';

const readTalkers = async () => {
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};

const writeTalker = async (newTalker) => {
  const oldTalkers = await readTalkers();
  const newTalkerWithId = {
    id: oldTalkers[oldTalkers.length - 1].id + 1,
    ...newTalker,
  };
  
  const allTalkers = JSON.stringify(
    [...oldTalkers, newTalkerWithId],
    null,
    2,
  );

  await fs.writeFile(resolve(__dirname, path), allTalkers);
  return newTalkerWithId;
};

const getTalkers = async () => {
  const talkers = await readTalkers();
  if (talkers === null) {
    return [];
  }
  return talkers;
};

const getTalkerById = async (id) => {
  const talkers = await readTalkers();
  return talkers.find((talker) => talker.id === id);
};

const updateTalker = async (id, talkerData) => {
  const oldTalkers = await readTalkers();
  const updatedTalker = { id, ...talkerData };

  const index = oldTalkers.findIndex((talker) => talker.id === id);
  if (index === -1) return null;

  const updatedTalkers = oldTalkers.reduce((talkers, currentTalker) => {
    if (currentTalker.id === updatedTalker.id) {
      return [...talkers, updatedTalker];
    }
    return [...talkers, currentTalker];
  }, []);

  const newTalkers = JSON.stringify(updatedTalkers, null, 2);
  await fs.writeFile(resolve(__dirname, path), newTalkers);
  return updatedTalker;
};

const deleteTalker = async (id) => {
  const oldTalkers = await readTalkers();
  const updatedTalkers = oldTalkers.filter((talker) => talker.id !== id);

  const newTalkers = JSON.stringify(updatedTalkers, null, 2);

  await fs.writeFile(resolve(__dirname, path), newTalkers);
};

const searchTalkerByQuery = async (q, rate, date) => {
  const talkers = await readTalkers();
  let filteredTalkers = talkers;
  if (q) {
    filteredTalkers = filteredTalkers.filter(({ name }) => (
      name.toLowerCase().includes(q.toLowerCase())));
  }

  if (rate) {
    filteredTalkers = filteredTalkers.filter(({ talk }) => (
      talk.rate === rate));
  }

  if (date) {
    filteredTalkers = filteredTalkers.filter(({ talk }) => (
      talk.watchedAt === date));
  }

  return filteredTalkers;
};

const updateRate = async (id, rate) => {
  const oldTalkers = await readTalkers();
  
  const findTalker = oldTalkers.find((talker) => talker.id === id);
  if (!findTalker) return null;

  const updatedTalker = { ...findTalker, talk: { ...findTalker.talk, rate } };
  
  const updatedTalkers = oldTalkers.map((talker) => {
    if (talker.id === updatedTalker.id) {
      return updatedTalker;
    }
    return talker;
  });

  const newTalkers = JSON.stringify(updatedTalkers, null, 2);

  await fs.writeFile(resolve(__dirname, path), newTalkers);
};

module.exports = {
  getTalkers,
  getTalkerById,
  writeTalker,
  updateTalker,
  deleteTalker,
  searchTalkerByQuery,
  updateRate,
};