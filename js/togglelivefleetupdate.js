var switchDict = {}
$(document).on('change', '.updateSwitch', function (e) {
    // console.log(e); 
    // console.log(this);
    // console.log(this.parentNode.parentNode)
    // console.log(this.parentNode.parentNode.parentNode.parentNode.parentNode)
    // let switchInput = this.parentNode.parentNode.children[0].children[0];
    // let switchLabel = this.parentNode.parentNode.children[1];
    let fid = this.parentNode.parentNode.parentNode.parentNode.parentNode.id
    // console.log(fid);
    fid = fid.substring(fid.indexOf('t') + 1);
    // console.log(fid);


    if (fid in switchDict) {
        switchDict[fid].postMessage({'cmd': 'stop'})
        delete switchDict[fid]
    } else {
        var worker = new Worker('/supply-front-end/js/vehiclesworker.js');
        worker.postMessage({ 'cmd': 'start', 'fid': fid });
        worker.addEventListener('message', function (e) {
            // console.log(e.data);
            const generic = fid == 'home'
            let vehiclesJSON = e.data;
            let vehiclesData = formatVehicleJSON(vehiclesJSON, generic);
            // console.log(vehiclesData);
            let vehicleTable = generic ? 
                document.getElementById('homeTableTable') : 
                document.getElementById(`fleet${fid}Table`);
            // console.log(vehicleTable);
            let oldTBody = vehicleTable.querySelectorAll('tbody')[0];
            // console.log('Old ', oldTBody);
            vehicleTable.removeChild(oldTBody);
            let tbody = fillTBody(vehiclesData);
            // console.log('New ', tbody);
            vehicleTable.appendChild(tbody);

        }, false);
        switchDict[fid] = worker
    }
    // console.log(switchDict);
})


function fillTBody(data) {
    let tbody = document.createElement('TBODY');

    data.forEach(entry => {
        let row = document.createElement('TR');
        entry.forEach((colVal, col, _) => {
            let cell = document.createElement('TD');
            cell.appendChild(document.createTextNode(colVal));
            if (col == 0) {
                row.setAttribute('id', `VID${colVal}`)
                cell.setAttribute('onclick', 'getDispatch(this)');
                cell.setAttribute('data-toggle', 'modal');
                cell.setAttribute('data-target', '#dispatchRecordPopup')
            }
            row.append(cell);
        });
        tbody.appendChild(row);
    });
    return tbody;
}

function formatVehicleJSON(json, generic) {
    arr = []
    json.shift()
    json.forEach(vehicleDict => {
        // console.log(vehicleDict);
        let dateAdded = vehicleDict['date_added']
        let trimmedDate = dateAdded.substring(0, dateAdded.indexOf('T'));
        if (!generic) {
            arr.push(
                [vehicleDict['vehicleid'], vehicleDict['status'],
                `${vehicleDict['make']}: ${vehicleDict['model']}`, trimmedDate,
                vehicleDict['licenseplate'], vehicleDict['last_heartbeat']]
            );
        } else {
            arr.push(
                [vehicleDict['vehicleid'], vehicleDict['fleetid'], vehicleDict['status'],
                `${vehicleDict['make']}: ${vehicleDict['model']}`, trimmedDate,
                vehicleDict['licenseplate'], vehicleDict['last_heartbeat']]
            );
        }
    })
    return arr;
}
