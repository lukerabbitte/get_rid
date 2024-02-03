const utils = require('./utils/utils');

const updateTestURL = async () => {
  const tabs = await chrome.tabs.query({currentWindow: true});
  const currentURLs = tabs.map((tab) => tab.URL);

  const currentTab = {
    UUID: 1234567890,
    stringID: "Tab set",
    URL: currentURLs[1]
  }

  // await saveTestURL(currentTab);

  // const UUIDToRetrieve = currentTab.UUID;
  // const retrievedObject = await retrieveTestURL(UUIDToRetrieve);

  const urlElement = document.querySelector("#testListItem .URL");
  urlElement.textContent = "h";
}

const saveTestURL = (objectToSave) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [objectToSave.UUID]: objectToSave }, function () {
      console.log("Test URL saved:", objectToSave);
      resolve();
    });
  });
}

const retrieveTestURL = (UUID) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([UUID], function (result) {
      const savedObject = result[UUID];
      if (savedObject) {
        console.log("Retrieved Test URL:", savedObject);
        resolve(savedObject);
      } else {
        console.log("Test URL with UUID not found:", UUID);
        reject(new Error("Object not found."));
      }
    });
  });
}

updateTestURL();
printTest();
