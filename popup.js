document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["password", "masterKey", "lockedSites"], (data) => {
        document.getElementById("new-password").value = data.password || "";
        document.getElementById("locked-sites").value = (data.lockedSites || ["facebook.com"]).join(", ");
        document.getElementById("new-master-key").value = data.masterKey || "";
    });

    document.getElementById("verify-password").addEventListener("click", () => {
        verifyPassword();
    });

    document.getElementById("popup-password").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            verifyPassword();
        }
    });

    function verifyPassword() {
        const enteredPassword = document.getElementById("popup-password").value;

        chrome.storage.sync.get(["password", "masterKey", "lockedSites"], (data) => {
            if (enteredPassword === data.password || enteredPassword === data.masterKey) {
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        data.lockedSites.forEach((site) => {
                            if (tab.url.includes(site)) {
                                chrome.tabs.reload(tab.id);
                            }
                        });
                    });
                });
                document.getElementById("password-prompt").style.display = "none";
                document.getElementById("settings").style.display = "block";

                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success', 'mt-3');
                successMessage.textContent = 'Login successfully!';
                
                document.getElementById("settings").appendChild(successMessage);

                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            } else {
                document.getElementById("error-message").style.display = "block";
            }
        });
    }

    document.getElementById("save-settings").addEventListener("click", () => {
        const newPassword = document.getElementById("new-password").value;
        const newMasterKey = document.getElementById("new-master-key").value;
        const lockedSites = document.getElementById("locked-sites").value.split(",").map(site => site.trim());

        chrome.storage.sync.set({ password: newPassword, masterKey: newMasterKey, lockedSites: lockedSites }, () => {
            const settingsSuccessMessage = document.createElement('div');
            settingsSuccessMessage.classList.add('alert', 'alert-success', 'mt-3');
            settingsSuccessMessage.textContent = 'Settings saved successfully!';

            document.getElementById("settings").appendChild(settingsSuccessMessage);

            setTimeout(() => {
                settingsSuccessMessage.style.display = 'none';
            }, 3000);
        });
    });

    let creditsDiv = document.createElement("div");
    creditsDiv.style.textAlign = "center";
    creditsDiv.style.marginTop = "20px";
    creditsDiv.style.fontSize = "12px";
    creditsDiv.style.color = "#555";
    creditsDiv.innerHTML = "Big Thanks to <strong>Xceed</strong>";
    document.body.appendChild(creditsDiv);
});
