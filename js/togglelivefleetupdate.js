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
    console.log(fid);


    if (fid in switchDict) {
        switchDict[fid].postMessage({'cmd': 'stop'})
        delete switchDict[fid]
    } else {
        var worker = new Worker('/supply-front-end/js/vehiclesworker.js');
        worker.postMessage({ 'cmd': 'start', 'fid': fid });
        worker.addEventListener('message', function (e) {
            console.log(e.data);
            // let dispatchJSON = e.data;
            // let dispatchArr = formatDispatchJSON(dispatchJSON);
        }, false);
        switchDict[fid] = worker
    }

    // console.log(switchInput);
    // console.log(switchLabel);

    // Below WORKS
    // var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
    //     params = {
    //         'fid': fid
    //     }
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // // console.log(url);
    // // console.log(switchDict);
    // if (fid in switchDict) {
    //     clearInterval(switchDict[fid]);
    //     delete switchDict[fid]
    //     // console.log('turnning off')
    // } else {
    //     var ping = setInterval(function () {
    //         console.log(fid);
    //         fetch(url).then(function (resposne) {
    //             resposne.json().then(function (parsedJSON) {
    //                 if (resposne.status == 200) {
    //                     console.log(parsedJSON);
    //                 } else {
    //                     alert('something went wrong');
    //                 }
    //             });
    //         }).catch(function (error) {
    //             console.log(error)
    //         });
    //     }, 5_000);
    //     switchDict[fid] = ping
    // }
    // console.log(switchDict);
})