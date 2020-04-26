function getDispatch(vehicle) {
    const vehicleID = vehicle.innerHTML;

    var url = new URL("https://supply.team22.softwareengineeringii.com/supply/dispatch"),
        params = {
            'vid': vehicleID
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    fetch(url).then(function (response) {
        response.json().then(function (parsedJSON) {
            if (response.status == 200) {
                dispatchArr = formatDispatchJSON(parsedJSON)

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
                let tbody = fillTBody(dispatchArr, 'd');

                popupTable.appendChild(tbody);
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

                var worker = new Worker('/supply-front-end/js/workers/dispatchworker.js');
                worker.postMessage({ 'cmd': 'start', 'vid': vehicleID });
                worker.addEventListener('message', function (e) {
                    let dispatchJSON = e.data;
                    let dispatchArr = formatDispatchJSON(dispatchJSON);
                    let popupTable = document.getElementById('popupTable');
                    let oldTBody = popupTable.querySelectorAll('tbody')[0];
                    popupTable.removeChild(oldTBody);
                    let tbody = fillTBody(dispatchArr, 'd');
                    popupTable.appendChild(tbody);

                    $('table.popup').DataTable().clear().destroy();
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

                $('#dispatchRecordPopup').on('hidden.bs.modal', function (e) {
                    worker.postMessage({ 'cmd': 'stop' })
                    $('#modal-table').html("");
                    $('#modal-map').html("");
                });
            } else {
                alert('something went wrong');
            }
        })
    }).catch(function (error) {
        console.error(error)
    });
}

function formatDispatchJSON(parsedJSON) {
    dispatchArr = []
    Object.keys(parsedJSON).forEach(function (dispatchNum) {
        dispatch = parsedJSON[dispatchNum];
        let start = dispatch['start_time'];
        start = start.replace('T', ' ');
        dispatchArr.push(
            [dispatch['did'], dispatch['orderid'], dispatch['custid'],
            dispatch['endLocation']['humanReadable'],
            dispatch['serviceType'], start, dispatch['status']
            ])
    });
    return dispatchArr;
}
