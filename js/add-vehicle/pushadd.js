$(document).on('submit', '.addVehicle', async e => {
    e.preventDefault();

    let addForm = e.target;
    let id = addForm.classList[2];
    let grandparentID = addForm.parentElement.parentElement.id;
    // console.log(grandparentID);
    desiredClass = addForm.className.split(' ')[1]
    // console.log(desiredClass);
    let expectedInputs = grandparentID.includes('home') ? 4 : 3;

    let inputsOfForm = $(`.${id} input`);
    // console.log(inputsOfForm);
    let mySelect = e.target.parentElement.children[1].children[0].children[1];
    // console.log(mySelect);
    for (var input = 0; input < inputsOfForm.length; input += expectedInputs) {
        let fieldArr = [];
        let field1 = inputsOfForm[input].value.trim();
        if (expectedInputs == 4) {
            let numbersOnly = /^[0-9]+$/;

            if (!numbersOnly.test(field1)) {
                // console.log(inputsOfForm[input]);
                inputsOfForm[input].style.borderColor = 'red';
                alert('not numbers!');
            }
        }
        let field2 = inputsOfForm[input + 1].value.trim();
        let field3 = inputsOfForm[input + 2].value.trim();
        fieldArr.push(field1);
        fieldArr.push(field2);
        fieldArr.push(field3);

        let inputLens = [];
        inputLens.push(field1.length);
        inputLens.push(field2.length);
        inputLens.push(field3.length);
        if (expectedInputs == 4) {
            let field4 = inputsOfForm[input + 3].value.trim();
            fieldArr.push(field4);
            inputLens.push(field4.length);
        }
        // console.log(inputLens);

        if (inputLens.includes(0)) {
            inputLens.forEach((inputLen, i) => {
                inputsOfForm[input + i].style.borderColor = 'black';
                if (inputLen == 0) {
                    inputsOfForm[input + i].style.borderColor = 'red';
                }
            })
            continue;
        } else {
            fieldArr.forEach(field => {
                field = field.replace(' ', '');
            })
            console.log(fieldArr);
            let optionVal = fieldArr.join(' ');
            // console.log(optionVal);
            if (id != 'home') {
                fleetNum = id.substring(id.indexOf('t') + 1);
                // console.log(fleetNum);
                optionVal = `${fleetNum} ${optionVal}`;
            }
            // console.log(optionVal);
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
