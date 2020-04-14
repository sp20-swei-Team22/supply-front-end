self.addEventListener('message', function (e) {
    // console.log(e)
    var data = e.data;
    if (data.cmd == 'start') {
        var fid = data.fid;
        var url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/"),
            params = {
                'fid': fid
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        if (fid == 'home') {
            url = new URL("https://supply.team22.softwareengineeringii.com/vehicleRequest/")
        }
        // console.log(url);
        setInterval(function () {
            // console.log(data.msg);
            fetch(url).then(function (resposne) {
                // console.log(data);
                resposne.json().then(function (jsonRes) {
                    if (resposne.status == 200) {
                        // console.log('nice')
                        self.postMessage(jsonRes);
                    } else {
                        // console.log('not nice')
                        self.postMessage('bad status')
                    }
                });
            }).catch(function (error) {
                console.log(error)
                self.postMessage('fetch failed')
            });
        }, 500)
    } else if (data.cmd == 'stop') {
        self.close();
    }
}, false);
