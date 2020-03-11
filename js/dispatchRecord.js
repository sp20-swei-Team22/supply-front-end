function getDispatch(vehicle) {
    const vehicleID = vehicle.innerHTML;

    console.log(vehicleID)

    // var cellBlockId = vehicle.id;
    // var n = cellBlockId.indexOf('v');
    // console.log(n);
    // const idHeader = cellBlockId.substring(0, n);
    // console.log(idHeader);

    // get dispatch record where all the courieres have this vID
    const colNames = ['Order ID', 'Customer ID', 'Destination', 'Service Type', 'Time Order Created', 'Status'];
    const numCols = colNames.length;

    const numDispatches = 100;

    document.getElementById('dispatchRecordPopupLabel').innerHTML = `Vehicle ID: ${vehicleID}`;

    const modalTable = document.getElementById('modal-table');

    let popupTable = document.createElement('TABLE');
    popupTable.setAttribute('id', 'popupTable');
    popupTable.setAttribute('class', 'popup table-bordered table-sm');
    popupTable.setAttribute('max-width', '80%');

    let header = popupTable.createTHead();
    // And because technically a header isn't implicitly it's own row, we have to manually insert one first
    header.insertRow(0);
    for (var col = 0; col < numCols; col++) {
        let th = document.createElement('TH');
        let tr = popupTable.tHead.children[0];
        th.innerHTML = colNames[col];
        if (col == 4) {
            th.setAttribute('max-width', '10vw')
        }
         tr.appendChild(th);
    }
    let tbody = document.createElement('TBODY');
    popupTable.appendChild(tbody);

    for (var row = 0; row < numDispatches; row++) {
        let newRow = tbody.insertRow(row);
        for (col = 0; col < numCols; col++) {
            let newCell = newRow.insertCell(col);
            let newText = document.createTextNode(col != 5 ? col + row : "Queued");
            let colName = colNames[col];
            let firstLetter = colName.charAt(0).toLowerCase()
            let restOfWord = colName.substring(1, colName.length);
            colName = firstLetter.concat(restOfWord).replace(/ /g, '');
            newCell.setAttribute('id', `${colName}Row${row}`);
            newCell.appendChild(newText);
        }
    }
    modalTable.appendChild(popupTable);

    const modalMap = document.getElementById('modal-map');
    modalMapHeader = document.createElement('H3');
    modalMapHeader.innerHTML = 'Current Running Dispatch';
    modalMap.appendChild(modalMapHeader);

    $(document).ready(function() {
        $('table.popup').DataTable({
            "order": [
                [5, "desc"],
                [4, "desc"]
            ]
        }, {
            columnDefs: [{
                targets: [5],
                orderData: [4, 5]
            }]
        });
    });
}