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
    const fleetNumToUpdate = getFleetNumFromButtonId(button);
    const idHeader = `fleet${fleetNumToUpdate}`;
    let findExistingAddNewBtn = document.getElementById(`fleet${fleetNumToUpdate}AddNewBtn`);


    let myTable;
    const names = ['Make', 'Model', 'Liscence Plate'];
    const numCols = names.length;

    // Only generate a new table if there isn't one already
    if (findExistingAddNewBtn == null) {
        // New row for formatting. Yay bootstrap grid layout c:
        let addNewRow = document.createElement('DIV');
        addNewRow.setAttribute('class', 'row');

        // This button will allow more input rows if the fleet manager
        // wants to input multiple vehicles
        let addNewButton = document.createElement('BUTTON');
        addNewButton.innerHTML = 'Add another';
        addNewButton.setAttribute('id', `${idHeader}AddNewBtn`);
        addNewButton.setAttribute('class', 'smol');
        addNewButton.setAttribute('onclick', 'addVehicle(this)');
        addNewButton.setAttribute('type', 'button');

        button.disabled = true;

        // Once done inputing all needed entries, POST to DB
        // TODO Have an empty input check that will only fire off
        // if some of the other inputs in its row contain content 
        let submitNewButton = document.createElement('BUTTON');
        submitNewButton.innerHTML = 'Submit';
        submitNewButton.setAttribute('id', `${idHeader}SubmitNewBtn`);
        submitNewButton.setAttribute('class', 'smol');
        submitNewButton.setAttribute('type', 'button');
        submitNewButton.setAttribute('onclick', 'registerVehicles(this)');


        // Creating a new form so we can just capture all the children inputs
        // instead of having to index for each input
        var addVehicleForm = document.createElement('FORM');
        addVehicleForm.setAttribute('id', `${idHeader}AddNewForm`);
        const actionDiv = document.getElementById(`${idHeader}ActionRow`);

        // Makes it easier if we also want a fleet manager to use multiple action buttons at a time
        actionDiv.appendChild(addVehicleForm);
        actionDiv.appendChild(addNewRow);

        // Table mostly for formatting and container filling. 
        // Abusing tables build in rows and column nature. Ofc
        // this is possible with the bootstrap gridlayout,
        // but tables aldo provide headers and I think it came out alright
        var addVehicleTable = document.createElement('TABLE');
        addVehicleTable.setAttribute('id', `${idHeader}AddNewTable`);
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
        addVehicleForm.appendChild(addVehicleTable);
        addVehicleForm.appendChild(addNewButton);
        addVehicleForm.appendChild(submitNewButton)
    }

    // Fetch table, perhaps redundant on first click, but it's one line...
    myTable = document.getElementById(`${idHeader}AddNewTable`);
    var rowCount = myTable.rows.length;
    tbody = myTable.tBodies[0];
    var newRow = tbody.insertRow();
    for (var col = 0; col < numCols; col++) {
        let newVehicleInput = document.createElement('INPUT');
        let newCell = newRow.insertCell(col);
        newVehicleInput.setAttribute('id', `input${rowCount}${names[col]}`);
        // newVehicleInput.setAttribute('value', 'aaa')
        newCell.appendChild(newVehicleInput);
    }

}

function registerVehicles(button) {
    // alert(button.id);
    const fleetNumToUpdate = getFleetNumFromButtonId(button);
    const idHeader = `fleet${fleetNumToUpdate}`;
    const myForm = document.getElementById(`${idHeader}AddNewForm`).elements
    console.log(myForm);
    console.log(myForm.length - 2);
    const numRowsOfEntries = myForm.length - 2;
    let postBody = {
        'fleetNum': fleetNumToUpdate
    }
    let canPost = true;
    for (var row = 0; row < numRowsOfEntries; row += 3) {
        let make = document.getElementById(`${idHeader}AddNewForm`).elements[row].value;
        let model = document.getElementById(`${idHeader}AddNewForm`).elements[row + 1].value;
        let lp = document.getElementById(`${idHeader}AddNewForm`).elements[row + 2].value;
        if (make == "" || model == "" || lp == "") {
            alert(`One of the entry ${row + 1} are partially filled!`)
            canPost = false;
            break;
        } else {
            postBody[`newVechicle${row/3}`] = {
                'Make': make,
                'Model': model,
                'Liscence Plate': lp
            }
        }
    }
    if (canPost) {
        console.log(postBody)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(postBody)
        }
        console.log(options)
        const url = "https://supply.team22.softwareengineeringii.com/addVehicle";
        fetch(url, options).then(function(response) {
            if (response.status == 200) {
                alert('Vehicles Successfully Added!')
            } else {
                alert('Something went wrong!')
                alert(response.json())
            }
        });
    }
}

function updateVehicle(button) {
    // Patch request
    alert('I will update a vehicle in the database!');

    const fleetNumToUpdate = getFleetNumFromButtonId(button);
    const idHeader = `fleet${fleetNumToUpdate}`;

    console.log(fleetNumToUpdate);
    console.log(idHeader);


    let colName = 'Status';
    let firstLetter = colName.charAt(0).toLowerCase();
    let restOfWord = colName.substring(1, colName.length);
    colName = firstLetter.concat(restOfWord).replace(/ /g, '');
    // For testing purpose this will a row
    const table = document.getElementById(`${idHeader}Table`);
    console.log(table);
    for (var vehicleID = 0; vehicleID < table.rows.length; vehicleID++) {
        let updateMe = document.getElementById(`${idHeader}${colName}Row${vehicleID}`);
        updateMe.innerHTML = "False";
    }

}
