$(document).on('dblclick', '.vidsThatCanBeDeleted', function() {
    // console.log(this);
    // console.log(this.value);
    let myConfirmSelect = $(this).parent().parent().parent().children()[1].children[0].children[0].children[1];
    // console.log(myConfirmSelect);
    $(myConfirmSelect)
        .append($('<option></option>')
            .attr('value', this.value)
            .text(`Vehicle ID: ${this.value}`)
            );
    $(this).children(`option[value=${this.value}]`).remove();
});

$(document).on('dblclick', '.selectsForUpdates', function() {
    // console.log(this);
    // console.log(this.value);
    let myRemoveSelect = $(this).parent().parent().parent().parent().children()[0].children[0].children[1];
    // console.log(myRemoveSelect);
    $(myRemoveSelect)
        .append($('<option></option>')
            .attr('value', this.value)
            .text(`Vehicle ID: ${this.value}`)
            );
    $(this).children(`option[value=${this.value}]`).remove();
});