const express = require("express");
const pg = require("pg");
require("dotenv").config();
const client = new pg.Client();
const app = express();
const PORT = 3000;

// ===  SQL FUNCTIONS ===
app.use(express.json());
app.use(require("morgan")("dev"));

// 1. Get
app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM flavors;`;
    const { rows } = await client.query(SQL);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

// 2. Get ID
app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    const Id = req.params.id;
    const SQL = `SELECT * FROM flavors WHERE id = ${Id};`;
    const { rows } = await client.query(SQL);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

// 3. Post
app.post("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `INSERT INTO flavors(name, is_favorite) VALUES ($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [
      req.body.name,
      req.body.is_favorite,
    ]);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

// 4. Delete
app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const Id = req.params.id;
    const SQL = `DELETE FROM flavors WHERE id = ${Id};`;
    const { rows } = await client.query(SQL);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

// 5. Put
app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const Id = req.params.id;
    const SQL = `UPDATE flavors SET name = $1, is_favorite = $2, updated_at = NOW() WHERE id = $3 RETURNING *;`;
    const { rows } = await client.query(SQL, [
      req.body.name,
      req.body.is_favorite,
      Id,
    ]);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}!!`);
});

// === TABLE CREATION, CONNECTION, SEEDING ===
const init = async () => {
  await client.connect();
  console.log("Connected!");
  let SQL = `DROP TABLE IF EXISTS flavors;
CREATE TABLE flavors(
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
is_favorite BOOLEAN,
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);`;
  await client.query(SQL);
  console.log("Tables created!");
  SQL = `INSERT INTO flavors(name, is_favorite) VALUES('vanilla', true);
INSERT INTO flavors(name, is_favorite) VALUES('chocolate', false);
INSERT INTO flavors(name, is_favorite) VALUES('strawberry', false);`;
  await client.query(SQL);
  console.log("data seeded");
};

init();
