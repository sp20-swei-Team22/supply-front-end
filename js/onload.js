var activeWorkers = {};
var vehicleMarks = {};
var map;
var user = localStorage.getItem('username');
let loadTables = () => {
    var url = new URL("https://supply.team22.softwareengineeringii.com/supply/fleets");
    var params = {
        'user': user
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url).then(fleetRes => {
        fleetRes.json().then(fleets => {
            if (fleetRes.status == 200) {
                url = new URL("https://supply.team22.softwareengineeringii.com/supply/vehicles");
                params = {
                    'user': user
                }
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

                fetch(url).then(vehicleRes => {
                    vehicleRes.json().then(json => {
                        if (vehicleRes.status == 200) {
                            fleetNums = []
                            Object.keys(fleets).forEach(fleet => {
                                fleetNums.push(fleets[fleet]['fleetid']);
                            })

                            let arr = formatVehicleJSON(json);

                            let homeTable = document.getElementById('homeTable');
                            let tbody = fillTBody(arr, 'o');
                            homeTable.appendChild(tbody);

                            let deleteSelect = document.getElementById('vidsThatCanBeDeleted');
                            deleteOptionFormat(deleteSelect, arr);

                            fleetNums.forEach(fleetNum => {
                                let idHeader = `fleet${fleetNum}`;
                                buildTab(idHeader)
                            })
                            mapboxgl.accessToken = 'pk.eyJ1Ijoia29tb3RvNDE1IiwiYSI6ImNrOHV1cGp3bDA1bG0zZ282bmZhdDZjeWYifQ.2w_4X8WR5lFXvsmp6TeHEg';
                            map = new mapboxgl.Map({
                                container: 'homeMap', /* container id */
                                style: 'mapbox://styles/mapbox/streets-v11', /* stylesheet location */
                                center: [-97.7553, 30.2264], /* starting position [lng, lat] */
                                zoom: 13 /* starting zoom */
                            });

                            /* Making geojsons for each vehicle  */
                            var vids = [];
                            var geojsons = [];
                            json.forEach(car => {
                                let vid = car['vehicleid']
                                let geojson = {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': "Point",
                                        'coordinates': [car['current_lon'], car['current_lat']],
                                        'id': car['vehicleid'].toString()
                                    }
                                }
                                vids.push(vid);
                                geojsons.push(geojson);
                                vehicleMarks[vid] = geojson;
                            });
                            map.on('load', function () {
                                for (car in geojsons) {
                                    var id = geojsons[car]['geometry']['id'].toString()
                                    map.addSource(id, {
                                        'type': 'geojson',
                                        'data': geojsons[car]
                                    });
                                    map.addLayer({
                                        'id': id,
                                        'type': 'symbol',
                                        'source': id,
                                        'layout': {
                                            /* 
                                                get the icon name from the source's "icon" property
                                                concatenate the name to get an icon from the style's sprite sheet
                                                get the title name from the source's "title" property
                                            */
                                            'icon-image': 'car-15',

                                        }
                                    });
                                }
                            });
                            var worker = startWorker('home');

                            activeWorkers['home'] = worker
                            $(document).ready(function () {
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
        console.log('Error: ', err);
    });
}

$(document).on('click', '.nav-item.mytab', function (e) {
    // console.log(e);
    let tabID = this.children[0].id;
    let fleet = tabID.substring(0, tabID.indexOf('T'));
    // console.log(fleet);
    let fid = fleet.substring(fleet.indexOf('t') + 1);
    var url;
    if (fid == 'home') {
        url = new URL("https://supply.team22.softwareengineeringii.com/supply/vehicles");
        params = {
            'user': user
        }
    } else {
        url = new URL("https://supply.team22.softwareengineeringii.com/supply/vehicles");
        params = {
            'fid': fid
        }
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    fetch(url).then(res => {
        res.json().then(vehiclesJSON => {
            rebuildTable(vehiclesJSON);
        })
    }).catch(err => {
        console.log('Error: ', err);
    });

    /* Time out required when updating the update form to account for the lab in fetching and updating the table */
    setTimeout(() => adjustUpdateForm(fid), 500);

    /* Kill the current worker so that we can spin up a new one for the selected tab */
    Object.keys(activeWorkers).forEach(tab => {
        activeWorkers[tab].postMessage({ 'cmd': 'stop' })
        delete activeWorkers[tab]
    })
    var worker = startWorker(fid);
    activeWorkers[fid] = worker;
})

function startWorker(fid) {
    var worker = new Worker('/supply-front-end/js/workers/vehiclesworker.js');
    worker.postMessage({ 'cmd': 'start', 'fid': fid, 'user': user });
    worker.addEventListener('message', function (e) {
        let vehiclesJSON = e.data;
        rebuildTable(vehiclesJSON);

        /* Update the geojsons with the new vehicle positions */
        vehiclesJSON.forEach(vehicle => {
            let vid = vehicle['vehicleid'].toString();
            map.getSource(vid).setData({
                'type': 'Feature',
                'geometry': {
                    'type': "Point",
                    'coordinates': [vehicle['current_lon'], vehicle['current_lat']],
                    'id': vid
                }
            })
        })
    }, false);
    return worker;
}

function rebuildTable(vehiclesJSON) {
    let vehiclesData = formatVehicleJSON(vehiclesJSON);
    let vehicleTable = document.getElementById('homeTable')

    /* Getting the old tbody to remove it */
    let oldTBody = vehicleTable.querySelectorAll('tbody')[0];
    vehicleTable.removeChild(oldTBody);

    /* Creating a new tbody with our 'new' vehicle data*/
    let tbody = fillTBody(vehiclesData, 'o');
    vehicleTable.appendChild(tbody);

    /* DataTable reinstantiation */
    $(document).ready(function () {
        $('table.home').DataTable().clear().destroy();
        $('table.home').DataTable({
            columnDefs: [{
                targets: 3,
                orderable: false
            }]
        });
    });
}

function deleteOptionFormat(select, arr) {
    arr.forEach(vehicle => {
        let option = document.createElement('OPTION');
        /* Formatting the options into a more compact slightly more readable format */
        let optionText = document.createTextNode(
            `Vehicle ID: ${vehicle[0]} -- Fleet: ${vehicle[1]} -- Vehicle Type: ${vehicle[3]} -- License Plate: ${vehicle[5]} `
        )
        option.appendChild(optionText);
        select.appendChild(option);
    })
}

function adjustUpdateForm(fid) {
    /* Toggling the Fleet ID input state when switching between tabs */
    let fleetidinput = document.getElementById('homefleetid');

    /* Making the fleet input default to the selected tab, if it's not the home tab */
    fleetidinput.readOnly = false;
    fleetidinput.value = '';
    if (fid != 'home') {
        fleetidinput.readOnly = true;
        fleetidinput.value = fid;
    }

    /* Adjusting the available deletable vehicles when switching between tabs */
    let canBeDeleted = document.getElementById('vidsThatCanBeDeleted');
    for (option in canBeDeleted.options) {
        canBeDeleted.options.remove(0);
    }
    let table = document.getElementById('homeTable');
    let rebuildArr = []

    /* Go through each row of the vehicle table to get all vehicles */
    for (row in table.rows) {
        if (row == 0) continue;
        let rowDOM = table.rows[row].cells;
        let wantedData = []
        for (cell in rowDOM) {
            /* Pruning condition for extra stuff DataTables does */
            if (cell < 7) {
                let cellDOM = rowDOM[cell];
                /* 
                    Because our delete select is smaller, we only really care about certain pieces of data,
                    so we only push the values where we hit those particular columns. In this case, 'cell'
                    is indicative of the column number, which correlates to our column name. 
                */
                wantedData.push(cellDOM.innerHTML);
            }
        }
        rebuildArr.push(wantedData);
    }
    rebuildArr = rebuildArr.splice(0, rebuildArr.length - 3);

    /* Filter the list to account for what tab we are in */
    let vidsInDelSelect = []
    let confirmDelSelect = document.getElementById('vidsToDelete');

    for (var option = 0; option < confirmDelSelect.options.length; option++) {
        let text = confirmDelSelect.options[option].innerHTML;
        let vid = text.split(' -- ')[0];
        vid = vid.substring(vid.indexOf(': ') + 2);
        vidsInDelSelect.push(vid);
    }

    rebuildArr = rebuildArr.filter(entry => !vidsInDelSelect.includes(entry[0]));
    if (fid != 'home') {
        rebuildArr = rebuildArr.filter(entry => entry[1] == fid)
    }
    deleteOptionFormat(canBeDeleted, rebuildArr);
}
