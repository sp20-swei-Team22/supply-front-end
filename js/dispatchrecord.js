function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getDispatch(vehicle) {
    const vehicleID = vehicle.innerHTML;
    // console.log(vehicleID)

    var url = new URL("https://supply.team22.softwareengineeringii.com/getDispatch/"),
        params = {
            'vid': vehicleID
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    fetch(url).then(function (response) {
        // console.log(response.status);
        response.json().then(function (parsedJSON) {
            if (response.status == 200) {
                // console.log(parsedJSON);
                // parsedJSON.forEach(e => console.log(e));
                dispatchArr = []
                Object.keys(parsedJSON).forEach(function(key) {
                    index = key.lastIndexOf('D')
                    did = parseInt(key.substring(index + 1));
                    // console.log(did)
                    inner = parsedJSON[key];
                    dispatchArr.push(
                        [did, inner['orderid'], inner['customerid'], inner['destination'],
                        inner['serviceType'], inner['timeOrderCreated'], inner['status']
                    ])
                });
                
                const colNames = ['Dispatch ID', 'Order ID', 'Customer ID', 'Destination', 'Service Type', 'Time Order Created', 'Status'];

                document.getElementById('dispatchRecordPopupLabel').innerHTML = `Vehicle ID: ${vehicleID}`;

                const modalTable = document.getElementById('modal-table');

                let popupTable = document.createElement('TABLE');
                popupTable.setAttribute('id', 'popupTable');
                popupTable.setAttribute('class', 'popup table-bordered table-sm');
                popupTable.setAttribute('max-width', '80%');

                let header = popupTable.createTHead();
                header.insertRow(0);
                colNames.forEach(function (name) {
                    let th = document.createElement('TH');
                    let tr = popupTable.tHead.children[0];
                    th.innerHTML = name;
                    tr.appendChild(th);
                });
                let tbody = document.createElement('TBODY');
                popupTable.appendChild(tbody);
                dispatchArr.forEach(function(entry) {
                    var row = document.createElement('TR');
                    entry.forEach(function(colVal) {
                        var cell = document.createElement('TD');
                        cell.appendChild(document.createTextNode(colVal));
                        row.append(cell);
                    });
                    tbody.appendChild(row);
                });
                
                modalTable.appendChild(popupTable);

                /* Our map of the current running dispatch will be appended here! */
                const modalMap = document.getElementById('modal-map');
                modalMapHeader = document.createElement('H3');
                modalMapHeader.innerHTML = 'Current Running Dispatch';
                modalMap.appendChild(modalMapHeader);

                $(document).ready(function () {
                    /* Added sorted enum so that we can define a custom sort to status column */
                    $.fn.dataTable.enum(['Running', 'Queued', 'Completed']);
                    /* Enaabling date time formatting so that we can sort this table's dates */
                    $.fn.dataTable.moment("DD/MM/YYYY HH:mm:ss a");
                    /* Sorting logic for multicolumn sorts */
                    $('table.popup').DataTable({
                        order: [
                            [6, 'asc'],
                            [5, 'asc']
                        ]
                    }, {
                        columnDefs: [{
                            targets: [6],
                            orderData: [6, 5]
                        }]
                    });
                });
            } else {
                alert('something went wrong');
            }
        })
    }).catch(function (error) {
        console.error(error)
    });
}
