const storage = chrome.storage.local;

const tabs = await chrome.tabs.query({currentWindow: true});
const currentUrls = tabs.map((tab) => tab.url);
const currentTabs = {
  stringID: generateString(),
  urls: currentUrls
}

function generateString() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function getRandomEmoji() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function getLocationName() {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`);
      const data = await response.json();

      const location = data.city || data.region;

      console.log("User's location:", location);
    });
  } else {
    console.log('Geolocation is not supported');
  }
}

function getDate() {
  const currentDate = new Date();
  return currentDate.toLocaleDateString();
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