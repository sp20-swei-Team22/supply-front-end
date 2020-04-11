let loadTables = () => {
    let isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    let identity = localStorage.getItem('username');
    // console.log(identity)
    document.getElementById('accountName').text = identity;

    var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
        params = {
            'user': identity
        }

    if (isEmail(identity)) {
        let arr = identity.split('@');
        // console.log(arr);
        url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
            params = {
                'user': arr[0],
                'emailExt': arr[1],
            }
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // console.log(url)

    fetch(url).then(res => {
        res.json().then(json => {
            if (res.status == 200) {
                // console.log(json);
                alert('got the vehicles! if there are any ._.');
            } else {
                alert('something went wrong');
            }
        })
    }).catch(err => {
        console.log('Error: ', err);
    });

    json = [
        {
            'fleets': [11, 51, 31]
        },
        {
            'vehicleid': 12,
            'status': 1,
            'licenseplate': 1,
            'fleetid': 11,
            'make': 1,
            'model': 1,
            'current_lat': 1,
            'current_lon': 1,
            'last_heartbeat': 1,
            'date_added': '1T',
        },
        {
            'vehicleid': 22,
            'status': 2,
            'licenseplate': 2,
            'fleetid': 11,
            'make': 2,
            'model': 2,
            'current_lat': 2,
            'current_lon': 2,
            'last_heartbeat': 2,
            'date_added': '2T',
        },
        {
            'vehicleid': 32,
            'status': 3,
            'licenseplate': 3,
            'fleetid': 51,
            'make': 3,
            'model': 3,
            'current_lat': 3,
            'current_lon': 3,
            'last_heartbeat': 3,
            'date_added': '3T',
        },
        {
            'vehicleid': 42,
            'status': 4,
            'licenseplate': 4,
            'fleetid': 11,
            'make': 4,
            'model': 4,
            'current_lat': 4,
            'current_lon': 4,
            'last_heartbeat': 4,
            'date_added': '4T',
        },
        {
            'vehicleid': 52,
            'status': 5,
            'licenseplate': 5,
            'fleetid': 51,
            'make': 5,
            'model': 5,
            'current_lat': 5,
            'current_lon': 5,
            'last_heartbeat': 5,
            'date_added': '5T',
        },
        {
            'vehicleid': 62,
            'status': 6,
            'licenseplate': 6,
            'fleetid': 51,
            'make': 6,
            'model': 6,
            'current_lat': 6,
            'current_lon': 6,
            'last_heartbeat': 6,
            'date_added': '6T',
        }
    ];

    fleetIDs = json[0]['fleets'];
    fleets = {}
    fleetIDs.forEach(function (fleetID) {
        // console.log(fleetID)
        fleets[fleetID] = [];
    });
    
    // console.log(fleetIDs);
    arr = []
    json.shift()
    json.forEach(vehicleDict => {
        // console.log(vehicleDict);
        let dateAdded = vehicleDict['date_added']
        let trimmedDate = dateAdded.substring(0, dateAdded.indexOf('T'));
        arr.push(
            [vehicleDict['fleetid'], vehicleDict['vehicleid'], vehicleDict['status'],
            `${vehicleDict['make']}: ${vehicleDict['model']}`, trimmedDate,
            vehicleDict['licenseplate'], vehicleDict['last_heartbeat']]
        );
    })
    // console.log(arr);

    
    arr.forEach(entry => {
        // console.log(entry);
        key = entry[0];
        // entry.shift();
        fleets[key].push(entry.slice(1,entry.length));
    })
    // console.log(arr);
    // console.log(fleets);
    
    var colNames = ['Vehicle ID', 'Fleet ID', 'Status', 'Vehicle Type', 'Date Added', 'Liscence Plate', 'Last Heartbeat'];

    // console.log(arr);
    arr.forEach(e => {
        // console.log(e);
        let vid = e[0];
        e[0] = e[1]
        e[1] = vid
        // console.log(e);
    })
    // console.log(arr);

    let homeTableDiv = document.getElementById('homeTableDiv');
    homeTable = buildTable('homeTable', colNames, arr);
    homeTable.setAttribute('class', 'home')
    homeTableDiv.appendChild(homeTable);

    let rows = homeTable.rows;
    let vids = []
    for (var row = 1; row < rows.length; row++) {
        let rowID = rows.item(row).id;
        let vid = parseInt(rowID.substring(rowID.lastIndexOf('D') + 1));
        // console.log(rowID);  
        // console.log(vid);
        vids.push(vid);
    }

    colNames.splice(1,1)

    var myTab = document.getElementById('myTab');
    var myTabContent = document.getElementById('myTabContent');

    Object.keys(fleets).forEach(fleetNum => {
        let idHeader = `fleet${fleetNum}`;
        fleetData = fleets[fleetNum];
        // console.log(fleetData);

        /*
            First generate the tab
        */
        let tabLI = document.createElement('LI');
        tabLI.setAttribute('class', 'nav-item');

        let tabA = document.createElement('A');
        let tabId = `${idHeader}Tab`
        tabA.setAttribute('class', 'nav-link')
        tabA.setAttribute('id', tabId);
        tabA.setAttribute('data-toggle', 'tab');
        tabA.setAttribute('href', `#${idHeader}`);
        tabA.setAttribute('rold', 'tab');
        tabA.setAttribute('aria-controls', idHeader);
        tabA.setAttribute('aria-selected', 'false');
        tabA.innerHTML = `Fleet ${fleetNum}`;

        tabLI.appendChild(tabA);
        myTab.insertBefore(tabLI, myTab.children[1]);

        let tabUpdateCollapose = document.createElement('BUTTON');
        tabUpdateCollapose.setAttribute('data-toggle', 'collapse');
        tabUpdateCollapose.setAttribute('class', 'coll collapsed');
        tabUpdateCollapose.setAttribute('href', `#collapse${idHeader}`);
        tabUpdateCollapose.setAttribute('role', 'button');
        tabUpdateCollapose.setAttribute('aria-expanded', 'false');
        tabUpdateCollapose.setAttribute('aria-controls', `collapse${idHeader}`);
        tabUpdateCollapose.innerHTML = 'Fleet Actions';

        let tabUpdateWrapper = document.createElement('DIV');
        tabUpdateWrapper.setAttribute('class', 'collapse');
        tabUpdateWrapper.setAttribute('id', `collapse${idHeader}`);

        let tabUpdateContainer = document.createElement('DIV');
        tabUpdateContainer.setAttribute('class', 'container');
        tabUpdateContainer.setAttribute('style', 'margin: 2vh 0 2vh 0;');

        let tabUpdateActionDiv = document.createElement('DIV');
        tabUpdateActionDiv.setAttribute('id', 'actionDiv');
        tabUpdateActionDiv.setAttribute('class', 'row align-items-start');

        let tabUpdatePillList = document.createElement('UL');
        tabUpdatePillList.setAttribute('class', 'nav nav-pills flex-column col-2');
        tabUpdatePillList.setAttribute('role', 'tablist');

        let actions = ['Add', 'Remove', 'Update'];
        actions.forEach((action) => {
            let li = document.createElement('LI');
            li.setAttribute('class', 'nav-item');
            let a = document.createElement('A');
            action == 'Add' ? a.setAttribute('class', 'nav-link active') : a.setAttribute('class', 'nav-link');
            a.setAttribute('id', `${idHeader}${action}Pill`);
            a.setAttribute('data-toggle', 'pill');
            a.setAttribute('href', `#${idHeader}${action}`);
            a.setAttribute('role', 'pill');
            a.setAttribute('aria-controls', `${idHeader}${action}`);
            action == 'Add' ? a.setAttribute('aria-selected', 'true') : a.setAttribute('aria-selected', 'false');
            a.innerHTML = `${action} Vehicle`;
            li.appendChild(a);
            tabUpdatePillList.appendChild(li);
        });

        let actionTabContent = document.createElement('DIV');
        actionTabContent.setAttribute('class', 'tab-content col');


        // Add Vehicles
        let addTab = document.createElement('DIV');
        addTab.setAttribute('class', 'tab-pane fade show active');
        addTab.setAttribute('id', `${idHeader}Add`);
        addTab.setAttribute('role', 'pillpanel');
        addTab.setAttribute('aria-labelledby', `${idHeader}AddPill`);

        let addRow = document.createElement('DIV');
        addRow.setAttribute('class', 'row');

        let addFormCol = document.createElement('FORM');
        addFormCol.setAttribute('class', `col addVehicle ${idHeader}`);
        addFormCol.setAttribute('style', 'text-align: right;');
        
        let submitAddFormBtn = document.createElement('BUTTON');
        submitAddFormBtn.setAttribute('type', 'submit');
        submitAddFormBtn.innerHTML = 'Submit All';

        let anotherFormBtn = document.createElement('BUTTON');
        anotherFormBtn.innerHTML = 'Another Form';

        addFormCol.appendChild(submitAddFormBtn);
        addFormCol.appendChild(anotherFormBtn);

        let formAttr = {
            'Make:': ['make', 'Ex: Tesla'],
            'Model:': ['model', 'Ex: Model-X'],
            'License Plate:': ['liceseplate', 'Ex: FA8912']
        }
        Object.keys(formAttr).forEach(e => {
            let attrDiv = document.createElement('DIV');
            attrDiv.setAttribute('class', 'form-group row');

            let attrLabel = document.createElement('LABEL');
            attrLabel.setAttribute('class', 'col-sm-5');
            attrLabel.setAttribute('for', `${formAttr[e][0]}`);
            attrLabel.innerHTML = e;

            let inputDiv = document.createElement('DIV');
            inputDiv.setAttribute('class', 'col-sm-7');

            let attrInput = document.createElement('INPUT');
            attrInput.setAttribute('type', 'text');
            attrInput.setAttribute('id', `${idHeader}${formAttr[e][0]}`);
            attrInput.setAttribute('placeholder', `${formAttr[e][1]}`)

            inputDiv.appendChild(attrInput);

            attrDiv.appendChild(attrLabel);
            attrDiv.appendChild(inputDiv);
            
            addFormCol.appendChild(attrDiv);
        });

        let addConfirmCol = document.createElement('DIV');
        addConfirmCol.setAttribute('class', 'col');

        let addConfirmForm = document.createElement('FORM');
        addConfirmForm.setAttribute('class', 'confirm add');

        let confirmRegBtn = document.createElement('BUTTON');
        confirmRegBtn.setAttribute('type', 'submit');
        confirmRegBtn.innerHTML = 'Confirm Registration';

        let confirmRegSelect = document.createElement('SELECT');
        confirmRegSelect.setAttribute('class', 'selectsForUpdates');
        // confirmRegSelect.setAttribute('id', 'vehiclesToAdd');
        confirmRegSelect.setAttribute('multiple', 'true');
        confirmRegSelect.setAttribute('size', '5');
        confirmRegSelect.setAttribute('style', 'width: 100%');

        addConfirmForm.appendChild(confirmRegBtn);
        addConfirmForm.appendChild(confirmRegSelect);

        addConfirmCol.appendChild(addConfirmForm);

        addRow.appendChild(addFormCol);
        addRow.appendChild(addConfirmCol);

        addTab.appendChild(addRow);

        // Remove Vehicles
        let removeTab = document.createElement('DIV');
        removeTab.setAttribute('class', 'tab-pane fade');
        removeTab.setAttribute('id', `${idHeader}Remove`);
        removeTab.setAttribute('role', 'pillpanel');
        removeTab.setAttribute('aria-labelledby', `${idHeader}RemovePill`);

        let canDelRow = document.createElement('DIV');
        canDelRow.setAttribute('class', 'row');

        let canDelForm = document.createElement('FORM');
        canDelForm.setAttribute('class', 'col removeVehicle');

        let desc = document.createElement('A');
        desc.innerHTML = 'Double click the vehicle you want to remove';

        let canDelSelect = document.createElement('SELECT');
        canDelSelect.setAttribute('class', 'vidsThatCanBeDeleted');
        canDelSelect.setAttribute('multiple', 'true');
        canDelSelect.setAttribute('size', '5');
        canDelSelect.setAttribute('style', 'width: 100%');
        canDelSelect.setAttribute('ondbclick', 'alert(this);');

        fleetData.forEach(e => {
            // console.log(e);
            // console.log(e[0]);
            let delOptions = document.createElement('OPTION');
            delOptions.setAttribute('value', e[0]);
            delOptions.innerHTML = `Vehicle ID: ${e[0]}`;
            canDelSelect.appendChild(delOptions);
        })

        canDelForm.appendChild(desc);
        canDelForm.appendChild(canDelSelect);

        canDelRow.appendChild(canDelForm);

        removeTab.appendChild(canDelRow);
        // console.log(removeTab);

        let delConfirmRow = document.createElement('DIV');
        delConfirmRow.setAttribute('class', 'row');
        
        let delConfirmCol = document.createElement('DIV');
        delConfirmCol.setAttribute('class', 'col');

        let delConfirmForm = document.createElement('FORM');
        delConfirmForm.setAttribute('class', 'confirm remove');

        let delConfirmBtn = document.createElement('BUTTON');
        delConfirmBtn.innerHTML = 'Confirm Removal';

        let delConfirmSelect = document.createElement('SELECT');
        delConfirmSelect.setAttribute('class', 'selectsForUpdates');
        delConfirmSelect.setAttribute('multiple', 'true');
        delConfirmSelect.setAttribute('size', '5');
        delConfirmSelect.setAttribute('style', 'width: 100%');

        delConfirmForm.appendChild(delConfirmBtn);
        delConfirmForm.appendChild(delConfirmSelect);

        delConfirmCol.appendChild(delConfirmForm);
        delConfirmRow.appendChild(delConfirmCol);

        removeTab.appendChild(delConfirmRow);

        // Update Vehicles
        let updateTab = document.createElement('DIV');
        updateTab.setAttribute('class', 'tab-pane fade');
        updateTab.setAttribute('id', `${idHeader}Update`);
        updateTab.setAttribute('role', 'pillpanel');
        updateTab.setAttribute('aria-labelledby', `${idHeader}UpdatePill`);

        actionTabContent.appendChild(addTab);
        actionTabContent.appendChild(removeTab);
        actionTabContent.appendChild(updateTab);

        tabUpdateActionDiv.appendChild(tabUpdatePillList);
        tabUpdateActionDiv.appendChild(actionTabContent);

        tabUpdateContainer.appendChild(tabUpdateActionDiv);
        
        tabUpdateWrapper.appendChild(tabUpdateContainer);

        // tabUpdateCollapose.appendChild(tabUpdateWrapper);



        /* 
            Now the tab content
        */
        let tabContentContainer = document.createElement('DIV');
        tabContentContainer.setAttribute('class', 'tab-pane fade');
        tabContentContainer.setAttribute('id', idHeader);
        tabContentContainer.setAttribute('role', 'tabpanel');
        tabContentContainer.setAttribute('aria-labelledby', `${idHeader}Tab`)
        
        let switchRowVis = switchMaker(idHeader, 'visSwitch', 'Map', 'Table');
        let switchTitleVis = switchTitleMaker('Toggle Viewing Methods');

        let colVis = document.createElement('DIV');
        colVis.setAttribute('class', 'col');

        colVis.appendChild(switchTitleVis);
        colVis.appendChild(switchRowVis);        
        
        let switchRowUpdate = switchMaker(null, 'updateSwitch', 'Off', 'On');  
        let switchTitleUpdate = switchTitleMaker('Toggle Live Fleet Update');

        let colUpdate = document.createElement('DIV');
        colUpdate.setAttribute('class', 'col')

        colUpdate.appendChild(switchTitleUpdate);
        colUpdate.appendChild(switchRowUpdate);

        let switchesRow = document.createElement('DIV');
        switchesRow.setAttribute('class', 'row');

        switchesRow.appendChild(colVis);
        switchesRow.appendChild(colUpdate);

        tabContentContainer.appendChild(switchesRow);
        tabContentContainer.appendChild(tabUpdateCollapose);
        tabContentContainer.appendChild(tabUpdateWrapper);
        

        let mapDiv = document.createElement('DIV');
        mapDiv.setAttribute('id', `${idHeader}MapDiv`);
        mapDiv.setAttribute('class', 'viewer mapDiv');
        mapDiv.innerHTML = 'Map goes here';

        tabContentContainer.appendChild(mapDiv);

        let tableDiv = document.createElement('DIV');
        tableDiv.setAttribute('id', `${idHeader}TableDiv`);
        tableDiv.setAttribute('class', 'viewer tableDiv');

        let table = buildTable(idHeader, colNames, fleetData);
        table.setAttribute('class', 'index');

        tableDiv.appendChild(table);
        tabContentContainer.appendChild(tableDiv);
        myTabContent.insertBefore(tabContentContainer, myTabContent.children[1]);
    })
    $(document).ready(function () {
        $('table.index').DataTable({
            columnDefs: [{
                targets: 2,
                orderable: false
            }]
        });
        $('table.home').DataTable({
            columnDefs: [{
                targets: 3,
                orderable: false
            }]
        });
    });
}

let switchTitleMaker = (title) => {
    let switchTitle = document.createElement('DIV');
    switchTitle.setAttribute('class', 'row justify-content-center');
    switchTitle.setAttribute('style', 'margin-bottom: 5px');
    switchTitle.innerHTML = title;

    return switchTitle
}

let switchMaker = (id, classes, left, right) => {
        let switchLabelVis = document.createElement('LABEL');
        switchLabelVis.setAttribute('class', 'switch vis');
        switchLabelVis.setAttribute('style', 'text-align: center');
        let switchInputVis = document.createElement('INPUT');
        switchInputVis.setAttribute('type', 'checkbox');
        switchInputVis.setAttribute('class', classes);
        if (id != null) switchInputVis.setAttribute('id', id);
        
        let switchSpanVis = document.createElement('SPAN');
        switchSpanVis.setAttribute('class', 'slider round');

        switchLabelVis.appendChild(switchInputVis);
        switchLabelVis.appendChild(switchSpanVis);

        let switchLeft = document.createElement('LABEL');
        switchLeft.setAttribute('class', 'leftToggle');
        switchLeft.innerHTML = left;
        let switchRight = document.createElement('LABEL');
        switchRight.setAttribute('class', 'rightToggle');
        switchRight.innerHTML = right;
        
        
        let switchRowVis = document.createElement('DIV');
        switchRowVis.setAttribute('class', 'row justify-content-center');

        switchRowVis.appendChild(switchLeft);
        switchRowVis.appendChild(switchLabelVis);
        switchRowVis.appendChild(switchRight);

        return switchRowVis;
}

let buildTable = (idHeader, colNames, data) => {
    // console.log(data)
    let table = document.createElement('TABLE');
    table.setAttribute('id', `${idHeader}Table`);
    table.setAttribute('class', 'table-bordered table-sm');
    table.setAttribute('max-width', '100vw');

    let header = table.createTHead();
    header.insertRow(0);
    colNames.forEach(name => {
        let th = document.createElement('TH');
        let tr = table.tHead.children[0];
        th.innerHTML = name;
        tr.appendChild(th);
    });
    let tbody = document.createElement('TBODY');
    table.appendChild(tbody);

    data.forEach(entry => {
        let row = document.createElement('TR');
        entry.forEach((colVal, col, _) => {
            let cell = document.createElement('TD');
            cell.appendChild(document.createTextNode(colVal));
            if (col == 0) {
                row.setAttribute('id', `${idHeader}VID${colVal}`)
                cell.setAttribute('onclick', 'getDispatch(this)');
                cell.setAttribute('data-toggle', 'modal');
                cell.setAttribute('data-target', '#dispatchRecordPopup')
            }
            row.append(cell);
        });
        tbody.appendChild(row);
    });

    return table;
}