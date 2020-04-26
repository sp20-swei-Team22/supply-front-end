self.addEventListener('message', function (e) {
    // console.log(e)
    var data = e.data;
    if (data.cmd == 'start') {
        var vid = data.vid;
        var url = new URL("https://supply.team22.softwareengineeringii.com/supply/dispatch"),
            params = {
                'vid': vid
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        setInterval(function () {
            fetch(url).then(function (resposne) {
                resposne.json().then(function (jsonRes) {
                    if (resposne.status == 200) {
                        self.postMessage(jsonRes);
                    } else {
                        self.postMessage('bad status')
                    }
                });
            }).catch(function (error) {
                console.log(error)
                self.postMessage('fetch failed')
            });
        }, 5_000)
    } else if (data.cmd == 'stop') {
        self.close();
    }
}, false);
