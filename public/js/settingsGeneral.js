document
  .getElementById("updateGeneralSettings")
  .addEventListener("click", updateGeneralSettings);

function getGeneralSettings() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("/api/v1/user/me", {
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
    let language = document.getElementById("inputLanguage").value;
    let apikey = document.getElementById("inputApikey").value;

    const response = await fetch("/api/v1/user/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: _id, language: language, apikey: apikey }),
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
    document.getElementById("inputLanguage").value = content.language;
    document.getElementById("inputApikey").value = content.apikey;
  });
}
drawSettings();
