const fs = require('fs/promises');
const { join } = require('path');

const path = '../talker.json';

const readTalkers = async () => {
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
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
};