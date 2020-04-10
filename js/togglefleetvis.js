var switchList = []
$(document).on('change', '.visSwitch', function(e) {
    // console.log(e);
    // console.log(this);
    var fid = this.id;
    // fid = fid.substring(fid.indexOf('t') + 1);
    // console.log(fid);
    // console.log(switchList);
    if (switchList.includes(fid)) {
        $('#'+fid+'MapDiv').show()
        $('#'+fid+'TableDiv').hide()
        switchList.pop(fid);
    } else {
        $('#'+fid+'MapDiv').hide()
        $('#'+fid+'TableDiv').show()
        switchList.push(fid);
    }
    // console.log(switchList);
})