

// ON INSTALL ----------------
chrome.runtime.onInstalled.addListener(async() => {
    const badgeState = await getBadgeState()
    setBadgeState(badgeState);
    toggleContentScript()
});

//  GET BADGE TEXT FROM LOCAL STORAGE ----------------------
async function getBadgeState() {
    const result = await chrome.storage.local.get(['badgeState']);
    return result.badgeState || 'ON';
}

// SET BADGE TEXT IN LOCAL STORAGE AND ACTION BADGE TEXT ----------------
function setBadgeState(updatedBadgeState) {
    chrome.storage.local.set({ badgeState: updatedBadgeState });
    chrome.action.setBadgeText({ text: updatedBadgeState });
}

// ON CLICK LISTNER FOR BADGE ACTION, CHNAGES BADGE ACROSS ALL TABS ----------
chrome.action.onClicked.addListener(async (tab) => {
        const prevState = await getBadgeState();
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';
        // nextState === "ON"? injectContentScriptsToAllTabs() : removeContentScriptsFromAllTabs() 
        setBadgeState(nextState);
        toggleContentScript();
});

// ON CREATED TAB OR INTIAL BROWSER WINDOW OPEN ------------
chrome.tabs.onCreated.addListener(async(tab) => {
    const badgeState = await getBadgeState()
    setBadgeState(badgeState);
    toggleContentScript();
});

// ON UPDATE/REFREH TAB UPDATE CONTENT SCRIPTS
chrome.tabs.onUpdated.addListener(async (tabId,  tab) => {
    // const badgeState = await getBadgeState()
    // setBadgeState(badgeState);
   await toggleContentScript();
});

// ON ACTIVE/ OPEN EXISTING  TAB 
chrome.tabs.onActivated.addListener(async (tabId,  tab) => {
    // const badgeState = await getBadgeState()
    // setBadgeState(badgeState);
   await toggleContentScript();
});

// WHEN TAB IS MOVED
chrome.tabs.onMoved.addListener(async function(tabId, moveInfo) {
   await toggleContentScript();
});


async function toggleContentScript() {
    const badgeText = await getBadgeState();
    badgeText === "ON"? await injectContentScriptsToAllTabs() : await removeContentScriptsFromAllTabs()
}


async function injectContentScriptsToAllTabs() {
   await chrome.tabs.query({}, async (tabs) => {
       await tabs.forEach( async(tab) => {
          await  chrome.scripting.executeScript({
                target: { tabId: tab.id },
                // files: ['src/contentScripts.js']
                func: async () => {
                    const ele = document.getElementById("root_dictionary");
                    if (ele) ele.style.display = "block"; 
                    else console.log("error adding content scripts")
                    // console.log("message sent 2")
    
                    // const [tab] = await chrome.tabs.query({});
                    // const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
                    // // do something with response here, not outside the function
                    // console.log(response);
                }
            });
        });
    });
}

function validUrlChecker (tab) {
    return (tab.url.startsWith("http://") || tab.url.startsWith("https://")) && !tab.url.includes("https://chrome.google.com/webstore")
}

async function removeContentScriptsFromAllTabs() {
  await  chrome.tabs.query({}, async (tabs) => {
      await tabs.forEach(async(tab) => {
         await   chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    console.log((tab.url.startsWith("http://") || tab.url.startsWith("https://")) && !tab.url.includes("https://chrome.google.com/webstore"))
                    if((tab.url.startsWith("http://") || tab.url.startsWith("https://")) && !tab.url.includes("https://chrome.google.com/webstore")){
                    console.log("removing")
                    const ele = document.getElementById("root_dictionary");
                    if (ele) ele.style.display = "none"
                    else console.log("error removing content scripts")}
                }
            });
        });
    });
}

