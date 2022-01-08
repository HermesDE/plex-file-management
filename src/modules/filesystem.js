const fs = require("fs");
let mv = require("mv");
const FileHound = require("filehound");
const Directory = require("../database/directorySchema");

function getAllFilesInDownloads() {
  return new Promise(async (resolve, reject) => {
    let directories = await Directory.find({ type: "download" });
    let allFiles = [];

    for (const directory of directories) {
      await FileHound.create()
        .path(directory.url)
        .match(["*.mkv", "*.mp4", "*.avi"])
        .find()
        .then((files) => {
          for (const file of files) {
            allFiles.push(file);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
    resolve(allFiles);
  });
}

function getAllFilesInMovies() {
  return new Promise(async (resolve, reject) => {
    let directories = await Directory.find({ type: "movie" });
    let allFiles = [];

    for (const directory of directories) {
      await FileHound.create()
        .path(directory.url)
        .match("*.mkv")
        .find()
        .then((files) => {
          for (const file of files) {
            allFiles.push(file);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
    resolve(allFiles);
  });
}

function getAllFilesInTv() {
  return new Promise(async (resolve, reject) => {
    let directories = await Directory.find({ type: "tv" });
    let allFiles = [];

    for (const directory of directories) {
      await FileHound.create()
        .path(directory.url)
        .match("*.mkv")
        .find()
        .then((files) => {
          for (const file of files) {
            allFiles.push(file);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
    resolve(allFiles);
  });
}

function renameMovie(paths, directoryId, release, name) {
  return new Promise(async (resolve, reject) => {
    let fileExtension = paths[0].split(".").pop();
    let directoryPath = await Directory.findOne({ _id: directoryId });

    fs.mkdir(directoryPath.url + `\\${name} (${release})`, function (err) {
      mv(
        paths[0],
        directoryPath.url +
          `\\${name} (${release})\\${name} (${release}).${fileExtension}`,
        (err) => {
          if (err) reject(err);
        }
      );
    });
    resolve({
      message: "Movie successfully renamed and moved to directory",
    });
  });
}
function renameMovieWithoutRelease() {}

module.exports = {
  getAllFilesInDownloads,
  getAllFilesInMovies,
  getAllFilesInTv,
  renameMovie,
};
