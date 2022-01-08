function getDirectories() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("/api/v1/settings/directory");
    let data = await JSON.parse(await response.text());
    resolve(data);
  });
}

function drawDropdown() {
  getDirectories().then((directories) => {
    for (const directory of directories) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.className = "dropdown-item";
      a.href = "/directory/" + directory._id;
      a.innerText = directory.name;
      let ul = document.getElementById("directoryDropdown");
      ul.appendChild(li);
      li.appendChild(a);
    }
  });
}
drawDropdown();
