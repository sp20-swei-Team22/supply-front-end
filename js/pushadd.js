$(document).on('submit', '.addVehicle', async e => {
    e.preventDefault();

    let addForm = e.target;
    let id = addForm.classList[2];
    console.log(id);
    desiredClass = addForm.className.split(' ')[1]

    let inputsOfForm = $(`.${id} input`);
    let mySelect = e.target.parentElement.children[1].children[0].children[0];
    for (var input = 0; input < inputsOfForm.length; input += 4) {
        inputsOfForm[input].style.borderColor = 'rgb(210, 206, 198)';

        let fieldArr = [];
        let field1 = inputsOfForm[input].value.trim();
        console.log(inputsOfForm[input].readOnly);
        let field2 = inputsOfForm[input + 1].value.trim();
        let field3 = inputsOfForm[input + 2].value.trim();
        let field4 = inputsOfForm[input + 3].value.trim();

        let numbersOnly = /^[0-9]+$/;
        if (!numbersOnly.test(field1)) {
            inputsOfForm[input].style.borderColor = 'red';
            alert('not numbers!');
            return;
        }

        fieldArr.push(field1);
        fieldArr.push(field2);
        fieldArr.push(field3);
        fieldArr.push(field4);

        let inputLens = [];
        inputLens.push(field1.length);
        inputLens.push(field2.length);
        inputLens.push(field3.length);
        inputLens.push(field4.length);

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
            let optionVal = fieldArr.join(' ');
            if (id != 'home') {
                fleetNum = id.substring(id.indexOf('t') + 1);
                optionVal = `${fleetNum} ${optionVal}`;
            }

            let option = document.createElement('OPTION');
            let optionTextNode = document.createTextNode(optionVal);
            option.appendChild(optionTextNode);
            option.value = optionVal;
            mySelect.appendChild(option);

            inputsOfForm[input].value = inputsOfForm[input].readOnly ? field1 : '';
            inputsOfForm[input + 1].value = '';
            inputsOfForm[input + 2].value = '';
            inputsOfForm[input + 3].value = '';
        }
    }
})
