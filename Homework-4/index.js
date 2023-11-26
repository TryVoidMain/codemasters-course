function removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains('error')) {
        parent.querySelector('.error_div').remove();
        parent.classList.remove('error');
    }
}

function createError(input, text) {
    const parent = input.parentNode;
    const errorDiv = document.createElement('div');

    errorDiv.classList.add('error_div');
    errorDiv.textContent = text;

    parent.classList.add('error');
    parent.append(errorDiv);
}

function validation(form) {

    let result = true;
    
    result = passwordValidation(form);

    form.querySelectorAll('input').forEach(input => {

        if (input.type == 'password') {
            const regex = new RegExp('(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}');
            
            if (!regex.test(input.value)) {
                removeError(input);
                createError(input, "Используйте более строгий пароль. Должны присутствовать как цифры, буквы и т.д.");
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
    });

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

const form = document.getElementById('registration-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (validation(this) == true) {
        alert('Форма провалидирована успешно');
    }
});

form.addEventListener('change', function(event) {
    event.preventDefault();

});