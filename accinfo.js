let Uname = document.getElementById('name')
let fulname = document.getElementById('fulname')
let email = document.getElementById('email')
let leave = document.getElementById('leave')
let fullemail = document.getElementById('fullemail')
let localemile = JSON.parse(localStorage.getItem('localemile')) || [];
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const secondarybtn = document.querySelector('.secondary-btn')

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.checked = true;
}

secondarybtn.addEventListener('click', function(){
    window.open('signinup.html')
    window.close('accinfo.html')
})


themeToggle.addEventListener('change', function() {
  if (this.checked) {

    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {

    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

let savedata = localStorage.getItem('theme')
console.log(savedata);




Uname.innerHTML = '';
email.innerHTML = localemile
fullemail.innerHTML = localemile


localemile.forEach(email => {
    let userName = email.split('@')[0];
    Uname.innerHTML += `${userName}`;
    fulname.innerHTML += `${userName}`
});

leave.addEventListener('click', function() {
    localStorage.removeItem('localemile')
    window.open('index.html')
    window.close('accinfo.html')
})