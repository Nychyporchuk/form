document.addEventListener("DOMContentLoaded", function () {
    let signUpForm = document.getElementById('registration-form');
    let signinForm = document.getElementById('signin-form');
    let personalCabinet = document.getElementById('personal-cabinet');
    let welcomeMessage = document.getElementById('welcome-message');
    let exitButton = document.getElementById('exit-button');
    let haveAccountLink = document.getElementById('have-account-link');
    let registerLink = document.getElementById('register-link');

    function validateEmail(email) {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateFullName(fullName) {
        let re = /^[a-zA-Z\s]+$/;
        return re.test(fullName);
    }

    function validateUsername(username) {
        let re = /^[a-zA-Z0-9_-]+$/;
        return re.test(username);
    }

    function validatePassword(password) {
        let re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    function setError(element, message) {
        let errorElement = document.getElementById(element.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            element.style.borderColor = 'red';
        }
    }

    function clearError(element) {
        let errorElement = document.getElementById(element.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            element.style.borderColor = '';
        }
    }

    function validateRegistrationForm() {
        let fullNameInput = document.getElementById('fullname');
        let usernameInput = document.getElementById('username');
        let emailInput = document.getElementById('e-mail');
        let passwordInput = document.getElementById('password');
        let repeatPasswordInput = document.getElementById('repeat-password');
        let agreeCheckbox = document.getElementById('input-checkbox');

        let isValid = true;

        if (fullNameInput.value.trim() === '' || !validateFullName(fullNameInput.value.trim())) {
            setError(fullNameInput, 'Full Name может содержать только буквы и пробел');
            isValid = false;
        } else {
            clearError(fullNameInput);
        }

        if (usernameInput.value.trim() === '' || !validateUsername(usernameInput.value.trim())) {
            setError(usernameInput, 'Username может содержать только буквы, цифры, символ подчеркивания и тире');
            isValid = false;
        } else {
            clearError(usernameInput);
        }

        if (emailInput.value.trim() === '' || !validateEmail(emailInput.value.trim())) {
            setError(emailInput, 'Введите корректный E-mail');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (passwordInput.value === '' || !validatePassword(passwordInput.value)) {
            setError(passwordInput, 'Пароль должен содержать минимум 8 символов, включая хотя бы одну букву в верхнем регистре, одну цифру и один спецсимвол');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        if (repeatPasswordInput.value === '' || repeatPasswordInput.value !== passwordInput.value) {
            setError(repeatPasswordInput, 'Пароли не совпадают');
            isValid = false;
        } else {
            clearError(repeatPasswordInput);
        }

        if (!agreeCheckbox.checked) {
            setError(agreeCheckbox, 'Вы должны согласиться с условиями');
            isValid = false;
        } else {
            clearError(agreeCheckbox);
        }

        return isValid;
    }

    function registerUser(event) {
        event.preventDefault();

        if (!validateRegistrationForm()) {
            return;
        }

        let fullNameInput = document.getElementById('fullname');
        let usernameInput = document.getElementById('username');
        let emailInput = document.getElementById('e-mail');
        let passwordInput = document.getElementById('password');

        let user = {
            fullName: fullNameInput.value.trim(),
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(user);
        localStorage.setItem('clients', JSON.stringify(clients));

        alert('На вашу почту выслана ссылка, перейдите по ней, чтобы завершить регистрацию');
        showSignInForm();
    }

    function signInButtonClickHandler(event) {
        event.preventDefault();

        let usernameValue = document.getElementById('signin-username').value.trim();
        let passwordValue = document.getElementById('signin-password').value.trim();

        if (usernameValue === '' || passwordValue === '') {
            alert('Заполните все поля!');
            return;
        }

        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        let user = clients.find(client => client.username === usernameValue);

        if (!user) {
            setError(document.getElementById('signin-username'), 'Такой пользователь не зарегистрирован');
            return;
        }

        if (user.password !== passwordValue) {
            setError(document.getElementById('signin-password'), 'Неверный пароль');
            return;
        }


        displayPersonalCabinet(user.fullName);
    }

    function displayPersonalCabinet(fullName) {
        document.querySelector('.container').style.display = 'none';
        personalCabinet.style.display = 'block';
        welcomeMessage.textContent = `Welcome, ${fullName}!`;
        exitButton.addEventListener('click', function () {
            location.reload();
        });
    }

    function showSignInForm() {
        signUpForm.style.display = 'none';
        signinForm.style.display = 'block';
        haveAccountLink.textContent = 'Registration';
        haveAccountLink.removeEventListener('click', showSignInForm);
        haveAccountLink.addEventListener('click', showSignUpForm);
    }

    function showSignUpForm() {
        signinForm.style.display = 'none';
        signUpForm.style.display = 'block';
    }

    haveAccountLink.addEventListener('click', function(event) {
        event.preventDefault();
        showSignInForm();
    });

    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        location.reload();
    });

    signUpForm.addEventListener('submit', registerUser);
    signinForm.addEventListener('submit', signInButtonClickHandler);
});
