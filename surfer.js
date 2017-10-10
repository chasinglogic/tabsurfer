let tabs = [];
let bookmarks = [];
let activeIndex = 0;

function listResults(id, nope) {
  let resultsList = document.getElementById('results');
  let newResults = document.createDocumentFragment();
  let results = tabs.concat(bookmarks);

  resultsList.textContent = '';

  for (let i = 0; i < results.length; i++) {
    let r = results[i];
    let resDiv = document.createElement('div');
    resDiv.className = 'result';

    if (i == 0) {
      resDiv.className += ' active';
      activeIndex = 0;
    }

    let resLink = document.createElement('a');

    if (r.index) {
      resLink.textContent = '[T] ' + r.title;
      resLink.setAttribute('href', r.id);
      resLink.className = 'tab';
    } else {
      resLink.textContent = '[B] ' + r.title;
      resLink.setAttribute('href', r.url);
      resLink.className = 'bookmark';
    }

    resDiv.appendChild(resLink);
    newResults.appendChild(resDiv);
  }

  resultsList.appendChild(newResults);
}

function surf(searchTerm) {
  let search;
  if (searchTerm) {
    search = searchTerm.toLowerCase();
  } else {
    search = null;
  }

  browser.tabs.query({currentWindow: true}).
    then((qt) => {
      tabs = qt;

      if (search) {
        tabs = tabs.filter(function (t) {
          return (t.url.toLowerCase().indexOf(search) !== -1 ||
                  t.title.toLowerCase().indexOf(search) !== -1);
        })
      }

      if (search) {
        return browser.bookmarks.search(search);
      }

      return browser.bookmarks.search({});
    }).
    then(function (b) {
      bookmarks = b;
      listResults();
    }).
    catch(console.log);
}

function returnKeyHandler(ev) {
  if (ev.keyCode == 13) {
    let r = document.getElementById('results');

    for (let i = 0; i < r.children.length; i++) {
      let child = r.children[i];

      if (child.className.indexOf('active') !== -1) {
        child.children[0].click();
      }
    }

    ev.preventDefault();
  }
}

function arrowKeyHandler(ev) {
  if (ev.keyCode == 40 || ev.keyCode == 38 || ev.keyCode == 9) {
    // DOWN
    if (ev.keyCode == 40 || (ev.keyCode == 9 && !ev.shiftKey)) {
      activeIndex++;
      // UP
    } else {
      activeIndex--;
    }

    let r = document.getElementById('results');

    if (activeIndex < 0) {
      activeIndex = r.children.length - 1;
    } else if (activeIndex > (r.children.length - 1)) {
      activeIndex = 0;
    }


    for (let i = 0; i < r.children.length; i++) {
      let child = r.children[i];

      if (child.className.indexOf('active') !== -1) {
        child.className = child.className.replace('active', '');
      }

      if (i == activeIndex) {
        child.className += ' active';
      }
    }

    ev.preventDefault();
  }
}

function clickHandler(ev) {
  let linkTag = ev.target;
  if (ev.target.tagName === 'DIV') {
    linkTag = ev.target.children[0];
  }

  if (linkTag.className.indexOf("tab") !== -1) {
    ev.preventDefault();
    browser.tabs.update(+linkTag.getAttribute('href'), {
      active: true
    });
  }

  if (linkTag.className.indexOf("bookmark") !== -1) {
    ev.preventDefault();
    browser.tabs.create({
      url: linkTag.getAttribute('href')
    });
  }

  if (linkTag.tagName === "A") {
    window.close();
  }
}
