const { Client } = require('pg')


const clientConfig =
  {
    host : 'localhost',
    user : 'root',
    password : 'roottoor',
    port : 5432,
    database : "vayetek"
  }



async function getAllGames() {
  const client = new Client(clientConfig);
  await client.connect();

  try {
    const query = `SELECT * FROM games order by id asc`;
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err; 
  } finally {
    await client.end();
  }
}

async function getGameById (id) {
  const client = new Client(clientConfig);

    await client.connect();

    try {
      const query = `SELECT * FROM games WHERE id = $1`;
      const result = await client.query(query , [id]);
      return result.rows;
    } catch (err) {
      console.error('Error fetching data:', err);
      throw err; 
    } finally {
      await client.end();
    }
}

async function createGame  (players) {
  const client = new Client(clientConfig); 
    await client.connect();
    try {
      const query = `INSERT INTO games (id, players , isfinished) VALUES (default, $1 , $2 )`;
      const result = await client.query(query ,[ players , false]);
      return result.rows;
    } catch (err) {
      console.error('Error inserting data:', err);
      throw err; 
    } finally {
      await client.end();
    }
}

async function updateGame  (id, isfinished) {
  const client = new Client(clientConfig);

    await client.connect();
    try {
      const query = `UPDATE games SET isfinished = $1 WHERE id = $2`;
      const result = await client.query(query ,[isfinished, id]);
      return result.rows;
    } catch (err) {
      console.error('Error updating data:', err);
      throw err; 
    } finally {
      await client.end();
    }
}

async function deleteGame  (id) {
  const client = new Client(clientConfig);
  await client.connect();
  try {
    const query = `DELETE FROM games WHERE id = $1`;
    const result = await client.query(query ,[id]);
    return result.rows;
  } catch (err) {
    console.error('Error removing data:', err);
    throw err; 
  } finally {
    await client.end();
  }
}

module.exports = {
 getAllGames, 
   createGame,
  getGameById,
  deleteGame,
  updateGame
}