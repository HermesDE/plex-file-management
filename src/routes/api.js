const express = require("express");
const router = express.Router();
const fs = require("fs");
const fspromise = require("fs/promises");
const Directory = require("../database/directorySchema");
const User = require("../database/UserSchema");
const {
  getAllFilesInDownloads,
  getAllFilesInMovies,
  getAllFilesInTv,
  renameMovie,
} = require("../modules/filesystem");

router.get("/api/v1/me", async (req, res) => {
  let user = await User.findOne({ plexId: req.session.plexUser.id });
  res.json(user);
});

router.get("/api/v1/settings/general", async (req, res) => {
  let user = await User.findOne({ plexId: req.session.plexUser.id });
  res.json({
    apiLanguage: user.apiLanguage,
  });
});
router.post("/api/v1/settings/general", async (req, res) => {
  let apiLanguage = req.body.apiLanguage;

  await User.findOneAndUpdate(
    { plexId: req.session.plexUser.id },
    { apiLanguage: apiLanguage }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});

router.put("/api/v1/settings/directory", async (req, res) => {
  let stopFunction = false;
  let _id = req.body._id;
  let name = req.body.name;
  let type = req.body.type;
  let url = req.body.url;

  if (_id == "" || name == "" || type == "" || url == "") {
    return res.json({ error: "not all required fields are filled" });
  }

  let newName, newType, newUrl;

  let directory = await Directory.findOne({ _id: _id });

  if (name != directory.name) {
    newName = name;
  } else {
    newName = directory.name;
  }
  if (type != directory.type) {
    newType = type;
  } else {
    newType = directory.type;
  }
  if (url != directory.url) {
    newUrl = url;
  } else {
    newUrl = directory.url;
  }

  await fspromise.readdir(newUrl).catch((err) => {
    stopFunction = true;
    res.json({
      error: "Could not connect to the provided url",
    });
  });
  if (stopFunction) {
    return;
  }

  await Directory.findByIdAndUpdate(
    { _id: _id },
    {
      name: newName,
      type: newType,
      url: newUrl,
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});
router.get("/api/v1/settings/directory", async (req, res) => {
  let results = await Directory.find();
  res.json(results);
});
router.get("/api/v1/settings/directory/type/:type", async (req, res) => {
  let results = await Directory.find({ type: req.params.type });
  res.json(results);
});
router.get(
  "/api/v1/settings/directory/type/exclude/:type",
  async (req, res) => {
    let directories = ["movie", "tv", "download"];
    let index = directories.indexOf(req.params.type);
    directories.splice(index, 1);

    let results = await Directory.find({ type: directories });
    res.json(results);
  }
);
router.get("/api/v1/settings/directory/id/:_id", async (req, res) => {
  let results = await Directory.findOne({ _id: req.params._id }).catch(
    (err) => {
      return res.json(err);
    }
  );
  res.json(results);
});

router.post("/api/v1/settings/directory", async (req, res) => {
  let name = req.body.name;
  let type = req.body.type;
  let url = req.body.url;
  let username = req.body.username || null;
  let password = req.body.password || null;

  const directory = new Directory({
    name: name,
    type: type,
    url: url,
    username: username,
    password: password,
  });

  try {
    fs.readdirSync(url);
  } catch (ex) {
    return res.json({
      message: "Error while adding directory. Maybe wrong path?",
      error: ex,
    });
  }

  await directory
    .save()
    .then((directory) => {
      res.json(directory);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.delete("/api/v1/settings/directory", async (req, res) => {
  let _id = req.body._id;

  await Directory.findOneAndDelete({ _id: _id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});

router.get("/api/v1/files/downloads", async (req, res) => {
  getAllFilesInDownloads()
    .then((files) => {
      res.json(files);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/api/v1/files/movies", async (req, res) => {
  getAllFilesInMovies()
    .then((files) => {
      res.json(files);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/api/v1/files/tv", async (req, res) => {
  getAllFilesInTv()
    .then((files) => {
      res.json(files);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.delete("/api/v1/files/delete", async (req, res) => {
  for (const file of req.body) {
    fs.unlink(file.path, (err) => {
      if (err) return res.json(err).status(500);
    });
  }
  res.json({ message: "Files successfully deleted" }).status(200);
});
router.post("/api/v1/files/rename", async (req, res) => {
  let directoryId = req.body.directoryId;
  let type = req.body.type;
  let name = req.body.name;
  let release = req.body.release;
  let paths = req.body.paths;
  let newPaths = [];

  if (type == "movie") {
    if (release) {
      renameMovie(paths, directoryId, release, name)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.json(err);
        });
    }
  }
});

module.exports = router;
