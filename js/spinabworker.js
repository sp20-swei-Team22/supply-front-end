var worker = new Worker('/supply-front-end/js/fleetworker.js');
$(document).on('click', 'a.nav-link', function() {
    let tabs = this.parentNode.parentNode.children;
    // console.log(tabs);
    let numTabs = this.parentNode.parentNode.children.length;
    // console.log(numTabs);
    let fleetid = this.id;
    console.log(fleetid);
    fleetid = fleetid.substring(fleetid.indexOf('t')+1, fleetid.indexOf('Tab'));
    console.log(fleetid);
    
    worker.postMessage({'cmd': 'start', 'fid': fleetid});
    worker.addEventListener('message', function (e) {
        console.log(e);
        let vehicleJSON = e.data;
        console.log(vehicleJSON);
    }, false);
})