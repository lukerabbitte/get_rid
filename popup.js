/*
----------
UTIL FUNCTIONS
----------


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

// Return random Unicode emoji or fallback to ":)" smiley face
function getRandomEmoji() {
  try {
      // Selected within 'Misc Symbols and Pictographs' range
      const startCodePoint = 0x1F300;
      const endCodePoint = 0x1F531;

      // Generate a random integer within the specified range
      const randomCodePoint = startCodePoint + Math.floor(Math.random() * (endCodePoint - startCodePoint + 1));

      // Convert the random code point to an actual symbol
      const symbol = String.fromCodePoint(randomCodePoint);
      return symbol;
  } catch (error) {
      // If any error occurs (e.g., invalid code point), return a default smiley face
      console.error('Error generating random emoji:', error);
      return ":)";
  }
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
          } else {
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
  } else {
      console.log('Geolocation is not supported');
  }
}

*/


/*
----------
CORE FUNCTIONS
----------
*/

let tabs = {}
let tabIds = []
let currentWindowId = undefined;

async function bootstrap() {
  const currentWindow = await chrome.windows.getCurrent();
  currentWindowId = currentWindow.id;
  loadSavedWindows()
}

async function loadSavedWindows() {
  // Load from storage API
}

async function saveWindow() {
  try {
    let window = await chrome.windows.getCurrent({ populate: true });
    tabs = {};
    tabIds = [];
    appendToLog(`Window of ID: ${window.id} has ${window.tabs.length} tabs`)
    for(let tab of window.tabs) {
      tabIds.push(tab.id);
      tabs[tab.id] = tab;
      appendToLog(`${tab.id}`)
    }

    // Save window object to chrome.storage.sync
    await setStorageData({ [window.id]: tabs })
  }
  catch (error) {
    appendToLog(`An error occurred: ${error.message}`);
  }
}

/*
----------
DOCUMENT UPDATE FUNCTIONS
----------
*/

function appendToLog(logLine) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div')).innerText = '> ' + logLine;
}

document
  .getElementById('saveWindow')
  .addEventListener('click', function() {
    saveWindow();
  })

document.addEventListener('DOMContentLoaded', function () {
  bootstrap();
});

/*
----------
STORAGE FUNCTIONS
----------
*/

function getStorageData(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, result => {
      if (chrome.runtime.lastError) {
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve(result);
      }
    });
  });
}

async function fetchData() {
  const { data } = await getStorageData('data');
  return data;
}

function setStorageData(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

