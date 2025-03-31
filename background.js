chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.storage.sync.get(["password", "lockedSites"], (data) => {
            let lockedSites = data.lockedSites || ["facebook.com"];
            let url = tab.url ? new URL(tab.url).hostname : "";

            if (lockedSites.some(site => url.includes(site))) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                });
            }
        });
    }
});

chrome.webNavigation.onCompleted.addListener(details => {
    if (details.url === "chrome://extensions/") {
        chrome.storage.sync.get(["password"], (data) => {
            let savedPassword = data.password || "1234";
            
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                func: requestPassword,
                args: [savedPassword]
            });
        });
    }
}, { url: [{ hostEquals: "chrome.google.com", pathPrefix: "/webstore" }] });

function requestPassword(correctPassword) {
    let enteredPassword = prompt("Enter password to access extensions:");
    if (enteredPassword !== correctPassword) {
        alert("Incorrect password! You cannot remove the extension.");
        window.close();
    }
}
