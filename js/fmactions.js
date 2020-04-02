/* Extract fleet number out of the button ID */
function getFleetNumFromButtonId(button) {
    let buttonId = button.id;
    // console.log(buttonId)
    var startOfFleetNum = buttonId.indexOf('t') + 1;
    let sub = button.id.substring(startOfFleetNum, buttonId.length);
    let end = /[a-z]/i.exec(sub).index;
    let fleetNumToUpdate = sub.substring(0, end);
    return fleetNumToUpdate;
}
function getVerbFromButtonId(button) {
    let buttonId = button.id;
    var verb;
    if (buttonId.includes('Add') || buttonId.includes('Register')) {
        verb = 'Add'
    } else if (buttonId.includes('Remove') || buttonId.includes('Delete')) {
        verb = 'Remove'
    }
    return verb;
}
function getActionVars(button) {
    const fleetNumToUpdate = getFleetNumFromButtonId(button);
    const idHeader = `fleet${fleetNumToUpdate}`;
    const verb = getVerbFromButtonId(button);

    var myForm = document.getElementById(`${idHeader}${verb}NewForm`);
    var myFormEle = null;
    numRowsOfEntries = null;
    if (myForm != null) {
        myFormEle = myForm.elements;
        numRowsOfEntries = myFormEle.length - 2;
    }
    return [fleetNumToUpdate, idHeader, verb, myForm, myFormEle, numRowsOfEntries]
}
function postOut(postBody, verb, myForm, fleetNumToUpdate) {
    if (Object.keys(postBody).length > 0) {
        postBody['fleetNum'] = fleetNumToUpdate
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(postBody)
        }
        // console.log(payload);
        const url = `https://supply.team22.softwareengineeringii.com/${verb.toLowerCase()}Vehicle`;

        fetch(url, payload).then(function (response) {
            // console.log(response.status);
            if (response.status == 200) {
                alert(`Vehicles Successfully ${verb}ed!`);
                /* 
                    Since the table update was successful, we can either reload the page, or... idk what else.
                    Confer with team :C
                */
                myForm.outerHTML = "";
            } else {
                alert('Something went wrong!');
                alert(response.json());
            }
        }).catch(function (error) {
            console.error(error);
        });
    } else {
        alert('You cannot send nothing!')
    }
}

function buildActionTable(button) {
    // console.log(button.id);
    [fleetNumToUpdate, idHeader, verb, ..._] = getActionVars(button);

    // console.log(idHeader);
    // console.log(verb);

    const findExistingBtn = document.getElementById(`${idHeader}${verb}NewBtn`);
    // console.log(findExistingBtn);

    let myTable;
    var names = ['Make', 'Model', 'Liscence Plate'];
    if (verb == 'Remove') {
        names = ['Vehicle ID']
    }
    const numCols = names.length;
    /* 
        Only generate a new table, form and buttons if 
        they dont exist already. We only have to check
        for one of them because they're a package deal
    */
    if (findExistingBtn == null) {
        /* 
            This button will allow more input rows if the fleet manager
            wants to input multiple vehicles entries
        */
        let newActionButton = document.createElement('BUTTON');
        newActionButton.innerHTML = `${verb} another`;
        newActionButton.setAttribute('id', `${idHeader}${verb}NewBtn`);
        newActionButton.setAttribute('class', 'smol');
        newActionButton.setAttribute('onclick', 'buildActionTable(this)');
        newActionButton.setAttribute('type', 'button');

        /* 
            Old add vehicle button can't be clicked anymore 
            TODO: need to disable the hover properties when disabled
        */
        button.disabled = true;

        let submitNewButton = document.createElement('BUTTON');
        submitNewButton.innerHTML = 'Submit';
        submitNewButton.setAttribute('id', `${idHeader}${verb}SubmitNewBtn`);
        submitNewButton.setAttribute('class', 'smol');
        submitNewButton.setAttribute('type', 'button');
        submitNewButton.setAttribute('onclick', `${verb.toLowerCase()}Vehicles(this)`);

        /* 
            Creating a new form so we can just capture all the children inputs
            instead of having to index for each input. Kind of
        */
        var vehicleForm = document.createElement('FORM');
        vehicleForm.setAttribute('id', `${idHeader}${verb}NewForm`);
        vehicleForm.setAttribute('object-fit', 'contain');
        const actionDiv = document.getElementById(`${idHeader}ActionRow`);

        /* Makes it easier if we also want a fleet manager to use multiple action buttons at a time */
        actionDiv.appendChild(vehicleForm);

        /* 
            Table mostly for formatting and container filling. 
            Abusing tables build in rows and column nature.
        */
        var vehicleActionTable = document.createElement('TABLE');
        vehicleActionTable.setAttribute('id', `${idHeader}${verb}NewTable`);
        vehicleActionTable.setAttribute('max-width', '100vw');
        let header = vehicleActionTable.createTHead();
        header.insertRow(0);

        /* 
            Populate headers with relavent to fleet manager IN THE PARTICULAR INSTANCE
            that he is just interacting with fleet. Other things like fleet ID are 
            implicit based on the input and form they are entering the data into
            TLDR, there may be other data that get's added to the POST body
            that the fleet manager doesn't need to enter themselves
        */
        names.forEach(function (colName) {
            let th = document.createElement('TH');
            let tr = vehicleActionTable.tHead.children[0];
            th.innerHTML = colName
            tr.appendChild(th);
        });

        tBody = document.createElement('TBODY');
        vehicleActionTable.appendChild(tBody);
        vehicleForm.appendChild(vehicleActionTable);
        vehicleForm.appendChild(newActionButton);
        vehicleForm.appendChild(submitNewButton);
    }

    /* // Fetch table, perhaps redundant on first click?, but it's one line... */
    myTable = document.getElementById(`${idHeader}${verb}NewTable`);
    var rowCount = myTable.rows.length;
    tbody = myTable.tBodies[0];
    var newRow = tbody.insertRow();
    newRow.id = `${idHeader}${verb}VehicleEntry${rowCount}`;
    for (var col = 0; col <= numCols; col++) {
        let newCell = newRow.insertCell(col);
        if (col < numCols) {
            let newVehicleInput = document.createElement('INPUT');
            newVehicleInput.setAttribute('id', `input${rowCount}${names[col]}`);
            newVehicleInput.setAttribute('style', 'margin-bottom: 10px;; margin-right: 5px;');
            newCell.appendChild(newVehicleInput);
        } else {
            let delRow = document.createElement('H1');
            delRow.innerHTML = "X";
            newCell.appendChild(delRow);
            newCell.setAttribute('id', `del${newRow.id}`);
            newCell.setAttribute('onclick', 'deleteRow(this)');
        }
    }
}

