document
  .getElementById("createDirectory")
  .addEventListener("click", createDirectory);
document
  .getElementById("createDirectoryClose")
  .addEventListener("click", clearCreateDirectoryError);
document
  .getElementById("deleteDirectory")
  .addEventListener("click", deleteDirectory);
document
  .getElementById("updateDirectory")
  .addEventListener("click", updateDirectory);
document
  .getElementById("updateDirectoryClose")
  .addEventListener("click", clearUpdateDirectoryError);

function clearCreateDirectoryError() {
  document.getElementById("createDirectoryError").innerText = "";
}
function clearUpdateDirectoryError() {
  document.getElementById("updateDirectoryError").innerText = "";
}

function getDirectories() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch("/api/v1/settings/directory");
    let data = await response.text();
    resolve(JSON.parse(data));
  });
}

async function createDirectory() {
  let name = document.getElementById("inputName").value;
  let type = document.getElementById("inputType").value;
  let url = document.getElementById("inputUrl").value;
  let username = document.getElementById("inputUsername").value;
  let password = document.getElementById("inputPassword").value;

  let error = document.getElementById("createDirectoryError");
  if (name == "" || type == "" || url == "") {
    error.innerText = "Please fill out all required fields!";
    return;
  }

  const response = await fetch("/api/v1/settings/directory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      type: type,
      url: url,
      username: username,
      password: password,
    }),
  });
  const content = JSON.parse(await response.text());
  if (content?.error) {
    error.innerText = JSON.stringify(content.error);
    return;
  }
  $("#newFilesystemModal").modal("hide");
  drawTable();
}

async function updateDirectory() {
  let _id = document.getElementById("inputIdDirectory").value;
  let name = document.getElementById("inputNameDirectory").value;
  let type = document.getElementById("inputTypeDirectory").value;
  let url = document.getElementById("inputUrlDirectory").value;

  let error = document.getElementById("updateDirectoryError");
  if (name == "" || type == "" || url == "") {
    error.innerText = "Please fill out all required fields!";
    return;
  }

  const obj = {
    _id: _id,
    name: name,
    type: type,
    url: url,
  };

  const response = await fetch("/api/v1/settings/directory", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const content = await response.json();

  if (content?.error) {
    error.innerText = JSON.stringify(content.error);
    return;
  }
  $("#changeDirectoryModal").modal("hide");
  drawTable();
}
async function deleteDirectory() {
  let _id = document.getElementById("inputIdDirectory").value;

  const response = await fetch("/api/v1/settings/directory", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: _id }),
  });
  const content = await response.json();

  if (content.error) {
    return alert(content.error);
  }
  drawTable();
}

function drawTable() {
  //delete already existing table
  let oldTbody = document.getElementById("tbody");
  while (oldTbody.firstChild) {
    oldTbody.removeChild(oldTbody.firstChild);
  }

  //fetch data and draw table
  getDirectories().then((data) => {
    if (data[0]) {
      for (const obj of data) {
        let tr = document.createElement("tr");
        tr.id = obj._id;
        tr.onclick = function () {
          let modal = new bootstrap.Modal(
            document.getElementById("changeDirectoryModal")
          );
          modal.show();
          document.getElementById("inputNameDirectory").value = obj.name;
          document.getElementById("inputTypeDirectory").value = obj.type;
          document.getElementById("inputUrlDirectory").value = obj.url;
          document.getElementById("inputIdDirectory").value = obj._id;
        };
        document.getElementById("tbody").appendChild(tr);

        let tdName = document.createElement("td");
        tdName.innerText = obj.name;

        let tdURL = document.createElement("td");
        tdURL.innerText = obj.url;

        let tdType = document.createElement("td");
        tdType.innerText = obj.type;

        tr.appendChild(tdName);
        tr.appendChild(tdURL);
        tr.appendChild(tdType);
      }
    }
  });
}

drawTable();
