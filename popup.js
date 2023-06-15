/*

// This is how we return tabs filtered by query
const tabs = await chrome.tabs.query({
    url: [
      "https://developer.chrome.com/docs/webstore/*",
      "https://developer.chrome.com/docs/extensions/*",
    ],
  });
  // Note that tabs.query() is an async function which returns a promise to an object. Instead of immediately returning a value like a synchronous
  // function would, it returns a proxy for a value not known. It's how to make asnyc functions seem more sync. Async bread and butter of JS.
  // query can take a query object as a function. Above we saw an example of a query object, which basically just filters what tabs are returned by
  // Chrome's tabs API.
*/

// Just return every tab like
const tabs = await chrome.tabs.query({});

// Collator
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString();

const template = document.getElementById("li_template");
const elements = new Set();

// Iterate through the collection of tabs using for of loop
for (const tab of tabs) {

  console.log("Tab ID:", tab.id);
  console.log("Tab URL:", tab.url);
  console.log("Tab Title:", tab.title);

  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  // querySelector lets us select based on a html class name
  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;

  element.querySelector("a").addEventListener("click", async () => {
    // Focus window as well as active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}

// Lets us keep adding shit to an empty div on our html.
document.querySelector("ul").append(...elements);

// Now let's add an event listener to the group tabs button which groups tabs

const button = document.querySelector("button");
button.addEventListener("click", async () => {

    // "mapping" over an array of objects is a very useful technique, instead of useless objects lets us return one of the required fields of the object.
    const tabIDs = tabs.map(({ id }) => id);

    // We can call "group" function on tabs, which puts them into the stupid group shit that chrome seems to think is worthwhile.
    // Needs the tab IDs as an argument - this is why we ran tabs.map( ({ id }) => id ) function which filtered ids from the useless object array.
    //const group = await chrome.tabs.group({ tabIDs });
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: 'DOCS' });
      }
})