let email = document.getElementById('email');
let password = document.getElementById('password');
let repassword = document.getElementById('repassword');
let fieldwrapper = document.querySelector('.field-wrapper');
let sinemile = document.getElementById('sinemile');
let singpassword = document.getElementById('singpassword');
let alertexits = document.querySelector('.alert-exits');
let Cemile = document.getElementById('Cemile');
let placeholder = document.getElementById('placeholder');
let account = document.getElementById('account')
let account1 = document.getElementById('account1')

account1.addEventListener('click', function() {
    if (alertexits) {
        alertexits.style.top = '15%';
        alertexits.innerHTML = 'You must log in or register first';
        setTimeout(() => {
            alertexits.style.top = '-100%';
        }, 2000);
    }
})

account.addEventListener('click', function() {
    if (alertexits) {
        alertexits.style.top = '15%';
        alertexits.innerHTML = 'You must log in or register first';
        setTimeout(() => {
            alertexits.style.top = '-100%';
        }, 2000);
    }
})

function showThankYou() {
    const UserInfo = {
        email: email.value,
        password: password.value,
        repassword: repassword.value
    };

    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    let findUser = userInfo.find(user => user.email === email.value);

    if (repassword.value !== password.value) {
        prism.style.transform = "translateZ(-100px) rotateY( -90deg)";
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'Passwords do not match';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }

    if (findUser) {
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'User already exists';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }

    if (!repassword.value && !password.value && !email.value) {
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'values are empty';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }else if(!repassword.value){
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'repassword is empty';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }else if(!password.value){
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'password is empty';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }else if(!email.value){
        if (alertexits) {
            alertexits.style.top = '15%';
            alertexits.innerHTML = 'emile is empty';
            setTimeout(() => {
                alertexits.style.top = '-100%';
            }, 1000);
        }
        return;
    }

    userInfo.push(UserInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log(UserInfo);
    prism.style.transform = "translateZ(-100px) rotateX( 90deg)";
}

function showsignin() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || []
    let findUser = userInfo.find(user => {
        if (user.email === sinemile.value && user.password === singpassword.value) {
            window.open('index.html')
            window.close('signinup.html')
            
            let usersin = this.sinemile.value;
            let accinfo = {
                mail: this.sinemile.value,
                pass: this.singpassword.value
            }
            if (usersin) {
                try {
                    localStorage.setItem('localemile', JSON.stringify([usersin]));

                    localStorage.setItem('localinfo', JSON.stringify([accinfo]));
                } catch (error) {
                    console.error("Error saving to localStorage:", error);
                }
            } else {
                console.error("Invalid input: this.sinemile.value is null or undefined");
            }

        } else {
            
            if (alertexits) {
                alertexits.style.top = '15%'
                setTimeout(() => {
                    alertexits.style.top = '-100%'
                }, 1000);
            }
            console.error('wrong');
        }

    })

}

function showLogin() {
    prism.style.transform = "translateZ(-100px)";
}

let prism = document.querySelector(".rec-prism");

function showSignup() {
    prism.style.transform = "translateZ(-100px) rotateY( -90deg)";
}