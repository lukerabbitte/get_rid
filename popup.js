const tabs = await chrome.tabs.query({currentWindow: true});
const currentUrls = tabs.map((tab) => tab.url);
updateTestUrl();
saveTestUrl();
retrieveTestUrl();

// Current tab object
const currentTabSet = {
  uuid: uuidv4(),
  descriptiveString: generateString(),
  urls: currentUrls,
}

// Generate uuid
function uuidv4() {
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


// Test function to save one url at index 1 to Chrome storage sync and retrieve it to display.
async function updateTestUrl() {

  // Select which url to save based on its index in currentUrls, created when initially mapping tabs to array above
  const firstUrl = currentUrls[1];

  // Current tab object, has id, string, and url
  const currentTab = {
    uuid: uuidv4(),
    stringID: generateString(),
    url: firstUrl
  }

  // Testing event listener for button
  // TODO not working
  document.addEventListener('DOMContentLoaded', function() {
    let button = document.getElementById('getRidButton');
    // onClick's logic below:
    button.addEventListener('click', function() {
      const sampleText = document.getElementById('testRetrieveUrl');
      sampleText.textContent = 'Hello'
    });
  });

  // Save currentTab object to Chrome Storage
  await saveTestUrl(currentTab);

  // Retrieve a currentTab object from Chrome Storage using its UUID
  const uuidToRetrieve = currentTab.uuid;
  const retrievedObject = await retrieveTestUrl(uuidToRetrieve);

  console.log("Retrieved object:", retrievedObject);

  // Test result by outputting to html element testRetrieveUrl
  const testRetrieveUrlElement = document.getElementById("testRetrieveUrl");
  testRetrieveUrlElement.textContent = retrievedObject.url;

  // Test list item population
  const testListItemElement = document.getElementById("testListItem");
  testListItemElement.textContent = retrievedObject.url;
}

// Store with chrome storage sync
function saveTestUrl(objectToSave) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [objectToSave.uuid]: objectToSave }, function () {
      console.log("Test URL saved:", objectToSave);
      resolve();
    });
  });
}

// Retrieve from chrome storage sync
function retrieveTestUrl(uuid) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([uuid], function (result) {
      const savedObject = result[uuid];
      if (savedObject) {
        console.log("Retrieved Test URL:", savedObject);
        resolve(savedObject);
      } else {
        console.log("Test URL with UUID not found:", uuid);
        reject(new Error("Object not found."));
      }
    });
  });
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