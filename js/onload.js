let loadTables = () => {
    let isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    let identity = localStorage.getItem('username');
    // console.log(identity)
    document.getElementById('accountName').text = identity;

    var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
        params = {
            'user': identity
        }

    if (isEmail(identity)) {
        let arr = identity.split('@');
        // console.log(arr);
        url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
            params = {
                'user': arr[0],
                'emailExt': arr[1],
            }
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // console.log(url)

    fetch(url).then(res => {
        res.json().then(json => {
            if (res.status == 200) {
                // console.log(json);
                // alert('got the vehicles! if there are any ._.');
                arr = []
                json.forEach(vehicleDict => {
                    // console.log(vehicleDict);
                    let dateAdded = vehicleDict['date_added']
                    let trimmedDate = dateAdded.substring(0, dateAdded.indexOf('T'));
                    arr.push(
                        [vehicleDict['fleetid'], vehicleDict['vehicleid'], vehicleDict['status'],
                        `${vehicleDict['make']}: ${vehicleDict['model']}`, trimmedDate,
                        vehicleDict['licenseplate'], vehicleDict['last_heartbeat']]
                    );
                })
                // console.log(arr);

                fleets = {}
                arr.forEach(function (e) {
                    key = e[0];
                    if (!(key in fleets)) {
                        fleets[e[0]] = [];
                    }
                    e.shift();
                    fleets[key].push(e);
                });
                // console.log(fleets);

                const colNames = ['Vehicle ID', 'Status', 'Vehicle Type', 'Date Added', 'Liscence Plate', 'Last Heartbeat'];

                var myTab = document.getElementById('myTab');
                var myTabContent = document.getElementById('myTabContent');

                Object.keys(fleets).forEach(fleetNum => {
                    let idHeader = `fleet${fleetNum}`;
                    /*
                        First generate the tab
                    */
                    let tabLI = document.createElement('LI');
                    tabLI.setAttribute('class', 'nav-item');

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

                    /* 
                        Now the tab content
                    */
                    let tabContentContainer = document.createElement('DIV');
                    tabContentContainer.setAttribute('class', 'tab-pane fade');
                    tabContentContainer.setAttribute('id', idHeader);
                    tabContentContainer.setAttribute('role', 'tabpanel');
                    tabContentContainer.setAttribute('aria-labelledby', `${idHeader}Tab`)

                    let radioForm = document.createElement('FORM');

                    let row = document.createElement('DIV');
                    row.setAttribute('class', 'row justify-content-center');

                    ['Map', 'Table'].forEach(e => {
                        radDiv = document.createElement('DIV');
                        e == 'Map' ?
                            radDiv.setAttribute('style', 'margin-right: 5vw;') :
                            radDiv.setAttribute('style', 'margin-left: 5vw;');

                        let radio = document.createElement('INPUT');
                        radio.setAttribute('type', 'radio');
                        radio.setAttribute('name', 'vis');
                        radio.setAttribute('id', `${idHeader}${e}Rad`)
                        if (e == 'Map') radio.setAttribute('checked', 'true');

                        let label = document.createElement('LABEL');
                        label.setAttribute('for', `#${idHeader}${e}Rad`);
                        label.innerHTML = e;

                        radDiv.appendChild(radio);
                        radDiv.appendChild(label);
                        row.appendChild(radDiv);
                    })

                    radioForm.appendChild(row);
                    tabContentContainer.appendChild(radioForm);

                    let mapDiv = document.createElement('DIV');
                    mapDiv.setAttribute('id', `${idHeader}MapDiv`);
                    mapDiv.setAttribute('class', 'mapDiv');
                    mapDiv.innerHTML = 'Map goes here';

                    tabContentContainer.appendChild(mapDiv);

                    let tableDiv = document.createElement('DIV');
                    tableDiv.setAttribute('id', `${idHeader}TableDiv`);
                    tableDiv.setAttribute('class', 'tableDiv');
                    fleetData = fleets[fleetNum];
                    // console.log(fleetData);

                    let table = document.createElement('TABLE');
                    table.setAttribute('id', `${idHeader}Table`);
                    table.setAttribute('class', 'index table-bordered table-sm');
                    table.setAttribute('max-width', '100vw');

                    let header = table.createTHead();
                    header.insertRow(0);
                    colNames.forEach(function (name) {
                        let th = document.createElement('TH');
                        let tr = table.tHead.children[0];
                        th.innerHTML = name;
                        tr.appendChild(th);
                    });
                    let tbody = document.createElement('TBODY');
                    table.appendChild(tbody);

                    fleetData.forEach(entry => {
                        let row = document.createElement('TR');
                        entry.forEach((colVal, col, _) => {
                            let cell = document.createElement('TD');
                            cell.appendChild(document.createTextNode(colVal));
                            // if (col == 0) {
                            //     row.setAttribute('id', `${idHeader}VID${colVal}`)
                            //     cell.setAttribute('onclick', 'getDispatch(this)');
                            //     cell.setAttribute('data-toggle', 'modal');
                            //     cell.setAttribute('data-target', '#dispatchRecordPopup')
                            // }
                            row.append(cell);
                        });
                        tbody.appendChild(row);
                    });

                    tableDiv.appendChild(table);
                    tabContentContainer.appendChild(tableDiv);
                    myTabContent.insertBefore(tabContentContainer, myTabContent.children[1]);
                })
                $(document).ready(function () {
                    $('table.index').DataTable({
                        columnDefs: [{
                            targets: 2,
                            orderable: false
                        }]
                    });
                });
            } else {
                alert('something went wrong');
            }
        })
    }).catch(err => {
        console.log('Error: ', err);
    });
}