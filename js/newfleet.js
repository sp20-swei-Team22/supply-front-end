$('#newFleetForm').submit(e => {
    e.preventDefault();

    // console.log(e);

    var username = document.getElementById('accountName').text;
    console.log(username);
    var fleet = { 'username': username };
    form = document.getElementById('newFleetForm');
    fields = form.querySelectorAll('input, select');
    // console.log(form);
    console.log(fields);

    fields.forEach(e => {
        // console.log(e.id);
        fleet[`${e.id}`] = e.value;
    });
    console.log(fleet);

    var url = 'https://supply.team22.softwareengineeringii.com/supply/fleets/add';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(fleet)
    }).then(res => {
        res.json().then(json => {
            if (res.status == 200) {
                newFID = json['newFID']
                alert(`Fleet ${newFID} added!`);
                // fields.forEach(e => {
                //     e.value = '';
                // })
                var myTab = document.getElementById('myTab');
                let idHeader = `fleet${newFID}`;
                buildTab(idHeader);
            } else {
                alert('Something went wrong');
            }
        })
    }).catch(err => {
        console.log('Error: ', err);
    });
})
