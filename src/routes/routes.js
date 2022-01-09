const express = require("express");
const router = express.Router();
const User = require("../database/UserSchema");
const Directory = require("../database/directorySchema");

/* router.get("/getPasswordHash", async (req, res) => {
  let hash = await bcrypt.hash(req.body.password, saltRounds);
  res.json(hash);
}); */

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard.ejs");
});
router.get("/settings/general", (req, res) => {
  res.render("pages/settingsGeneral.ejs");
});
router.get("/settings/plex", (req, res) => {
  res.render("pages/settingsPlex.ejs");
});
router.get("/settings/directories", (req, res) => {
  res.render("pages/settingsDirectory.ejs");
});

router.get("/directory/:_id", async (req, res) => {
  await Directory.findById(req.params._id)
    .then((directory) => {
      res.json(directory);
    })
    .catch(() => {
      res.json({ error: "No directory found with this id" });
    });
});

module.exports = router;
