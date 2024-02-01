/*
const tabs = await chrome.tabs.query({currentWindow: true});
const currentURLs = tabs.map((tab) => tab.URL);
updateTestURL();
saveTestURL();
retrieveTestURL();

// Current tab object
const currentTabSet = {
  UUID: UUIDv4(),
  descriptiveString: generateString(),
  URLs: currentURLs,
}
*/


/*
--------------
Util functions
--------------
*/

// Generate UUID
function UUIDv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Generate string describing current tab set
function generateString() {
  const emoji = getRandomEmoji();
  const date = getDate();
  //const location = getLocationName(); // TODO

  const resultString = `${emoji} ${date}`;
  return resultString;
}

// Return random Unicode emoji
function getRandomEmoji() {
  // Selected within 'Misc Symbols and Pictographs' range
  const startCodePoint = 0x1F300;
  const endCodePoint = 0x1F531;

  // Generate a random integer within the specified range
  const randomCodePoint = startCodePoint + Math.floor(Math.random() * (endCodePoint - startCodePoint + 1));

  // Convert the random code point to an actual symbol
  const symbol = String.fromCodePoint(randomCodePoint);
  return symbol;
}

// Return date in local format
function getDate() {
  const currentDate = new Date();
  return currentDate.toLocaleDateString();
}

// TODO fix issues with Maps API
function getLocationName() {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(async (position) => {

  
      // Access first result
      if (data.results.length === 0) {
        console.log("No results found.");
      }
      else {
        const result = data.results[0];

        // Filter components of the address that we want
        const requiredTypes = ["neighborhood", "sublocality", "locality", "administrative_area_level_7", "administrative_area_level_6", "administrative_area_level_5", "administrative_area_level_4", "administrative_area_level_3", "administrative_area_level_2", "administrative_area_level_1", "country"];

        const placeName = result.address_components.find(component =>
          component.types.some(type => requiredTypes.includes(type))
        )?.long_name || null;

        const placeNameElement = document.getElementById("placeName");
        placeNameElement.textContent = placeName;
        return placeName;
      }
    });
  }
  else {
    console.log('Geolocation is not supported');
  }
}


// Test function to save one URL at index 1 to Chrome storage sync and retrieve it to display.
async function updateTestURL() {

  const tabs = await chrome.tabs.query({currentWindow: true});
  const currentURLs = tabs.map((tab) => tab.URL);

  // Current tab object, has id, string, and URL
  const currentTab = {
    //UUID: UUIDv4(),
    UUID: 1234567890,
    //stringID: generateString(),
    stringID: "Tab set",
    URL: currentURLs[1] // test by saving tab at index 1.
  }

  // Save currentTab object to Chrome Storage
  await saveTestURL(currentTab);

  // Retrieve a currentTab object from Chrome Storage using its UUID
  const UUIDToRetrieve = currentTab.UUID;
  const retrievedObject = await retrieveTestURL(UUIDToRetrieve);

  // Test result by outputting to HTML element testRetrieveURL
  const testRetrieveURLElement = document.getElementById("testRetrieveURL");
  populateHTML('testRetrieveURL')
  testRetrieveURLElement.textContent = `The returned value from chrome storage is ${retrievedObject.URL}`;

}

function populateHTML(html_id, id_message) {
  // Get the element by its ID
  var element = document.getElementById(html_id);

  // Check if the element exists
  if (element) {
    // Set the text content of the element
    element.textContent = id_message;
  } else {
    console.error("Element with ID '" + html_id + "' not found.");
  }
}

// Store with chrome storage sync
function saveTestURL(objectToSave) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [objectToSave.UUID]: objectToSave }, function () {
      console.log("Test URL saved:", objectToSave);
      resolve();
    });
  });
}

// Retrieve from chrome storage sync
function retrieveTestURL(UUID) {
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