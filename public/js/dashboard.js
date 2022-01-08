document.getElementById("renameFiles").addEventListener("click", renameFiles);
document.getElementById("deleteFiles").addEventListener("click", deleteFiles);

async function displayDirectories() {
  let response = await fetch(
    "/api/v1/settings/directory/type/exclude/download"
  );
  let data = await response.text();
  data = await JSON.parse(data);

  let select = document.getElementById("inputDirectory");

  if (!data) {
    let option = document.createElement("option");
    option.innerText = "No directories created yet";
  }

  for (const directory of data) {
    //create select options with an object as value
    let option = document.createElement("option");
    option.value = JSON.stringify({ _id: directory._id, type: directory.type });
    option.innerText = directory.name;
    select.appendChild(option);
  }
}
displayDirectories();

async function renameFiles() {
  let obj;

  //get the type of the directory
  let input = document.getElementById("inputDirectory").value;
  //convert the string to an object
  input = JSON.parse(input);

  let type = input.type;
  let directoryId = input._id;

  if (type == "movie") {
    //Check if movie name field is filled and throw error when not
    let name = document.getElementById("inputName").value;
    if (!name) return alert("Name is required!");
    let release = document.getElementById("inputYear").value || null;

    //Get all checkboxes, filter which ones are checked and throw error when more than one is checked
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let checkedCheckboxes = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkedCheckboxes.push(checkboxes[i]);
      }
    }
    if (checkedCheckboxes.length <= 0) {
      return alert("Please select a file first");
    }
    if (checkedCheckboxes.length > 1) {
      return alert("You can only select one movie!");
    }

    let path = [checkedCheckboxes[0].name];

    //create object that gets send to the api
    obj = {
      directoryId: directoryId,
      type: "movie",
      name: name,
      release: release,
      paths: path,
    };
  } else if (type == "tv") {
    //Check if tv name field is filled and throw error when not
    let name = document.getElementById("inputName").value;
    if (!name) return alert("Name is required!");
    let release = document.getElementById("inputYear").value || null;

    //Get all checkboxes, filter which ones are checked and throw error when no one is checked
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let checkedCheckboxes = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkedCheckboxes.push(checkboxes[i]);
      }
    }
    if (checkedCheckboxes.length <= 0) {
      return alert("Please select a file first");
    }

    //create array with all file paths
    let paths = [];
    for (let i = 0; i < checkedCheckboxes.length; i++) {
      paths.push(checkedCheckboxes[i].name);
    }

    //create object that gets send to the api
    obj = {
      directoryId: directoryId,
      type: "tv",
      name: name,
      release: release,
      paths: paths,
    };
  }

  const response = await fetch("/api/v1/files/rename", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  //const content = await response.json();
  document.getElementById("tbody").innerHTML = "";
  await drawTable();
}

async function deleteFiles() {
  let isonechecked = false;
  let objArray = [];
  let checkboxes = document.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      isonechecked = true;
      let obj = {
        path: checkboxes[i].name,
      };
      objArray.push(obj);
    }
  }
  if (!isonechecked) {
    return alert("Please select one or more files first!");
  }

  const response = await fetch("/api/v1/files/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objArray),
  });
  const content = await response.json();
  if (!content.message) {
    alert(JSON.stringify(content));
  }
  document.getElementById("tbody").innerHTML = "";
  drawTable();
}

function getDownloads() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch("/api/v1/files/downloads");
    let data = await response.text();
    resolve(JSON.parse(data));
  });
}
function drawTable() {
  getDownloads().then((data) => {
    let objData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        name: data[i].split("\\").pop(),
        path: data[i],
      };
      objData.push(obj);
    }

    if (objData[0]) {
      for (const obj of objData) {
        let tr = document.createElement("tr");
        document.getElementById("tbody").appendChild(tr);

        let th = document.createElement("th");
        th.scope = "row";
        th.innerHTML = `<input type="checkbox" class="form-check-input" name="${obj.path}"/>`;
        tr.appendChild(th);

        let td = document.createElement("td");
        td.innerText = obj.name;

        tr.appendChild(td);
      }
    }
  });
}

drawTable();
