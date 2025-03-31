chrome.storage.sync.get(["password", "masterKey"], (data) => {
    let correctPassword = data.password || "1234";
    let correctMasterKey = data.masterKey || "masterkey";

    if (!document.getElementById("tab-locker-screen")) {
        let overlay = document.createElement("div");
        overlay.id = "tab-locker-screen";
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #ffffff; z-index: 999999; display: flex;
            align-items: center; justify-content: center; flex-direction: column;
            font-family: Arial, sans-serif; color: black;
        `;

        overlay.innerHTML = `
            <div style="background: #f0f0f0; padding: 30px 40px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-bottom: 20px; color: #333;">This tab is locked 🔒</h2>
                <p style="margin-bottom: 15px; color: #555;">Enter password or master key:</p>
                <input type="password" id="tab-locker-password" 
                    style="padding: 10px; font-size: 16px; border: 2px solid #333; border-radius: 5px; background: #fff; color: black;">
                <br>
                <button id="tab-locker-submit" 
                    style="margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Unlock
                </button>
                <div id="error-message" style="color: red; font-size: 14px; display: none; margin-top: 10px;"></div>
                <div id="success-message" style="color: green; font-size: 16px; display: none; margin-top: 10px;">Unlocked successfully!</div>
            </div>
        `;

        document.body.appendChild(overlay);

        function unlockTab() {
            let enteredPassword = document.getElementById("tab-locker-password").value;
            let errorMessage = document.getElementById("error-message");
            let successMessage = document.getElementById("success-message");

            if (enteredPassword === correctPassword || enteredPassword === correctMasterKey) {
                successMessage.style.display = "block";
                setTimeout(() => {
                    document.getElementById("tab-locker-screen").remove();
                }, 2000);
            } else {
                errorMessage.textContent = "Incorrect password or master key! Try again.";
                errorMessage.style.display = "block";
                document.getElementById("tab-locker-password").value = "";
            }
        }

        document.getElementById("tab-locker-submit").addEventListener("click", unlockTab);

        document.getElementById("tab-locker-password").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                unlockTab();
            }
        });
    } else {
        console.log("Overlay already exists.");
    }
});
