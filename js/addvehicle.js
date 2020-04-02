$('.addVehicle').submit(async e => {
    e.preventDefault();

    let addForm = e.target;
    console.log(addForm);
    let grandparentID = addForm.parentElement.parentElement.id;
    console.log(grandparentID);
    desiredClass = addForm.className.split(' ')[1]
    let count = 0;
    let expectedInputs = grandparentID.includes('home') ? 4 : 3;

    let newVehicleList = [];
    let inputsOfForm = $(`.${desiredClass} input`);
    console.log(inputsOfForm.length);
    let mySelect = e.target.parentElement.children[1].children[0].children[1];
    console.log(mySelect);
    for (var input = 0; input < inputsOfForm.length; input += expectedInputs) {
        let fieldArr = [];
        let field1 = inputsOfForm[input].value;
        let field2 = inputsOfForm[input + 1].value;
        let field3 = inputsOfForm[input + 2].value;
        fieldArr.push(field1);
        fieldArr.push(field2);
        fieldArr.push(field3);

        let inputLens = [];
        inputLens.push(field1.length);
        inputLens.push(field2.length);
        inputLens.push(field3.length);
        if (expectedInputs == 4) {
            let field4 = inputsOfForm[input + 3].value;
            fieldArr.push(field4);
            inputLens.push(field4.length);
        }
        console.log(inputLens);

        if (inputLens.includes(0)) {
            continue;
        } else {
            console.log(fieldArr);
            let optionVal = fieldArr.join(' ');
            console.log(optionVal);
            let option = document.createElement('OPTION');
            let optionTextNode = document.createTextNode(optionVal);
            option.appendChild(optionTextNode);
            option.value = optionVal;
            mySelect.appendChild(option);

            inputsOfForm[input].value = '';
            inputsOfForm[input + 1].value = '';
            inputsOfForm[input + 2].value = '';
            if (expectedInputs == 4) {
                inputsOfForm[input + 3].value = '';
            }
        }
    }
})