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
  for(option of options.options) {
    if(option.checked) {
      
      let chb = document.getElementById(option.option);
      chb.checked = true;
    }
  }
}


function onChange () {
  browser.tabs.query({currentWindow: true}, function(tabs) {

    options = [];

    var checkboxes = document.querySelectorAll('input[name=settings]')
    for (chb of checkboxes) {
      options.push({option: chb.value, checked: chb.checked})
    }

    const response = {
      options
    }

    for (tab of tabs) {
      chrome.tabs.sendMessage(tab.id, response);
    }
  });
}
