function buildTab(idHeader) {
    var myTab = document.getElementById('myTab');
    fleetNum = idHeader.substring(idHeader.indexOf('t') + 1,);
    let tabLI = document.createElement('LI');
    tabLI.setAttribute('class', 'nav-item mytab');

    let tabA = document.createElement('A');
    let tabId = `${idHeader}Tab`
    tabA.setAttribute('class', 'nav-link')
    tabA.setAttribute('id', tabId);
    tabA.setAttribute('data-toggle', 'tab');
    tabA.setAttribute('href', `#${idHeader}`);
    tabA.setAttribute('rold', 'tab');
    tabA.setAttribute('aria-controls', idHeader);
    tabA.setAttribute('aria-selected', 'false');
    tabA.innerHTML = `Fleet ${fleetNum}`;

    tabLI.appendChild(tabA);
    myTab.insertBefore(tabLI, myTab.children[1]);
}
