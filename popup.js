const tabs = await chrome.tabs.query({currentWindow: true});
const currentUrls = tabs.map((tab) => tab.url);
updateTestUrl();
saveTestUrl();
retrieveTestUrl();

const currentTabSet = {
  uuid: uuidv4(),
  descriptiveString: generateString(),
  urls: currentUrls,
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function generateString() {
  const emoji = getRandomEmoji();
  const date = getDate();
  //const location = generateLocation(); // TODO

  const resultString = `${emoji} ${date}`;
  return resultString;
}


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

function getDate() {
  // Generate date string laid out in local format
  const currentDate = new Date();
  return currentDate.toLocaleDateString();
}

function generateLocation() {
  // TODO
}

async function updateTestUrl() {

  // Select which url to save based on its index in currentUrls, created when initially mapping tabs to array above
  const firstUrl = currentUrls[1];

  const currentTab = {
    uuid: uuidv4(),
    stringID: generateString(),
    url: firstUrl
  }

  // Save currentTab object to Chrome Storage
  await saveTestUrl(currentTab);

  // Retrieve a currentTab object from Chrome Storage using its UUID
  const uuidToRetrieve = currentTab.uuid;
  const retrievedObject = await retrieveTestUrl(uuidToRetrieve);

  console.log("Retrieved object:", retrievedObject);

  // Test result by outputting to html element testRetrieveUrl
  const testRetrieveUrlElement = document.getElementById("testRetrieveUrl");
  testRetrieveUrlElement.textContent = retrievedObject.url;
}

function saveTestUrl(objectToSave) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [objectToSave.uuid]: objectToSave }, function () {
      console.log("Test URL saved:", objectToSave);
      resolve();
    });
  });
}

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












storage.set({ savedUrls: currentUrls }, function() {
  console.log('URLs saved successfully');
});

storage.get('savedUrls', function(result) {
  const savedUrls = result.savedUrls;
  console.log('Retrieved URLs:', savedUrls);
});

const template = document.getElementById("listItemTemplate");
const elements = new Set();


















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