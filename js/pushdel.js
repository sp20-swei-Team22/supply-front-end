$(document).on('dblclick', '#vidsThatCanBeDeleted', function () {
    let splitter = this.value.split(' -- ')[0];
    let vid = splitter.substring(splitter.indexOf(': ') + 2);
    let myConfirmSelect = $('form.confirm.remove').children()[1];
    $(myConfirmSelect)
        .append($('<option></option>')
            .attr('value', vid)
            .text(`${this.value}`)
        );
    jQuery(`#vidsThatCanBeDeleted option:contains('${this.value}')`).remove();
});

$(document).on('dblclick', '#vidsToDelete', function () {
    let val = $("#vidsToDelete option:selected").text();
    if (val != '') {
        let myRemoveSelect = $('#vidsThatCanBeDeleted');
        $(myRemoveSelect)
            .append($('<option></option>')
                .attr('value', val)
                .text(`${val}`)
            );
        jQuery(`#vidsToDelete option:contains('${val}')`).remove();
    }
});