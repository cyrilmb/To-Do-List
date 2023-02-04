const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

//DELETE
router.delete('/list/:id', (req, res) => {
  console.log('in /list DELETE', req.params.id);

  const queryText = `DELETE FROM "list" WHERE 'id'=$1;`;
  const queryParams = [req.params.id];

  pool
    .query(queryText, queryParams)
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('error in DELETE', err);
      res.sendStatus(500);
    });
});

//GET table from server
router.get('/', (req, res) => {
  console.log('in /list GET');

  const queryText = `SELECT * from "list" ORDER BY 'id';`;

  pool
    .query(queryText)
    .then((results) => {
      resizeBy.send(results.rows);
    })
    .catch((err) => {
      console.log('Error in /list GET', err);
      res.sendStatus(500);
    });
});

//POST
router.post('/list/', (req, res) => {
  console.log('in /list POST:', req.body);

  const queryText = `
    INSERT INTO "list" ("task", "deadline", "complete") 
    VALUES ($1, $2, $3);
  `;
  const queryParams = [req.body.task, req.body.deadline, req.body.complete];

  pool
    .query(queryText, queryParams)
    .then((results) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('ERROR in INSERT', err);
      res.sendStatus(500);
    });
});

module.exports = router;
