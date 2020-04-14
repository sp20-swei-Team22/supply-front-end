$(document).on('dblclick', '#vidsThatCanBeDeleted', function () {
    // console.log(this.id);
    // console.log(this.value);
    let splitter = this.value.split(' -- ')[0];
    // console.log(splitter);
    let vid = splitter.substring(splitter.indexOf(': ') + 2);
    let myConfirmSelect = $('form.confirm.remove').children()[1];
    // console.log(myConfirmSelect);
    $(myConfirmSelect)
        .append($('<option></option>')
            .attr('value', vid)
            .text(`${this.value}`)
        );
    jQuery(`#vidsThatCanBeDeleted option:contains('${this.value}')`).remove();
});

$(document).on('dblclick', '#vidsToDelete', function () {
    // console.log(this);
    // console.log(this.value);
    let val = $("#vidsToDelete option:selected").text();
    // console.log(val);
    if (val != '') {
        let myRemoveSelect = $('#vidsThatCanBeDeleted');
        // console.log(myRemoveSelect);
        $(myRemoveSelect)
            .append($('<option></option>')
                .attr('value', val)
                .text(`${val}`)
            );
        jQuery(`#vidsToDelete option:contains('${val}')`).remove();
    }
});