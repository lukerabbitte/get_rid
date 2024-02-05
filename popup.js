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

/*
----------
UTIL FUNCTIONS
----------
*/

function memorableWindowName(windowObject, windowSavedAtTimestamp, windowTabObjects) {
  // Eventually extend to coming up with a rich, fun, and memorable name for each window
  return(windowObject.replace('GetRid_', ''))
}

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

function isValidTimestamp(timestamp) {
  const date = new Date(timestamp);
  return !isNaN(date);
}

/*
----------
CORE FUNCTIONS
----------
*/

let tabs = {};
let tabIds = [];
let currentWindowId = undefined;

async function bootstrap() {
  const currentWindow = await chrome.windows.getCurrent();
  currentWindowId = currentWindow.id;
  loadSavedWindows();
}

/*
----------

Objects saved in local storage in the following format:

const windowObject = { 
  [windowObjectKey]: {
    tabs: tabs,
    savedAtTimestamp: Date.now(),
    emoji: windowEmoji
  }
};

----------
*/
async function loadSavedWindows() {
  // Load window objects from local storage API
  chrome.storage.local.get(null, function(windows) {
    // Convert the windows object into an array in order to sort by timestamp
    let windowsArray = [];
    for (let windowObject in windows) {
      if (windowObject.startsWith('GetRid_')) {
        windowsArray.push({key: windowObject, value: windows[windowObject]});
      }
    }

    // Sort the array in reverse chronological order
    windowsArray.sort((a, b) => b.value.savedAtTimestamp - a.value.savedAtTimestamp);

    // Render each window
    windowsArray.forEach(windowObject => {
      renderWindow(windowObject.key, windowObject.value);
    });
  });
}

function renderWindow(windowObjectKey, windowObjectValue) {

  let windowTabObjects = windowObjectValue.tabs;
  let formattedDate = isValidTimestamp(windowObjectValue.savedAtTimestamp) ? new Date(windowObjectValue.savedAtTimestamp).toLocaleString() : 'Saved at an unknown time...';
  let windowEmoji = windowObjectValue.emoji || ':)';

  let windowTemplate = document.getElementById('windowItem').content;

  const windowItem = document.importNode(windowTemplate, true).children[0];

  // Passing the object key e.g. GetRid_1247408185 and windowItem DOM element
  registerWindowEvents(windowObjectKey, windowItem);

  // Populate elements of windowItem
  windowItem.querySelector('.window_emoji').innerText = windowEmoji;
  windowItem.querySelector('.window_timestamp').innerText = formattedDate;

  // Populate the tabs within each windowItem
  for (let tabObject in windowTabObjects) {
    renderTab(windowTabObjects[tabObject], windowItem);
  }

  // Add the finished product to the DOM
  const windowList = document.getElementById('windowList');
  windowList.appendChild(windowItem);
}

function registerWindowEvents(windowObjectKey, windowItem) {
  windowItem
    .querySelector('.remove_window_button')
    .addEventListener('click', function () {
      removeWindow(windowObjectKey);

      // Add the fade-out class to start the transition
      windowItem.classList.add('fade-out');

      const otherWindowItems = Array.from(document.querySelectorAll('.window')).filter(item => item !== windowItem);

      // Add the fade-in class to the other classes
      otherWindowItems.forEach(item => item.classList.add('fade-in'));

      // Wait for the transition to finish before removing the element
      setTimeout(function() {
        windowItem.remove();
      }, 120); // Match this with the duration of your transition
    });

  windowItem
  .querySelector('.open_window_button')
  .addEventListener('click', function () {
    openWindow(windowObjectKey);
  });
}


function renderTab(tabObjectValue, windowItem) {
  let tabTemplate = document.getElementById('tabItem').content;
  const tabItem = document.importNode(tabTemplate, true).children[0];
  tabItem.querySelector('.tab_favicon').src = tabObjectValue.favIconUrl;
  tabItem.querySelector('.tab_title').textContent = tabObjectValue.title;

  const tabsList = windowItem.querySelector('#tabsList');
  tabsList.appendChild(tabItem);
}

async function saveWindow() {
  try {
    // Get current window information along with its tabs
    let window = await chrome.windows.getCurrent({ populate: true });
    tabs = {};
    // appendToLog(`Window of ID: ${window.id} has ${window.tabs.length} tabs`)
    for(let tab of window.tabs) {
      tabs[tab.id] = tab;
      // appendToLog(`${tab.id}`)
    }

    // All our objects in local storage should have recognisable key e.g. [GetRid_1247408185]
    let windowObjectKey = `GetRid_${window.id}`;
    let windowEmoji = getRandomEmoji();

    // Save window object to local storage
    const windowObject = { 
      [windowObjectKey]: {
        tabs: tabs,
        savedAtTimestamp: Date.now(),
        emoji: windowEmoji
      }
    };

    chrome.storage.local.set(windowObject, function() {
      // appendToLog(`Window object of ID: ${window.id} has been saved locally`);
    });
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

function removeWindow(windowObjectKey) {
  chrome.storage.local.remove(windowObjectKey, function() {
    if (chrome.runtime.lastError) {
      // appendToLog('An error occurred: ' + chrome.runtime.lastError.message);
    } else {
      // appendToLog('Window object: ' + windowObjectKey + ' removed from storage.');
    }
  });
}

function openWindow(windowObjectKey) {
  chrome.storage.local.get([windowObjectKey], function(result) {
    if (result[windowObjectKey]) {
      let tabs = result[windowObjectKey].tabs;
      let urls = [];
      for(let tab in tabs) {
        urls.push(tabs[tab].url);
      }
      chrome.windows.create({ url: urls, focused: true });
    }
  });
}

document
  .getElementById('saveWindowButton')
  .addEventListener('click', function() {
    saveWindow().then(() => {
      // Add the fade-out class to the body
      document.body.classList.add('fade-out');

      // Wait for the transition to finish before reloading the page
      setTimeout(() => location.reload(), 120); // Match this with the duration of your transition
    });
  });

document.addEventListener('DOMContentLoaded', function () {
  bootstrap();
});


document.getElementById("youriframeid").contentWindow.location.reload(true);