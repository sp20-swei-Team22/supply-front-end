$(document).on('submit', '.confirm', async e => {
    e.preventDefault();

    let confirmSend = e.target;
    let confirmType = confirmSend.classList[1]
    let select = confirmSend.children[0];
    let optionsCollection = select.children;
    length = select.options.length;
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
        confirmType = confirmType.substring(0, 3);
        var url = `https://supply.team22.softwareengineeringii.com/supply/vehicles/${confirmType}`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(vehicles)
        }).then(res => {
            if (res.status == 200) {
                alert(`Vehicle${vehicles.length > 0 ? 's' : ''} ${confirmType == 'add' ? 'added' : 'removed'}!`);
                for (option in select.options) {
                    select.options.remove(0);
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
        let vehicleDict = {
            'fleetid': optionValueList[0],
            'make': optionValueList[1],
            'model': optionValueList[2],
            'licensePlate': optionValueList[3],
            'dateAdded': dateAdded.toISOString()
        };
        vehicles.push(vehicleDict);
    }
    return vehicles;
}

function postRemoveBody(optionsCollection) {
    vehicles = []
    for (var option = 0; option < optionsCollection.length; option++) {
        let optionValueList = optionsCollection[option].value.split(' ')
        let vehicleid = optionValueList[0].substring(optionValueList[0].indexOf(': ') + 1);
        let vehicleDict = {
            'vehicleid': vehicleid
        };
        vehicles.push(vehicleDict);
    }
    return vehicles;
}
