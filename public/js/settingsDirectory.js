document
  .getElementById("deleteDirectory")
  .addEventListener("click", deleteDirectory);
document
  .getElementById("updateDirectory")
  .addEventListener("click", updateDirectory);

function getDirectories() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch("/api/v1/settings/directory");
    let data = await response.text();
    resolve(JSON.parse(data));
  });
}

async function updateDirectory() {
  let _id = document.getElementById("inputIdDirectory").value;
  let name = document.getElementById("inputNameDirectory").value;
  let type = document.getElementById("inputTypeDirectory").value;
  let url = document.getElementById("inputUrlDirectory").value;

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

  if (content.error) {
    return alert(content.error);
  }

  document.getElementById("tbody").innerHTML = "";
  await drawTable();
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
  document.getElementById("tbody").innerHTML = "";
  await drawTable();
}

function drawTable() {
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
