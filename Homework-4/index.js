function removeError(input) {
    const parent = FindInputParentNode(input);

    if (parent.classList.contains('error')) {
        parent.querySelector('.error_div').remove();
        parent.classList.remove('error');
    }
}

function createError(input, text) {
    const parent = FindInputParentNode(input);
    const errorDiv = document.createElement('div');

    errorDiv.classList.add('error_div');
    errorDiv.textContent = text;

    parent.classList.add('error');
    parent.append(errorDiv);
}

function FindInputParentNode (input) {
    let parent;
    if (input.type != 'checkbox') {
        parent = input.parentNode;
    } else {
        parent = input.parentNode.parentNode;
    }

    return parent;
}

function validation(form) {

    let result = true;
    
    result = passwordValidation(form);

    form.querySelectorAll('input').forEach(input => {

        if (input.type == 'password') {
            const regex = new RegExp('(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}');
            
            if (!regex.test(input.value)) {
                removeError(input);
                createError(input, "Используйте более строгий пароль. Должны присутствовать цифры, латинские буквы (заглавные/прописные), спецсимволы");
                result = false;
            }
        }

        if (input.dataset.pattern) {
            const regex = new RegExp(input.dataset.pattern);
            
            if (!(regex.test(input.value))) {
                removeError(input);
                createError(input, "Введите корректный email");
                result = false;
            }
        }

        if (input.dataset.maxLength) {
            if (input.value.length > input.dataset.maxLength) {
                removeError(input);
                createError(input, `Максимальное количество символов: ${input.dataset.maxLength}`);
                result = false;
            }
        }

        if (input.dataset.minLength) {
            if (input.value.length < input.dataset.minLength) {
                removeError(input);
                createError(input, `Минимальное количество символов: ${input.dataset.minLength}`);
                result = false;
            }
        }

        if (input.dataset.required == 'true') {
            if (input.value == "") {
                removeError(input);
                createError(input, "Поле обязательно для заполнения");
                result = false;
            }
        }

        if (input.dataset.checkRequired == 'true' && input.checked != true) {
                removeError(input);
                createError(input, "Вы обязаны подтвердить, что хотите зарегистрироваться");
                result = false;
            }
        }
    );

    if (result == true) {
        form.querySelectorAll('input').forEach(input => {
            removeError(input);
        })
    }

    return result
}

function passwordValidation(form) {
    const passInputs = [];
    let result = true;

    form.querySelectorAll('input').forEach(input => {
        if (input != undefined && input != null  && input.type == 'password') {
            passInputs.push(input);
        }
    });

    if (passInputs.length == 2 && passInputs[0].value != passInputs[1].value) {
        passInputs.forEach(input => {
            removeError(input);
            createError(input, "Пароли не совпадают");
            result = false;
        })
    }

    return result;
}

/* Reset validation error on input event. */

function ResetValidation(form) {
    let div_inputs = form.querySelectorAll('.form__input');

    div_inputs.forEach(el => {
        el.addEventListener('input', function(event) {
            event.preventDefault();

            if (el.classList.contains('error')) {
                el.querySelector('.error_div').remove();
                el.classList.remove('error');
            }
        });
    });
}

function SaveToLocalStorage() {
    let email = document.getElementById('email');
    let fio = document.getElementById('fio');

    localStorage.setItem('email', email.value);
    localStorage.setItem('fio', fio.value);
}

const form = document.getElementById('registration-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (validation(this) == true) {
        SaveToLocalStorage();
        SwitchToInformation();
        
    }
});

function SwitchToInformation() {
    form.style.visibility = 'hidden';
    form.style.width = '1px';
    form.style.height = '1px';

    const container = document.querySelector('.container');
    
    const p = document.createElement('p');
    p.textContent = "Вы успешно создали аккаунт";

    container.append(p);
}

ResetValidation(form);