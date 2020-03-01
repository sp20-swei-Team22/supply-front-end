function getDispatch(vehicle) {
    alert('Hi')
    console.log(vehicle);
    console.log(vehicle.innerHTML);
    // var cellBlockId = vehicle.id;
    // var n = cellBlockId.indexOf('v');
    // console.log(n);
    // const idHeader = cellBlockId.substring(0, n);
    // console.log(idHeader);
    const vehicleID = vehicle.innerHTML;
    // get dispatch record where all the courieres have this vID
    const colNames = ['Order ID', 'Customer ID', 'Destination', 'Service Type', 'Time Order Created', 'Status'];
    const numCols = colNames.length;

    const numDispatches = 10;

    const popupDiv = document.getElementById('dispatchRecordPopup');
    let popupTable = document.createElement('TABLE')
    popupTable.setAttribute('id', 'popupTable')
    popupTable.setAttribute('class', 'table-popup display table-bordered table-sm');
    popupTable.setAttribute('min-width', '100%');

    let header = popupTable.createTHead();
    // And because technically a header isn't implicitly it's own row, we have to manually insert one first
    header.insertRow(0);
    for (var col = 0; col < numCols; col++) {
        let th = document.createElement('TH');
        // th.setAttribute('width', `${attr[col]}`);
        let tr = popupTable.tHead.children[0];
        th.innerHTML = colNames[col];
        tr.appendChild(th);
    }
    let tbody = document.createElement('TBODY');
    popupTable.appendChild(tbody);

    for (var row = 0; row < numDispatches; row++) {
        let newRow = tbody.insertRow(row);
        for (col = 0; col < numCols; col++) {
            let newCell = newRow.insertCell(col);
            // This is where the SQL data will go
            let newText = document.createTextNode(Math.random());
            // We will also be assigning a unique ID for this particular cell. 
            // Basically identifying it's coloumn and row in its ID
            // Hopefully, this wil made table access just a little bit easier
            let colName = colNames[col];
            let firstLetter = colName.charAt(0).toLowerCase()
            let restOfWord = colName.substring(1, colName.length);
            colName = firstLetter.concat(restOfWord).replace(/ /g, '');
            newCell.setAttribute('id', `${colName}Row${row}`);
            newCell.appendChild(newText);
        }
    }

    popupDiv.appendChild(popupTable);
}