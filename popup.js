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
      if(option.checked) {
        let chb = document.getElementById(option.optionName);
        chb.checked = true;
      }
    }
  }
}


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