# Notes

- Manifest json file sets some global configuration.

<img src="2023-05-18-18-29-02.png" alt="Image" width="60%">

 ```
  document.querySelector('#my-button').addEventListener('click', (event) => {
  // Permissions must be requested from inside a user gesture, like a button's
  // click handler.
  chrome.permissions.request({
    permissions: ['tabs'],
    origins: ['https://www.google.com/']
  }, (granted) => {
    // The callback argument will be true if the user granted the permissions.
    if (granted) {
      doSomething();
    } else {
      doSomethingElse();
    }
  });
});
```

- We add the above code once the user has clicked the get rid button in their popup window.

- If we want to give more general host permissions we can do so like `"host_permissions": [
      "https://developer.chrome.com/*"
    ]`. Note that this may display an off-putting message to the user.

- element.querySelector() is called to make reference on one css class in particular.

- ``await chrome.tabs.update(tab.id, { active: true }); await chrome.windows.update(tab.windowId, { focused: true });`` this makes chrome flick back to the current tab.

- For the given URL https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-tabs-manager/, the line of code ``const pathname = new URL(tab.url).pathname.slice("/docs".length);`` will return the following value for pathname: ``extensions/mv3/getstarted/tut-tabs-manager/``

- i18n in JS via Intl API. Formatting prices, weights, displaying plurals, sorting lists, displaying date and time, collating name lists depending on culture, etc.

- Inline handling of onclick event in JS, you call the function in quotes, then in script tag you can implement.
```
<button onclick="handleClick()">Click Me</button>
<script>
  function handleClick() {
    // Code to handle button click
  }
</script>
```
- Navigator is an object within window object in JS environment. It can be used to provide metadata about the browser being used, the user agent, and some geolocation stuff if we ask. navigator.userAgent property lets devs implement feature detection and device detection stuff. Warning that this stuff is easily spoofed.