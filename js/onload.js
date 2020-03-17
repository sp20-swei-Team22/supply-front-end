function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let user = sessionStorage.getItem('username');
let welcomeHeader = document.getElementById('welcomeH1');
let newText = document.createTextNode(`Welcome ${user}!`);
welcomeHeader.appendChild(newText);

var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
    params = {
        'user': user
    }
Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
fetch(url).then(function (response) {
    console.log(response.status);
    response.json().then(function (parsedJSON) {
        console.log(parsedJSON);
        if (response.status == 200) {
            parsedJSON.forEach(e => console.log(e));

            /* These will all be things that will be parsed after a database table get but for initial testing, hardcode will do */
            keys = {};
            parsedJSON.forEach(function (e) {
                keys[e[0]] = [];
                // e.shift();
                // console.log(e);
            });
            Object.keys(keys).forEach(function (key) {
                parsedJSON.forEach(function (entry) {
                    if (entry[0] == key) {
                        // console.log(entry);
                        // // console.log(keys[key]);
                        keys[key].push(entry.slice(1));
                    }
                });
            });
            var tableDiv = document.getElementById('tableBlock');
            const numFleets = Object.keys(keys).length;
            console.log(numFleets);
            const colNames = ['Vehicle ID', 'Make', 'Location', 'Status', 'Date Added', 'Liscence Plate', 'Last Heartbeat'];
            const numCols = colNames.length;

            /* The outer most loop is indicitive of the number of tables we are making */
            for (var tableNum = 0; tableNum < numFleets; tableNum++) {
                const fleetNum = Object.keys(keys)[tableNum];
                const rows = Object.values(keys)[tableNum]
                const numVehicles = rows.length;
                const idHeader = `fleet${fleetNum}`;

                let table = document.createElement('TABLE');
                table.setAttribute('id', `${idHeader}Table`);
                table.setAttribute('class', 'index table-bordered table-sm');
                table.setAttribute('min-width', '100%');

                let header = table.createTHead();
                /* Because technically a header isn't implicitly it's own row, we have to manually insert one first */
                header.insertRow(0);
                for (var col = 0; col < numCols; col++) {
                    let th = document.createElement('TH');
                    let tr = table.tHead.children[0];
                    th.innerHTML = colNames[col];
                    tr.appendChild(th);
                }

                /*
                    Because we are utilising thead and not just tr's and td's, we will be defining a body in which our actual
                    entries will be rendered
                */
                let tbody = document.createElement('TBODY');
                table.appendChild(tbody);

                /* 
                    Now we are populating the table by row then by its cells
                    But can probably map or forEach at a row level instead of working at a cell level, but need to see what pulling the SQL
                    into JS looks like 
                */

                for (var row = 0; row < numVehicles; row++) {
                    let newRow = tbody.insertRow(row);
                    for (col = 0; col < numCols; col++) {
                        let newCell = newRow.insertCell(col);

                        /*
                            This entire switch block is just random populating the cells of these rows sudo randomly
                            but with somewhat expected inputs of data that we might pull from our database.
                            This is where the SQL data will be inserted. 
                        */
                        let content = `${rows[row][col]}`;
                        let newText = document.createTextNode(content);

                        /* 
                            We will also be assigning a unique ID for this particular cell. 
                            Basically identifying it's coloumn and row in its ID
                            Hopefully, this wil made table access just a little bit easier
                        */
                        let colName = colNames[col];
                        let firstLetter = colName.charAt(0).toLowerCase()
                        let restOfWord = colName.substring(1, colName.length);
                        colName = firstLetter.concat(restOfWord).replace(/ /g, '');
                        newCell.setAttribute('id', `${idHeader}${colName}Row${row}`);
                        newCell.appendChild(newText);
                        const isVIDCol = col == 0;
                        if (isVIDCol) {
                            newCell.setAttribute('onclick', 'getDispatch(this)');
                            newCell.setAttribute('data-toggle', 'modal');
                            newCell.setAttribute('data-target', '#dispatchRecordPopup')
                        }
                    }
                }


                let br = document.createElement('BR');
                let br2 = document.createElement('BR');

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
                for (var buttons = 0; buttons < verbs.length; buttons++) {
                    let button = document.createElement('BUTTON');
                    let verb = verbs[buttons];
                    button.innerHTML = `${verb} Vehicle`;
                    button.setAttribute('id', `${idHeader}${verb}Button`);
                    verb = verb.toLowerCase();
                    button.setAttribute('onclick', `${verb}Vehicle(this)`);
                    button.setAttribute('class', 'smol')
                    buttonRow.appendChild(button);
                }

                const actionRow = document.createElement('DIV');
                actionRow.setAttribute('id', `${idHeader}ActionRow`);
                actionRow.setAttribute('class', 'row');
                /* Making a row for consolidation. Might not need it, but if ever we actually want to disctinctly interact with the table blocks, now we can */
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
                // divRow.appendChild(br);

                /* Now we put everything together */
                tableDiv.appendChild(tableTitle);
                tableDiv.appendChild(collapseRow);
                tableDiv.appendChild(br2);
            }
        } else {
            alert('something went wrong');
        }
    })
}).catch(function (error) {
    console.error(error)
});
