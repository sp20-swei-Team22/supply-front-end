$('.confirm').submit(async e => {
    e.preventDefault();

    // console.log(e);

    let confirmSend = e.target;
    let optionsCollection = confirmSend.children[1].children
    // console.log(optionsCollection);
    if (optionsCollection.length == 0) {
        alert('No vehicle data to send!');
    } else {
        vehicles = []
        let dateAdded = new Date(Date.now());
        // console.log(dateAdded.toISOString());
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
        console.log(vehicles);
    
        var url = 'https://supply.team22.softwareengineeringii.com/addVehicle';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify(vehicles)
        }).then(res => {
            if (res.status == 200) {
                alert('Vehicles added!');
            } else {
                alert('Something went wrong');
            }
        }).catch(err => {
            console.log('Error: ', err);
        });
    }
})