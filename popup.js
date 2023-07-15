const storage = chrome.storage.local;
const tabs = await chrome.tabs.query({currentWindow: true});
const currentUrls = tabs.map((tab) => tab.url);

const currentTabs = {
  stringID: generateString(),
  urls: currentUrls,
}

function generateString() {
  const emoji = getRandomEmoji();
  const date = getDate();
  //const location = generateLocation();

  // Concatenate the results with spaces in between
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

document.getElementById













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