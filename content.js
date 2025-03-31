chrome.storage.sync.get(["password"], (data) => {
    let correctPassword = data.password || "1234";

    if (!document.getElementById("tab-locker-screen")) {
        let overlay = document.createElement("div");
        overlay.id = "tab-locker-screen";
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: white; z-index: 999999; display: flex; align-items: center;
            justify-content: center; flex-direction: column; font-family: Arial, sans-serif;
        `;

        overlay.innerHTML = `
            <h2 style="color: black;">This tab is locked 🔒</h2>
            <p style="color: black;">Enter password:</p>
            <input type="password" id="tab-locker-password" style="padding: 10px; font-size: 16px;">
            <br>
            <button id="tab-locker-submit" style="margin-top: 10px; padding: 10px;">Unlock</button>
        `;

        document.body.appendChild(overlay);

        document.getElementById("tab-locker-submit").addEventListener("click", () => {
            let enteredPassword = document.getElementById("tab-locker-password").value;
            if (enteredPassword === correctPassword) {
                document.getElementById("tab-locker-screen").remove();
            } else {
                alert("Incorrect password! Try again.");
                document.getElementById("tab-locker-password").value = "";
            }
        });
    }
});
