$(document).ready(function () {
    $('input[type=radio]').click(function() {
        const radId = $(this).attr('id');
        console.log(radId);
        let endpoint = radId.includes('Map') ? radId.indexOf('Map') : radId.indexOf('Table');
        let idHeader = '#' + radId.substring(0, endpoint);
        let mapDiv = idHeader + 'MapDiv'
        let tableDiv = idHeader + 'TableDiv'
        // console.log(mapDiv);
        // console.log(tableDiv)
        if($(this).attr('id').includes('Map')) {
            $(mapDiv).show()
            $(tableDiv).hide()
        } else {
            $(mapDiv).hide()
            $(tableDiv).show()
        }
    });
});