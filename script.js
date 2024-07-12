document.addEventListener("DOMContentLoaded", function () {
    let signUpForm = document.getElementById('registration-form');
    let signinForm = document.getElementById('signin-form');
    let personalCabinet = document.getElementById('personal-cabinet');
    let welcomeMessage = document.getElementById('welcome-message');
    let exitButton = document.getElementById('exit-button');
    let haveAccountLink = document.getElementById('have-account-link');
    let registerLink = document.getElementById('register-link');
    let modal = document.getElementById("myModal");
    let modalMessage = document.getElementById("modal-message");
    let span = document.getElementsByClassName("close")[0];
    let okButton = document.getElementById("okButton");

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    okButton.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }


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
        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/;
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
        if (fullNameInput.value.trim() === '') {
            setError(fullNameInput, ' Заполните поле Full Name ');
            isValid = false;
        } else if (!validateFullName(fullNameInput.value.trim())) {
            setError(fullNameInput, 'Full Name может содержать только буквы и пробел');
            isValid = false;
        } else {
            clearError(fullNameInput);
        }


        if (usernameInput.value.trim() === '') {
            setError(usernameInput, 'Заполните поле Username');
            isValid = false;
        } else if (!validateUsername(usernameInput.value.trim())) {
            setError(usernameInput, 'Username может содержать только буквы, цифры, символ подчеркивания и тире');
            isValid = false;
        } else {
            clearError(usernameInput);
        }

        if (emailInput.value.trim() === '') {
            setError(emailInput, 'Заполните поле E-mail');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            setError(emailInput, 'Введите корректный E-mail');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (passwordInput.value === '') {
            setError(passwordInput, 'Заполните поле Password');
            isValid = false;
        } else if (!validatePassword(passwordInput.value)) {
            setError(passwordInput, 'Пароль должен содержать минимум 8 символов, включая хотя бы одну букву в верхнем регистре, одну цифру и один спецсимвол');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        if (repeatPasswordInput.value === '') {
            setError(repeatPasswordInput, 'Заполните поле Repeat Password');
            isValid = false;
        } else if (repeatPasswordInput.value !== passwordInput.value) {
            setError(repeatPasswordInput, 'Пароли не совпадают');
            isValid = false;
        } else {
            clearError(repeatPasswordInput);
        }

        if (!agreeCheckbox.checked) {
            showModal('Вы должны согласиться с условиями');
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

        showModal('На вашу почту выслана ссылка, перейдите по ней, чтобы завершить регистрацию');
        showSignInForm();

    }

    function signInButtonClickHandler(event) {
        event.preventDefault();

        let usernameInput = document.getElementById('signin-username');
        let passwordInput = document.getElementById('signin-password');
        let usernameValue = usernameInput.value.trim();
        let passwordValue = passwordInput.value.trim();

        let isValid = true;


        if (usernameValue === '') {
            setError(usernameInput, 'Заполните поле Username');
            isValid = false;
        } else {
            clearError(usernameInput);
        }

        if (!isValid) {
            return;
        }


        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        if (clients.length === 0) {
            setError(usernameInput, 'Такой пользователь не зарегистрирован');
            return;
        }


        let user = clients.find(client => client.username === usernameValue);

        if (!user) {
            setError(usernameInput, 'Такой пользователь не зарегистрирован');
            return;
        } else {
            clearError(usernameInput);
        }

        if (passwordValue === '') {
            setError(passwordInput, 'Заполните поле Пароль');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        if (!isValid) {
            return;
        }


        if (user.password !== passwordValue) {
            setError(passwordInput, 'Неверный пароль');
            return;
        } else {
            clearError(passwordInput);
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

    }


    haveAccountLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSignInForm();
    });

    registerLink.addEventListener('click', function (event) {
        event.preventDefault();
        location.reload();
    });

    signUpForm.addEventListener('submit', registerUser);
    signinForm.addEventListener('submit', signInButtonClickHandler);
});
