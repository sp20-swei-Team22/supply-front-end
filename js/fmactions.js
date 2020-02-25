function addVehicle(button) {
    // Post request
    alert('I will add a vehicle to the database!');

    console.log(button);
}

function removeVehicle(button) {
    // Post request
    alert('I will remove a vehicle from the database!');

    console.log(button);
}

function updateVehicle(button) {
    // Patch request
    alert('I will update a vehicle in the database!');

    // Extract fleet number out of the button ID
    let buttonId = button.id;
    let start = 5;
    let length = button.id.length;
    let sub = button.id.substring(start, buttonId.length);
    let index = /[a-z]/i.exec(sub).index;
    let fleetNumToUpdate = sub.substring(0, index);

    let colName = 'Status';
    let firstLetter = colName.charAt(0).toLowerCase()
    let restOfWord = colName.substring(1, colName.length);
    colName = firstLetter.concat(restOfWord).replace(/ /g, '');
    // For testing purpose this will a row
    let vehicleID = 3;
    let updateMe = document.getElementById(`fleet${fleetNumToUpdate}${colName}Row${vehicleID}`);
    updateMe.innerHTML = "False";
}