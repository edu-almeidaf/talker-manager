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

module.exports = {
  getTalkers,
  getTalkerById,
  writeTalker,
};