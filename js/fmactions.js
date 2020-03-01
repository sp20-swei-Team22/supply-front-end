// Extract fleet number out of the button ID
function getFleetNumFromButtonId(button) {
    let buttonId = button.id;
    let start = 5;
    let length = button.id.length;
    let sub = button.id.substring(start, buttonId.length);
    let index = /[a-z]/i.exec(sub).index;
    let fleetNumToUpdate = sub.substring(0, index);
    return fleetNumToUpdate;
}

function addVehicle(button) {
    // Post request
    alert('I will add a vehicle to the database!');

    let br = document.createElement('BR');
    let fleetNumToUpdate = getFleetNumFromButtonId(button);
    let findExistingAddNewBtn = document.getElementById(`fleet${fleetNumToUpdate}AddNewBtn`);

    let parent = document.getElementById(`fleet${fleetNumToUpdate}Row`);

    let myTable;
    let names = ['Make','Model', 'Liscence Plate'];
    let numCols = names.length

    // Only generate a new table if there isn't one already
    if (findExistingAddNewBtn == null) {
        // New row for formatting. Yay bootstrap grid layout c:
        let addNewRow = document.createElement('DIV');
        addNewRow.setAttribute('class', 'row')

        // This button will allow more input rows if the fleet manager
        // wants to input multiple vehicles
        let addNewButton = document.createElement('BUTTON');
        addNewButton.innerHTML = 'Add another';
        addNewButton.setAttribute('id', `fleet${fleetNumToUpdate}AddNewBtn`);
        addNewButton.setAttribute('class', 'smol');
        addNewButton.setAttribute('onclick', 'addVehicle(this)');

        // Once done inputing all needed entries, POST to DB
        // TODO Have an empty input check that will only fire off
        // if some of the other inputs in its row contain content 
        let submitNewButton = document.createElement('BUTTON');
        submitNewButton.innerHTML = 'Submit'
        submitNewButton.setAttribute('id', `fleet${fleetNumToUpdate}SubmitNewBtn`)
        submitNewButton.setAttribute('class', 'smol');
        
        addNewRow.appendChild(addNewButton);
        addNewRow.appendChild(submitNewButton);

        parent.insertBefore(addNewRow, parent.lastElementChild);
        parent.insertBefore(br, parent.lastElementChild);

        // Creating a new form so we can just capture all the children inputs
        // instead of having to index for each input
        var addVehicleForm = document.createElement('FORM');
        addVehicleForm.setAttribute('id', `fleet${fleetNumToUpdate}AddNewForm`);
        addVehicleForm.setAttribute('name', `fleet${fleetNumToUpdate}AddNewForm`);
        parent.insertBefore(addVehicleForm, parent.children[1]);

        // Table mostly for formatting and container filling. 
        // Abusing tables build in rows and column nature. Ofc
        // this is possible with the bootstrap gridlayout,
        // but tables aldo provide headers and I think it came out alright
        var addVehicleTable = document.createElement('TABLE');
        addVehicleTable.setAttribute('id', `fleet${fleetNumToUpdate}AddNewTable`);
        addVehicleTable.setAttribute('min-width', '100%');
        let header = addVehicleTable.createTHead();
        header.insertRow(0);
        
        // Populate headers with relavent to fleet manager IN THE PARTICULAR INSTANCE
        // that he is just adding new vehicles. Other things like fleet ID are 
        // implicit based on the input and form they are entering the data into
        // TLDR, there's a lot more data that get's added to the POST body
        // that the fleet manager doesn't need to enter themselves
        for (var col = 0; col < numCols; col++) {
            let th = document.createElement('TH');
            th.setAttribute('width', '33%');
            let tr = addVehicleTable.tHead.children[0];
            th.innerHTML = names[col];
            tr.appendChild(th);
        }

        // Making the table accessible and scalable
        tBody = document.createElement('TBODY');
        addVehicleTable.appendChild(tBody);
        addVehicleForm.appendChild(addVehicleTable)
    }

    // Fetch table, perhaps redundant on first click, but it's one line...
    myTable = document.getElementById(`fleet${fleetNumToUpdate}AddNewTable`);
    var rowCount = myTable.rows.length
    tbody = myTable.tBodies[0]
    var newRow = tbody.insertRow();
    for (var col = 0; col < numCols; col++) {
        let newVehicleInput = document.createElement('INPUT');
        let newCell = newRow.insertCell(col);
        newCell.setAttribute('id', `input${rowCount}${names[col]}`);
        newCell.appendChild(newVehicleInput);
    }

}

function removeVehicle(button) {
    // Post request
    alert('I will remove a vehicle from the database!');

    let fleetNumToUpdate = getFleetNumFromButtonId(button);

    console.log(button);
}

function updateVehicle(button) {
    // Patch request
    alert('I will update a vehicle in the database!');

    let fleetNumToUpdate = getFleetNumFromButtonId(button);

    let colName = 'Status';
    let firstLetter = colName.charAt(0).toLowerCase()
    let restOfWord = colName.substring(1, colName.length);
    colName = firstLetter.concat(restOfWord).replace(/ /g, '');
    // For testing purpose this will a row
    let vehicleID = 3;
    let updateMe = document.getElementById(`fleet${fleetNumToUpdate}${colName}Row${vehicleID}`);
    updateMe.innerHTML = "False";
}