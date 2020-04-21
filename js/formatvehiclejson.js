function formatVehicleJSON(json) {
    arr = []
    json.forEach(vehicleDict => {
        // console.log(vehicleDict);
        let dateAdded = vehicleDict['date_added']
        let trimmedDate = dateAdded.substring(0, dateAdded.indexOf('T'));
        arr.push(
            [vehicleDict['vehicleid'], vehicleDict['fleetid'], vehicleDict['status'],
            `${vehicleDict['make']}: ${vehicleDict['model']}`, trimmedDate,
            vehicleDict['licenseplate'], vehicleDict['last_heartbeat']]
        );
    })
    return arr;
}