// Get tabs from current window, want to preserve current order for user familiarity - no sort
const tabs = await chrome.tabs.query({currentWindow: true});

// Get date for ID string
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString();

const template = document.getElementById("li_template");
const elements = new Set(); //html elements to be cloned from template

// Iterate through the collection of tabs using for of loop
for (const tab of tabs) {

  console.log("Tab ID:", tab.id);
  console.log("Tab URL:", tab.url);
  console.log("Tab Title:", tab.title);

  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title;
  const url = tab.url; // Can convert to URL object if more functionality needed

  // querySelector lets us select based on a html class name
  element.querySelector(".title").textContent = title;
  element.querySelector(".url").textContent = url;

  element.querySelector("a").addEventListener("click", async () => {
    // Focus window as well as active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}

// Lets us keep adding to an empty div on our html.
document.querySelector("ul").append(...elements);

// Now let's add an event listener to the group tabs button which groups tabs
const button = document.querySelector("button");
button.addEventListener("click", async () => {

    // "mapping" over an array of objects is a very useful technique, instead of useless objects lets us return one of the required fields of the object.
    const tabIDs = tabs.map(({ id }) => id); 

    // Needs the tab IDs as an argument - this is why we ran tabs.map( ({ id }) => id ) function which filtered ids from the useless object array.
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: 'DOCS' });
      }
})