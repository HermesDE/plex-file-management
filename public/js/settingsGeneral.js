document
  .getElementById("updateGeneralSettings")
  .addEventListener("click", updateGeneralSettings);

function getGeneralSettings() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("/api/v1/settings/general", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const content = await response.json();
    resolve(content);
  });
}
function updateGeneralSettings() {
  getGeneralSettings().then(async (result) => {
    let _id = result._id;

    const response = await fetch("/api/v1/settings/general", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
        apiLanguage: apiLanguage,
      }),
    });
    const status = await response.status;
    if (status != 200) {
      return alert("Error");
    }
    let modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();
    drawSettings();
  });
}

function drawSettings() {
  getGeneralSettings().then((content) => {
    document.getElementById("apiLanguage").value = content.apiLanguage;
  });
}
drawSettings();
