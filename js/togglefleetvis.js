var switchList = []
$(document).on('change', '.visSwitch', function (e) {
    var fid = this.id;
    if (switchList.includes(fid)) {
        $('#' + fid + 'MapDiv').show()
        $('#' + fid + 'TableDiv').hide()
        switchList.pop(fid);
    } else {
        $('#' + fid + 'MapDiv').hide()
        $('#' + fid + 'TableDiv').show()
        switchList.push(fid);
    }
})