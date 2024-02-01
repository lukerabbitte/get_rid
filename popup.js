const utils = require('./utils/utils');

const updateTestURL = async () => {
  const tabs = await chrome.tabs.query({currentWindow: true});
  const currentURLs = tabs.map((tab) => tab.URL);

  const currentTab = {
    UUID: 1234567890,
    stringID: "Tab set",
    URL: currentURLs[1]
  }

  await saveTestURL(currentTab);

  const UUIDToRetrieve = currentTab.UUID;
  const retrievedObject = await retrieveTestURL(UUIDToRetrieve);

  const testRetrieveURLElement = document.getElementById("testRetrieveURL");
  populateHTML('testRetrieveURL')
  testRetrieveURLElement.textContent = `The returned value from chrome storage is ${retrievedObject.URL}`;
}

const populateHTML = (html_id, id_message) => {
  let element = document.getElementById(html_id);

  if (element) {
    element.textContent = id_message;
  } else {
    console.error("Element with ID '" + html_id + "' not found.");
  }
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

const printTest = () => {
  console.log(utils.UUIDv4)
  
}

updateTestURL();
printTest();