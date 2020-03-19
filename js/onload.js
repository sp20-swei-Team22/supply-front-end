function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let user = sessionStorage.getItem('username');
user = 'test'
let welcomeHeader = document.getElementById('welcomeH1');
let newText = document.createTextNode(`Welcome ${user}!`);
welcomeHeader.appendChild(newText);

var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
    params = {
        'user': user
    }

Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
const myRequest = new Request(url, {
    method: 'GET',
    mode: 'no-cors',
});
fetch(myRequest).then(function (response) {
    console.log(response.status);
    response.json().then(function (parsedJSON) {
        if (response.status == 200) {
            console.log(parsedJSON);
            // parsedJSON.forEach(e => console.log(e));
            arr = []
            Object.keys(parsedJSON).forEach(function(key) {
                index = key.indexOf('D')
                vid = parseInt(key.substring(index + 1));
                inner = parsedJSON[key];
                arr.push(
                    [inner['fleetid'], vid, `${inner['make']}: ${inner['model']}`,
                    `Lat: ${inner['current_lat']} Lon: ${inner['current_lon']}`,
                    inner['status'], null, inner['licenseplate'], inner['last_heartbeat']
                ])
            });
            /* These will all be things that will be parsed after a database table get but for initial testing, hardcode will do */
            fleets = {};
            arr.forEach(function (e) {
                key = e[0];
                if (!(key in fleets)) {
                    fleets[e[0]] = [];
                }
                e.shift();
                fleets[key].push(e);
            });
            var tableDiv = document.getElementById('tableBlock');
            const colNames = ['Vehicle ID', 'Vehicle Type', 'Location', 'Status', 'Date Added', 'Liscence Plate', 'Last Heartbeat'];

            Object.keys(fleets).forEach(function (fleetNum) {
                var fleetData = fleets[fleetNum]
                const idHeader = `fleet${fleetNum}`;
                // console.log(idHeader);
                // console.log(fleetNum);

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
                fleetData.forEach(function (entry) {
                    // console.log(entry);
                    var row = document.createElement('TR');
                    entry.forEach(function (colVal, col, _) {
                        var cell = document.createElement('TD');
                        cell.appendChild(document.createTextNode(colVal));
                        if (col == 0) {
                            cell.setAttribute('onclick', 'getDispatch(this)');
                            cell.setAttribute('data-toggle', 'modal');
                            cell.setAttribute('data-target', '#dispatchRecordPopup')
                        }
                        row.append(cell);
                        // console.log(i, colVal);
                    });
                    tbody.appendChild(row);
                });
                let br = document.createElement('BR');

                /* Simple header for each table */
                let tableTitle = document.createElement('BUTTON');
                tableTitle.innerHTML = `Fleet #${fleetNum} Vehicle List`;
                tableTitle.setAttribute('type', 'button');
                tableTitle.setAttribute('class', 'collapseButton')
                tableTitle.setAttribute('data-toggle', 'collapse');
                tableTitle.setAttribute('data-target', `#${idHeader}collapse`);
                tableTitle.setAttribute('aria-expanded', 'false');
                tableTitle.setAttribute('aria-controls', `${idHeader}collapse`);

                /* 
                    Now lets add those buttons that will allow our fleet manager to 'interact' with our database and
                    actually manage his vehicles 
                */
                let buttonRow = document.createElement('DIV');
                buttonRow.setAttribute('id', `${idHeader}ButtonRow`);
                buttonRow.setAttribute('class', 'row');
                let verbs = ['Add', 'Remove', 'Update']
                verbs.forEach(function (verb) {
                    let button = document.createElement('BUTTON');
                    button.innerHTML = `${verb} Vehicle`;
                    button.setAttribute('id', `${idHeader}${verb}Button`);
                    verb = verb.toLowerCase();
                    button.setAttribute('onclick', `${verb}Vehicle(this)`);
                    button.setAttribute('class', 'smol')
                    buttonRow.appendChild(button);
                });

                const actionRow = document.createElement('DIV');
                actionRow.setAttribute('id', `${idHeader}ActionRow`);
                actionRow.setAttribute('class', 'row');

                let divRow = document.createElement('DIV');
                divRow.setAttribute('id', `${idHeader}Row`);
                divRow.setAttribute('class', 'justify-content-start card card-body');
                divRow.setAttribute('style', 'padding-top: 10px');
                divRow.setAttribute('object-fit', 'contain');

                divRow.appendChild(buttonRow);
                divRow.appendChild(actionRow);
                divRow.appendChild(table);

                const collapseRow = document.createElement('DIV');
                collapseRow.setAttribute('id', `${idHeader}collapse`);
                collapseRow.setAttribute('class', 'collapse');

                collapseRow.appendChild(divRow);

                /* Now we put everything together */
                tableDiv.appendChild(tableTitle);
                tableDiv.appendChild(collapseRow);
                tableDiv.appendChild(br);
            });
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
}).catch(function (error) {
    console.error(error)
});
