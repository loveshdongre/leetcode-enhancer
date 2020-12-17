// for compatibility between chrome and firefox
var browser = browser || chrome

// attach event listener to all checkboxes
var target = document.querySelectorAll("input[name=settings]");
for (chb of target) {
  chb.addEventListener('change', onChange);
}

// read and update saved changes
browser.storage.local.get(["options"], updatePopup)

function updatePopup(options) {
  if(isIterable(options.options)) {
    for(option of options.options) {
      let chb = document.getElementById(option.optionName);
      if(option.checked) {
        chb.checked = true;
      }
      else {
        chb.checked = false;
      }
    }
  }
}

// on clicking checkbox
function onChange () {
  browser.tabs.query({}, function(tabs) {

    options = [];

    var checkboxes = document.querySelectorAll('input[name=settings]')
    for (chb of checkboxes) {
      options.push({optionName: chb.value, checked: chb.checked})
    }

    saveLocally(options);

    const response = {
      options
    }

    for (tab of tabs) {
      browser.tabs.sendMessage(tab.id, response);
    }
  });
}

function saveLocally(options) {
    browser.storage.local.set({options});
}

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

// feedback btn

document.getElementById('fBtn').addEventListener("click", function(e) {
  var isFirefox = typeof InstallTrigger !== 'undefined';
  var isEdge = !isIE && !!window.StyleMedia;
  if(isFirefox) {
    this.href = "https://addons.mozilla.org/en-US/firefox/addon/leetcode-enhancer/" // mozilla feedback url  
  }
  if(isEdge) {
    this.href = "https://microsoftedge.microsoft.com/addons/detail/leetcode-enhancer/dgddijgkneackjhmijacbopefpladfia" // edge feedback url
  }
})