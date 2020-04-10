$(document).on('submit', '.confirm', async e => {
    e.preventDefault();
    // console.log(e);

    let confirmSend = e.target;
    // console.log(confirmSend);
    let confirmType = confirmSend.classList[1]
    // console.log(confirmType);
    let select = confirmSend.children[1];
    let optionsCollection = select.children;
    length = select.options.length;
    // console.log(optionsCollection);
    if (length == 0) {
        alert('No vehicle data to send!');
    } else {
        vehicles = [];
        switch (confirmType) {
            case 'add':
                vehicles = postAddBody(optionsCollection);
                break;
                
            case 'remove':
                vehicles = postRemoveBody(optionsCollection);
                break;
            }
        // console.log(vehicles);
                
        var url = `https://supply.team22.softwareengineeringii.com/${confirmType}Vehicle`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(vehicles)
        }).then(res => {
            // console.log(select);
            // console.log(length);
            if (res.status == 200) {
                alert(`Vehicle${vehicles.length > 0 ? 's' : ''} ${confirmType == 'add' ? 'added' : 'removed'}!`);
                for (var i = length - 1; i >= 0; i--) {
                    select.options[i] = null;
                }
            } else {
                alert('Something went wrong');
            }
        }).catch(err => {
            console.log('Error: ', err);
        });
    }
});

function postAddBody(optionsCollection) {
    vehicles = []
    let dateAdded = new Date(Date.now());
    for (var option = 0; option < optionsCollection.length; option++) {
        let optionValueList = optionsCollection[option].value.split(' ')
        // console.log(optionValueList);
        vehicleDict = {
            'fleetid': optionValueList[0],
            'make': optionValueList[1],
            'model': optionValueList[2],
            'licensePlate': optionValueList[3],
            'dateAdded': dateAdded.toISOString()
        };
        // console.log(vehicleDict);
        vehicles.push(vehicleDict);
    }
    return vehicles;
}

function postRemoveBody(optionsCollection) {
    vehicles = []
    for (var option = 0; option < optionsCollection.length; option++) {
        let optionValueList = optionsCollection[option].value.split(' ')
        // console.log(optionValueList);
        let vehicleid = optionValueList[0].substring(optionValueList[0].indexOf(': ') + 1, );
        // console.log(fleetid);
        vehicleDict = {
            'vehicleid': vehicleid
        };
        // console.log(vehicleDict);
        vehicles.push(vehicleDict);
        console.log(vehicleid);
        let row = document.getElementById(`vid${vehicleid}`);
        let tbody = row.parentElement;
        console.log(tbody);
        tbody.removeChild(row);
    }
    return vehicles;
}
