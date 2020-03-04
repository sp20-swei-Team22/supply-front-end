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

    const popupDiv = document.getElementById('dispatchRecordPopup');
    let title = document.createElement('H1');
    title.innerHTML = `Vehicle ID: ${vehicleID}`;

    popupDiv.appendChild(title);

    let popupTable = document.createElement('TABLE');
    popupTable.setAttribute('id', 'popupTable');
    popupTable.setAttribute('class', 'display table-popup table-bordered table-sm');
    popupTable.setAttribute('max-width', '80%');

    let header = popupTable.createTHead();
    // And because technically a header isn't implicitly it's own row, we have to manually insert one first
    header.insertRow(0);
    for (var col = 0; col < numCols; col++) {
        let th = document.createElement('TH');
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
            let newText = document.createTextNode(Math.random());
            let colName = colNames[col];
            let firstLetter = colName.charAt(0).toLowerCase()
            let restOfWord = colName.substring(1, colName.length);
            colName = firstLetter.concat(restOfWord).replace(/ /g, '');
            newCell.setAttribute('id', `${colName}Row${row}`);
            newCell.appendChild(newText);
        }
    }

    popupDiv.appendChild(popupTable);
    $(document).ready(function() {
        $('table.display').DataTable();
    });
}

function openForm() {
    document.getElementById('dispatchRecordPopup').style.display = 'block';
}

function closeForm() {
    document.getElementById('dispatchRecordPopup').style.display = 'none';
    document.getElementById('dispatchRecordPopup').innerHTML = '';
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById('dispatchRecordPopup');
    if (event.target == modal) {
        closeForm();
    }
}
document.onkeypress = function(e) {
    var keyCode = e.keyCode;
    var modal = document.getElementById('dispatchRecordPopup');
    if (event.target == modal && keyCode === 27) {
        closeForm();
    }
}