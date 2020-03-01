// The entire purpose of this script will be to generate table(s) of fleets composed of all vehilces in the vehicles in said fleet
let tableDiv = document.getElementById('tableBlock');

// These will all be things that will be parsed after a database table get but for initial testing, hardcode will do
let numFleets = 2;
let numVehicles = 4;
let colNames = ['Vehicle ID', 'Make', 'Location', 'Status', 'Date Added', 'Liscence Plate'];
let numCols = colNames.length;
// let attr = ['25%', '15%', '20%', '10%', '15%', '20%'];

// The outer most loop is indicitive of the number of tables we are making
for (var tableNum = 0; tableNum < numFleets; tableNum++) {
    let fleetNum = tableNum;

    let table = document.createElement('TABLE');
    table.setAttribute('id', `fleet${fleetNum}Table`);
    // This attribute will both style, and allow our table to be sortable
    table.setAttribute('class', 'display table-bordered table-sm');
    table.setAttribute('min-width', '100%');

    // Our table head will contain all of our column titles as well as set their widths for the rest of the procceing entries
    let header = table.createTHead();
    // And because technically a header isn't implicitly it's own row, we have to manually insert one first
    header.insertRow(0);
    for (var col = 0; col < numCols; col++) {
        let th = document.createElement('TH');
        // th.setAttribute('width', `${attr[col]}`);
        let tr = table.tHead.children[0];
        th.innerHTML = colNames[col];
        tr.appendChild(th);
    }

    // Because we are utilising thead and not just tr's and td's, we will be defining a body in which our actual
    // entries will be rendered
    let tbody = document.createElement('TBODY');
    table.appendChild(tbody);
    for (var row = 0; row < numVehicles; row++) {
        let newRow = tbody.insertRow(row);
        for (col = 0; col < numCols; col++) {
            let newCell = newRow.insertCell(col);
            // This is where the SQL data will go
            let newText = document.createTextNode((Math.random()));
            // We will also be assigning a unique ID for this particular cell. 
            // Basically identifying it's coloumn and row in its ID
            // Hopefully, this wil made table access just a little bit easier
            let colName = colNames[col];
            let firstLetter = colName.charAt(0).toLowerCase()
            let restOfWord = colName.substring(1, colName.length);
            colName = firstLetter.concat(restOfWord).replace(/ /g, '');
            newCell.setAttribute('id', `fleet${fleetNum}${colName}Row${row}`);
            newCell.appendChild(newText);
        }
    }

    let br = document.createElement('BR');
    let br2 = document.createElement('BR');

    // Simple header for each table
    let tableTitle = document.createElement('BUTTON');
    tableTitle.innerHTML = `Fleet #${fleetNum} Vehicle List`;
    tableTitle.setAttribute('class', 'collapsible');

    // Now lets add those buttons that will allow our fleet manager to 'interact' with our database and
    // actually manage his vehicles
    let buttonRow = document.createElement('DIV');
    buttonRow.setAttribute('id', `fleet${fleetNum}ButtonRow`);
    buttonRow.setAttribute('class', 'row');
    let verbs = ['Add', 'Remove', 'Update']
    for (var buttons = 0; buttons < verbs.length; buttons++) {
        let button = document.createElement('BUTTON');
        let verb = verbs[buttons];
        button.innerHTML = `${verb} Vehicle`;
        button.setAttribute('id', `fleet${fleetNum}${verb}Button`);
        verb = verb.toLowerCase();
        button.setAttribute('onclick', `${verb}Vehicle(this)`);
        button.setAttribute('class', 'smol')
        buttonRow.appendChild(button);
    }

    // Making a row for consolidation. Might not need it, but if ever we actually want to disctinctly interact with the table blocks, now we can
    let divRow = document.createElement('DIV');
    divRow.setAttribute('id', `fleet${fleetNum}Row`);
    divRow.setAttribute('class', 'justify-content-start content');

    divRow.appendChild(buttonRow);
    divRow.appendChild(table);
    // divRow.appendChild(br);

    // Now we put everything together

    tableDiv.appendChild(tableTitle);
    tableDiv.appendChild(divRow);
    tableDiv.appendChild(br2);
}