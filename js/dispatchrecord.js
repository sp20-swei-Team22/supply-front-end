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
    fetch(url).then(function(response) {
        console.log(response.status);
        response.json().then(function(parsedJSON) {
            console.log(parsedJSON);
        })
        if (response.status == 200) {

        } else {
            alert('something went wrong');
        }
    }).catch(function(error) {
        console.error(error)
    });


    /* get dispatch record where all the courieres have this vID */
    const colNames = ['Dispatch ID', 'Order ID', 'Customer ID', 'Destination', 'Service Type', 'Time Order Created', 'Status'];
    const numCols = colNames.length;
    const numDispatches = 100;

    document.getElementById('dispatchRecordPopupLabel').innerHTML = `Vehicle ID: ${vehicleID}`;

    const modalTable = document.getElementById('modal-table');

    let popupTable = document.createElement('TABLE');
    popupTable.setAttribute('id', 'popupTable');
    popupTable.setAttribute('class', 'popup table-bordered table-sm');
    popupTable.setAttribute('max-width', '80%');

    let header = popupTable.createTHead();
    // And because technically a header isn't implicitly it's own row, we have to manually insert one first
    header.insertRow(0);
    for (var col = 0; col < numCols; col++) {
        let th = document.createElement('TH');
        let tr = popupTable.tHead.children[0];
        th.innerHTML = colNames[col];
        tr.appendChild(th);
    }

    /*
        Because we are utilising thead and not just tr's and td's, we will be defining a body in which our actual
        entries will be rendered
    */
    let tbody = document.createElement('TBODY');
    popupTable.appendChild(tbody);

    /*
        Now we are populating the table by row then by its cells
        But can probably map or forEach at a row level instead of working at a cell level, but need to see what pulling the SQL
        into JS looks like
    */
    for (var row = 0; row < numDispatches; row++) {
        let newRow = tbody.insertRow(row);
        for (col = 0; col < numCols; col++) {
            let newCell = newRow.insertCell(col);
            var newText;

            /* 
                This entire switch block is just random populating the cells of these rows sudo randomly
                but with somewhat expected inputs of data that we might pull from our database.
                This is where the SQL data will be inserted. But can probably map or forEach at a row level
                instead of working at a cell level
            */
            switch (col) {
                case 0:
                    let randomDID = Math.floor(Math.random() * 1000000000);
                    newText = document.createTextNode(randomDID);
                    break;
                case 1:
                    let randomOID = Math.floor(Math.random() * 1000000000);
                    newText = document.createTextNode(randomOID);
                    break;
                case 2:
                    let randomCID = Math.floor(Math.random() * 1000000000);
                    newText = document.createTextNode(randomCID);
                    break;
                case 3:
                    // newText = document.createTextNode("St. Edward's University");
                    let randomLat = Math.floor(Math.random() * (9000 - 100) + 100) / 100;
                    let randomLon = Math.floor(Math.random() * (18000 - 100) + 100) / 100;
                    randomLat *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
                    randomLon *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
                    newText = document.createTextNode(`Lat: ${randomLat}, Lon: ${randomLon}`);
                    break;
                    break;
                case 4:
                    let randomServiceNum = Math.floor(Math.random() * (5 - 1) + 1);
                    switch (randomServiceNum) {
                        case 1:
                            newText = document.createTextNode("RX");
                            break;
                        case 2:
                            newText = document.createTextNode("Events");
                            break;
                        case 3:
                            newText = document.createTextNode("Dry Cleaning");
                            break;
                        case 4:
                            newText = document.createTextNode("Coffee");
                            break;
                        default:
                            newText = document.createTextNode("Wot");
                            break;
                    }
                    break;
                case 5:
                    var testDate = randomDate(new Date(2019, 0, 1), new Date());
                    // var someDate = testDate.toLocaleDateString('en-GB', {
                    //     day: '2-digit',
                    //     month: '2-digit',
                    //     year: 'numeric',
                    //     hour: '2-digit',
                    //     minute: '2-digit',
                    //     second: '2-digit'
                    // })
                    dateAsStr = testDate.toISOString();
                    dateAsStr = dateAsStr.replace('T', ' ');
                    dateAsStr = dateAsStr.substring(0, dateAsStr.length - 5);
                    newText = document.createTextNode(dateAsStr);
                    break;
                case 6:
                    let randomStatusNum = Math.floor(Math.random() * (4 - 1) + 1);
                    switch (randomStatusNum) {
                        case 1:
                            newText = document.createTextNode("Queued");
                            break;
                        case 2:
                            newText = document.createTextNode("Running");
                            break;
                        case 3:
                            newText = document.createTextNode("Completed");
                            break;
                    }
                    break;
            }
            let colName = colNames[col];
            let firstLetter = colName.charAt(0).toLowerCase()
            let restOfWord = colName.substring(1, colName.length);
            colName = firstLetter.concat(restOfWord).replace(/ /g, '');
            newCell.setAttribute('id', `${colName}Row${row}`);
            newCell.appendChild(newText);
        }
    }
    modalTable.appendChild(popupTable);

    /* Our map of the current running dispatch will be appended here! */
    const modalMap = document.getElementById('modal-map');
    modalMapHeader = document.createElement('H3');
    modalMapHeader.innerHTML = 'Current Running Dispatch';
    modalMap.appendChild(modalMapHeader);

    $(document).ready(function() {
        /* Added sorted enum so that we can define a custom sort to status column */
        $.fn.dataTable.enum(['Running', 'Queued', 'Completed']);
        /* Enaabling date time formatting so that we can sort this table's dates */
        $.fn.dataTable.moment("DD/MM/YYYY HH:mm:ss a");
        /* Sorting logic for multicolumn sorts */
        $('table.popup').DataTable({
            order: [
                [5, 'asc'],
                [4, 'asc']
            ]
        }, {
            columnDefs: [{
                targets: [5],
                orderData: [5, 4]
            }]
        });
    });
}