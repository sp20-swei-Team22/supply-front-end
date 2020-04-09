self.addEventListener('message', function(e) {
    console.log(e)
    var data = e.data;
    var url = new URL("https://supply.team22.softwareengineeringii.com/getDispatch/"),
        params = {
            'vid': 28
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // console.log(url);
    var interval = setInterval(function() {
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
    }, 5_000)
}, false);
