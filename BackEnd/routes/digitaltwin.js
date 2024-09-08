const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require("../config/db");

// POST /books/new
router.post("/digitaltwins/new", async (req, res) => {
  const { performance, simulation, data_management, usability } = req.body;
  // Generating _id
  const _id = uuidv4();

  const digitaltwin = {
    _id,
    performance,
    simulation,
    data_management,
    usability,
  };

  // Saving to DB
  db.put(digitaltwin)
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// GET /books
router.get("/digitaltwins", async (req, res) => {
  try {
    const digitaltwins = await db.allDocs({ include_docs: true });
    const response = digitaltwins.rows.map((digitaltwin) => digitaltwin.doc);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /books/:id
router.get("/digitaltwins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const digitaltwin = await db.get(id);
    res.status(200).send(digitaltwin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /books/:id
router.put("/digitaltwins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { performance, simulation, data_management, usability } = req.body;

    db.get(id).then(async (doc) => {
      const response = await db.put({
        _id: id,
        _rev: doc._rev,
        performance,
        simulation,
        data_management,
        usability,
      });
      res.status(201).send(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /books/:id
router.delete("/digitaltwins/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.get(id);
    const response = await db.remove(doc);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
