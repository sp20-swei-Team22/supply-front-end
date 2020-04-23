var activeWorkers = {};
var vehicleMarks = {};
let loadTables = () => {
    let identity = localStorage.getItem('username');
    // console.log(identity)
    document.getElementById('accountName').text = identity;
    var url = new URL("https://supply.team22.softwareengineeringii.com/supply/fleets"),
        params = {
            'user': identity
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // console.log(url)
    fetch(url).then(fleetRes => {
        fleetRes.json().then(fleets => {
            if (fleetRes.status == 200) {
                url = new URL("https://supply.team22.softwareengineeringii.com/supply/vehicles"),
                    params = {
                        'user': identity
                    }
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
                // console.log(url)

                fetch(url).then(vehicleRes => {
                    vehicleRes.json().then(json => {
                        if (vehicleRes.status == 200) {
                            // console.log(json);
                            // alert('got the vehicles! if there are any ._.');
                            fleetNums = []
                            Object.keys(fleets).forEach(fleet => {
                                fleetNums.push(fleets[fleet]['fleetid']);
                            })
                            // console.log(fleetNums);
                            // console.log(json)
                            let arr = formatVehicleJSON(json, 'o');
                            // console.log(arr);

                            let homeTable = document.getElementById('homeTable');
                            let tbody = fillTBody(arr, 'o');
                            homeTable.appendChild(tbody);

                            let deleteSelect = document.getElementById('vidsThatCanBeDeleted');
                            // console.log(deleteSelect);
                            deleteOptionFormat(deleteSelect, arr);
                            // console.log(deleteSelect);

                            var myTab = document.getElementById('myTab');
                            fleetNums.forEach(fleetNum => {
                                let idHeader = `fleet${fleetNum}`;

                                /*
                                    First generate the tab
                                */
                                let tabLI = document.createElement('LI');
                                tabLI.setAttribute('class', 'nav-item mytab');

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

                            })
                            mapboxgl.accessToken = 'pk.eyJ1Ijoia29tb3RvNDE1IiwiYSI6ImNrOHV1cGp3bDA1bG0zZ282bmZhdDZjeWYifQ.2w_4X8WR5lFXvsmp6TeHEg';
                            var map = new mapboxgl.Map({
                                container: 'homeMap', // container id
                                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                                center: [-97.7553, 30.2264], // starting position [lng, lat]
                                zoom: 13 // starting zoom
                            });

                            console.log(json)
                            var vids = [];
                            var geojsons = [];
                            json.forEach(car => {
                                let vid = car['vehicleid']
                                let geojson = {
                                    type: 'Feature',
                                    geometry: {
                                        type: "Point",
                                        coordinates: [car.current_lon, car.current_lat],
                                        id: car.vehicleid.toString()
                                    }
                                }
                                vids.push(vid);
                                geojsons.push(geojson);
                                vehicleMarks[vid] = geojson;
                            });
                            console.log(geojsons);
                            //This needs a datastream url in order for the points to be dynamic
                            //Let me know if we want to do a pop up for the cars with their info
                            map.on('load', function () {
                                //Eventually this code should set the datastream for the window every 1.5 seconds??
                                // window.setInterval((){
                                //   map.getSource(id).setData(dataStreamUrl);
                                // }, 1500);
                                console.log(geojsons);
                                for (car in geojsons) {
                                    var id = geojsons[car].geometry.id.toString()
                                    map.addSource(id, {
                                        'type': 'geojson',
                                        'data': geojsons[car]
                                    });
                                    //console.log(id)
                                    map.addLayer({
                                        'id': id,
                                        'type': 'symbol',
                                        'source': id,
                                        'layout': {
                                            // get the icon name from the source's "icon" property
                                            // concatenate the name to get an icon from the style's sprite sheet
                                            // get the title name from the source's "title" property
                                            'icon-image': 'car-15',

                                        }
                                    });
                                }
                            });

                            var worker = new Worker('/supply-front-end/js/workers/vehiclesworker.js');
                            worker.postMessage({ 'cmd': 'start', 'fid': 'home' });
                            worker.addEventListener('message', function (e) {
                                // console.log(e.data);
                                let vehiclesJSON = e.data;
                                let vehiclesData = formatVehicleJSON(vehiclesJSON);
                                // console.log(vehiclesData);
                                let vehicleTable = document.getElementById('homeTable')
                                // console.log(vehicleTable);
                                let oldTBody = vehicleTable.querySelectorAll('tbody')[0];
                                // console.log('Old ', oldTBody);
                                vehicleTable.removeChild(oldTBody);
                                let tbody = fillTBody(vehiclesData, 'o');
                                // console.log('New ', tbody);
                                vehicleTable.appendChild(tbody);

                            }, false);
                            activeWorkers['home'] = worker

                            $(document).ready(function () {
                                $('table.home').DataTable().clear().destroy();
                                $('table.home').DataTable({
                                    columnDefs: [{
                                        targets: 3,
                                        orderable: false
                                    }]
                                });
                            });
                        } else {
                            alert('something went wrong');
                        }
                    })
                }).catch(err => {
                    console.log('Error: ', err);
                });
            } else {
                alert('something went wrong');
            }
        })
    }).catch(err => {
        console.log(err)
    });
}

$(document).on('click', '.nav-item.mytab', function (e) {
    // console.log(e);
    let tabID = this.children[0].id;
    let fleet = tabID.substring(0, tabID.indexOf('T'));
    // console.log(fleet);
    let fid = fleet.substring(fleet.indexOf('t') + 1);
    adjustUpdateForm(fid);

    // console.log(fid);
    // console.log(activeWorkers);
    // console.log(Object.keys(activeWorkers).length == 1);
    Object.keys(activeWorkers).forEach(tab => {
        activeWorkers[tab].postMessage({ 'cmd': 'stop' })
        delete activeWorkers[tab]
    })
    var worker = new Worker('/supply-front-end/js/vehiclesworker.js');
    worker.postMessage({ 'cmd': 'start', 'fid': fid });
    worker.addEventListener('message', function (e) {
        // console.log(e.data);
        let vehiclesJSON = e.data;
        let vehiclesData = formatVehicleJSON(vehiclesJSON);
        // console.log(vehiclesData);
        let vehicleTable = document.getElementById('homeTable')
        // console.log(vehicleTable);
        let oldTBody = vehicleTable.querySelectorAll('tbody')[0];
        // console.log('Old ', oldTBody);
        vehicleTable.removeChild(oldTBody);
        let tbody = fillTBody(vehiclesData, 'o');
        // console.log('New ', tbody);
        vehicleTable.appendChild(tbody);
        $(document).ready(function () {
            $('table.home').DataTable().clear().destroy();
            $('table.home').DataTable({
                columnDefs: [{
                    targets: 3,
                    orderable: false
                }]
            });
        });
    }, false);
    activeWorkers[fid] = worker
    // console.log(activeWorkers);
})

function deleteOptionFormat(select, arr) {
    arr.forEach(vehicle => {
        let option = document.createElement('OPTION');
        // option.setAttribute('value', vehicle[0]);
        let optionText = document.createTextNode(
            `Vehicle ID: ${vehicle[0]} -- Fleet: ${vehicle[1]} -- Vehicle Type: ${vehicle[3]} -- License Plate: ${vehicle[5]} `
        )
        option.appendChild(optionText);
        select.appendChild(option);
    })
}

function adjustUpdateForm(fid) {
    /* Toggling the Fleet ID input state when switching between tabs */
    // console.log(fid);
    let fleetidinput = document.getElementById('homefleetid');
    // console.log(fleetidinput);
    fleetidinput.readOnly = false;
    fleetidinput.value = '';
    if (fid != 'home') {
        fleetidinput.readOnly = true;
        fleetidinput.value = fid;
    }

    /* Adjusting the available deletable vehicles when switching between tabs */
    let canBeDeleted = document.getElementById('vidsThatCanBeDeleted');
    // console.log(canBeDeleted);
    for (option in canBeDeleted.options) {
        canBeDeleted.options.remove(0);
    }
    let table = document.getElementById('homeTable');
    let rebuildArr = []

    /* Go through each row of the vehicle table to get all vehicles */
    for (row in table.rows) {
        if (row == 0) continue;
        let rowDOM = table.rows[row].cells;
        // console.log(rowDOM);
        let wantedData = []
        for (cell in rowDOM) {
            /* Pruning condition for extra stuff DataTables does */
            if (cell < 7) {
                let cellDOM = rowDOM[cell];
                /* 
                    Because out delete select is smaller, we only really care about certain pieces of data,
                    so we only push the values where we hit those particular columns. In this case, 'cell'
                    is indicative of the column number, which correlates to our column name. 
                */
                wantedData.push(cellDOM.innerHTML);
                // console.log(cellDOM.innerHTML);
            }
        }
        rebuildArr.push(wantedData);
    }
    rebuildArr = rebuildArr.splice(0, rebuildArr.length - 3);
    // console.log(rebuildArr);
    // console.log(fid);
    /* Filter the list to account for what tab we are in */

    let vidsInDelSelect = []
    let confirmDelSelect = document.getElementById('vidsToDelete');
    // console.log(confirmDelSelect);
    for (var option = 0; option < confirmDelSelect.options.length; option++) {
        let text = confirmDelSelect.options[option].innerHTML;
        // console.log(confirmDelSelect.options[option].innerHTML);
        let vid = text.split(' -- ')[0];
        // console.log(vid);
        vid = vid.substring(vid.indexOf(': ') + 2);
        // console.log(vid);
        vidsInDelSelect.push(vid);
    }
    // console.log(vidsInDelSelect);
    rebuildArr = rebuildArr.filter(entry => !vidsInDelSelect.includes(entry[0]));
    if (fid != 'home') {
        rebuildArr = rebuildArr.filter(entry => entry[1] == fid)
    }
    deleteOptionFormat(canBeDeleted, rebuildArr);
    // console.log(rebuildArr);
}
