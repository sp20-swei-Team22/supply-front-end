function fillTBody(arr, coin) {
    let tbody = document.createElement('TBODY');
    arr.forEach(function (entry) {
        var row = document.createElement('TR');
        entry.forEach(function (colVal, col) {
            var cell = document.createElement('TD');
            cell.appendChild(document.createTextNode(colVal));
            if (coin == 'o') {
                if (col == 0) {
                    row.setAttribute('id', `vid${colVal}`)
                    cell.setAttribute('onclick', 'getDispatch(this)');
                    cell.setAttribute('data-toggle', 'modal');
                    cell.setAttribute('data-target', '#dispatchRecordPopup')
                }
            }
            row.append(cell);
        });
        tbody.appendChild(row);
    });
    return tbody;
}