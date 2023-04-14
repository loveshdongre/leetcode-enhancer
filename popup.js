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
    if (isIterable(options.options)) {
        for (option of options.options) {
            let chb = document.getElementById(option.optionName);
            if (option.checked) {
                chb.checked = true;
            } else {
                chb.checked = false;
            }
        }
    }
}

// on clicking checkbox
function onChange() {
    browser.tabs.query({}, function(tabs) {

        options = [];

        var checkboxes = document.querySelectorAll('input[name=settings]')
        for (chb of checkboxes) {
            options.push({ optionName: chb.value, checked: chb.checked })
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
    browser.storage.local.set({ options });
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
    var isEdge = /Edge/.test(navigator.userAgent);
    if (isFirefox) {
        this.href = "https://addons.mozilla.org/en-US/firefox/addon/leetcode-enhancer/" // mozilla feedback url  
    }
    if (isEdge) {
        this.href = "https://microsoftedge.microsoft.com/addons/detail/leetcode-enhancer/dgddijgkneackjhmijacbopefpladfia" // edge feedback url
    }
})

document.getElementById('msg').style.display = "none";

// more details
document.getElementById('deBtn').addEventListener("click", function() {
    isClose = document.getElementById('deBtn').innerText == 'more';
    if (isClose) {
        document.getElementById('msg').style.display = "block";
        document.getElementById('deBtn').innerText = 'less';
    } else {
        document.getElementById('msg').style.display = "none";
        document.getElementById('deBtn').innerText = 'more';
    }
});

// quote
fetch('https://api.quotable.io/random?tags=inspirational|success|motivational|competition|famous-quotes').then(res => {
    
    if(res.ok) {
        res.json().then(data => {
            document.getElementsByClassName('quote')[0].style.display = 'block';

            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Safely_inserting_external_content_into_a_page
            let quoteText = document.createElement("div");
            quoteText.className = "quote-text";
            quoteText.textContent = data.content;

            let quoteAuthor = document.createElement("div");
            quoteAuthor.className = "quote-author";
            quoteAuthor.textContent = data.author;

            let quote = document.getElementsByClassName('quote-text')[0];
            quote.appendChild(quoteText);
            quote.appendChild(quoteAuthor);
        })
    }
})