function deleteRow(deleteMe) {
    // console.log(deleteMe);
    var id = deleteMe.id;

    var delMe = id.substring(3);
    [fleetNumToUpdate, idHeader, verb, myForm, ..._] = getActionVars(deleteMe);

    // console.log(id);

    // console.log(delMe);

    /*
        Need to figure out ID from this particuar button.
        Different enough from the generic instance 
    */
    var fleetTableID = `${idHeader}${verb}NewTable`;
    var fleetTableDom = document.getElementById(fleetTableID);
    var fleetTableNumRows = fleetTableDom.rows.length;

    var row = document.getElementById(delMe);
    const onlyOneEntry = fleetTableNumRows == 2;
    if (onlyOneEntry) {
        myForm.outerHTML = "";
        var button = document.getElementById(`${idHeader}${verb}Button`);
        button.disabled = false;

    } else {
        row.parentNode.removeChild(row);
    }
}

function addVehicles(button) {
    // console.log(button.id);
    [fleetNumToUpdate, idHeader, verb, myForm, myFormEle, numRowsOfEntries] = getActionVars(button);

    let postBody = {}
    for (var row = 0; row < numRowsOfEntries; row += 3) {
        let make = myFormEle[row].value;
        let model = myFormEle[row + 1].value;
        let lp = myFormEle[row + 2].value;
        var rowNum = Math.floor(row / 3) + 1;
        if (make.length == 0 || model.length == 0 || lp.length == 0) {
            alert(`One of the entries in row ${rowNum} is partially filled!`);
            continue;
        } else {
            postBody[`newVechicle${rowNum}`] = {
                'Make': make,
                'Model': model,
                'LicensePlate': lp
            }
        }
    }

    // console.log(postBody);
    postOut(postBody, verb, myForm, fleetNumToUpdate);
}

function removeVehicles(button) {
    console.log(button.id);
    [fleetNumToUpdate, idHeader, verb, myForm, myFormEle, numRowsOfEntries] = getActionVars(button);
    vids = []
    let postBody = {}
    for (var row = 0; row < numRowsOfEntries; row++) {
        let vid = myFormEle[row].value;
        vids.push(vid);
        if (vid.length == 0) {
            alert(`Entry at row ${row + 1} is empty!`);
            continue;
        } else {
            postBody[`vid${row + 1}`] = vid;
        }
    }

    // console.log(postBody);
    postOut(postBody, verb, myForm, fleetNumToUpdate);
    // console.log(idHeader);
    vids.forEach(vid => {
        rowToDel = document.getElementById(`${idHeader}VID${vid}`);
        rowToDel.parentNode.removeChild(rowToDel);
    });
}
