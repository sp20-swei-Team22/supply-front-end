function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let user = sessionStorage.getItem('username');
let welcomeHeader = document.getElementById('welcomeH1');
let newText = document.createTextNode(`Welcome ${user}!`);
welcomeHeader.appendChild(newText);

/* These will all be things that will be parsed after a database table get but for initial testing, hardcode will do */
let numFleets = 1;
let numVehicles = 50;
let colNames = ['Vehicle ID', 'Make', 'Location', 'Status', 'Date Added', 'Liscence Plate'];
let numCols = colNames.length;

let multFleets = numFleets > 1;
let descriptionHeader = document.getElementById('welcomeDesc');
newText = document.createTextNode(`Here ${multFleets ? 'are the' : 'is a'} table${multFleets ? 's' : ''} of your fleet${multFleets ? 's' : ''} and its vehicles`);
descriptionHeader.appendChild(newText);

/* The entire purpose of this script will be to generate table(s) of fleets composed of all vehilces in the vehicles in said fleet */
let tableDiv = document.getElementById('tableBlock');

/* The outer most loop is indicitive of the number of tables we are making */
for (var tableNum = 0; tableNum < numFleets; tableNum++) {
    const fleetNum = tableNum;
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
            let newText;
            switch (col) {
                case 0:
                    let randomVID = Math.floor(Math.random() * 1000000000);
                    newText = document.createTextNode(randomVID);
                    break;
                case 1:
                    let randomMake = Math.floor(Math.random() * (6 - 1) + 1);
                    switch (randomMake) {
                        case 1:
                            newText = document.createTextNode("Acura");
                            break;
                        case 2:
                            newText = document.createTextNode("Audi");
                            break;
                        case 3:
                            newText = document.createTextNode("Toyota");
                            break;
                        case 4:
                            newText = document.createTextNode("Mercedes");
                            break;
                        case 5:
                            newText = document.createTextNode("Honda");
                            break;
                        case 6:
                            newText = document.createTextNode("Bugatti");
                            break;
                    }
                    break;
                case 2:
                    let randomLat = Math.floor(Math.random() * (100000 - 100) + 100) / 100;
                    let randomLon = Math.floor(Math.random() * (100000 - 100) + 100) / 100;
                    newText = document.createTextNode(`Lat: ${randomLat}, Lon: ${randomLon}`);
                    break;
                case 3:
                    let randomStatusNum = Math.floor(Math.random() * (4 - 1) + 1);
                    switch (randomStatusNum) {
                        case 1:
                            newText = document.createTextNode("Active");
                            break;
                        case 2:
                            newText = document.createTextNode("Inactive");
                            break;
                        case 3:
                            newText = document.createTextNode("Maintanence");
                            break;
                    }
                    break;
                case 4:
                    var testDate = randomDate(new Date(2019, 0, 1), new Date());
                    var someDate = testDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                    newText = document.createTextNode(someDate);
                    break;
                case 5:
                    let randomLicensePlate = Math.floor(Math.random() * 1000000000);
                    newText = document.createTextNode(randomLicensePlate);
                    break;
            }

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