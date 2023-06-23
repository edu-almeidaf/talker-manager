const connection = require('./connection');

const findAll = async () => {
  const query = 'SELECT * FROM talkers';
  const [talkers] = await connection.execute(query);

  if (!talkers) return [];

  const newTalkers = talkers.map((talker) => ({
    name: talker.name,
    age: talker.age,
    id: talker.id,
    talk: {
      watchedAt: talker.talk_watched_at,
      rate: talker.talk_rate,
    },
  }));

  return newTalkers;
};

module.exports = findAll;