document.addEventListener("DOMContentLoaded", () => {
    let passwordPrompt = document.getElementById("password-prompt");
    let settingsDiv = document.getElementById("settings");
    let errorMessage = document.getElementById("error-message");

    chrome.storage.sync.get(["password"], (data) => {
        let savedPassword = data.password || "1234";

        document.getElementById("verify-password").addEventListener("click", () => {
            let enteredPassword = document.getElementById("popup-password").value;

            if (enteredPassword === savedPassword) {
                passwordPrompt.style.display = "none";
                settingsDiv.style.display = "block";
            } else {
                errorMessage.style.display = "block";
                document.getElementById("popup-password").value = "";
            }
        });
    });

    document.getElementById("save-settings").addEventListener("click", () => {
        let newPassword = document.getElementById("new-password").value;
        let newLockedSites = document.getElementById("locked-sites").value.split(",").map(site => site.trim());

        chrome.storage.sync.get(["password", "lockedSites"], (data) => {
            let oldPassword = data.password || "1234";
            let oldLockedSites = data.lockedSites || [];

            chrome.storage.sync.set({ password: newPassword, lockedSites: newLockedSites }, () => {
                alert("Settings saved!");


                if (newPassword !== oldPassword) {
                    chrome.tabs.query({}, function (tabs) {
                        for (let tab of tabs) {
                            chrome.tabs.reload(tab.id);
                        }
                    });
                } else {
   
                    let addedSites = newLockedSites.filter(site => !oldLockedSites.includes(site));

                    chrome.tabs.query({}, function (tabs) {
                        tabs.forEach(tab => {
                            if (addedSites.some(site => tab.url.includes(site))) {
                                chrome.tabs.reload(tab.id);
                            }
                        });
                    });
                }
            });
        });
    });

    chrome.storage.sync.get(["password", "lockedSites"], (data) => {
        document.getElementById("new-password").value = data.password || "";
        document.getElementById("locked-sites").value = (data.lockedSites || ["facebook.com"]).join(", ");
    });

    let creditsDiv = document.createElement("div");
    creditsDiv.style.textAlign = "center";
    creditsDiv.style.marginTop = "20px";
    creditsDiv.style.fontSize = "12px";
    creditsDiv.style.color = "#555";
    creditsDiv.innerHTML = "Big Thanks to <strong>Xceed</strong>";
    document.body.appendChild(creditsDiv);
});
