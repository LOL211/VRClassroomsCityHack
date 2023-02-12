const firebaseApp = firebase.initializeApp(
{
  apiKey: "AIzaSyCpefYz7bDeQkV1evWvFpuEADfNPvsuABU",
authDomain: "vr-application-29195.firebaseapp.com",
databaseURL: "https://vr-application-29195-default-rtdb.firebaseio.com",
projectId: "vr-application-29195",
storageBucket: "vr-application-29195.appspot.com",
messagingSenderId: "454382693464",
appId: "1:454382693464:web:5b34e12099989ab74dee2d"
});


const auth = firebaseApp.auth();

login_btn = document.getElementById('login_btn')
loginpass = document.getElementById('login_password')
loginemail = document.getElementById('login_email')
loginpass.value="test1234";
loginemail.value="teacher1@gmail.com";


let user;
const getIdToken =()=> user.getIdToken().then((result) => {return result});

const login = async () => {
  const email = loginemail.value
  const password = loginpass.value;


  auth.signInWithEmailAndPassword(email, password)
  .then(async (response) => {
   
  
    alert('You\'re successfully signed in !');

    user = response["user"]

     clearcookies();
  
    document.cookie = "id="+await getIdToken()+"; path=/;";
    document.cookie = "refreshtoken="+user.refreshToken+"; path=/";

    window.open("../Html/home.html","_top");
  })
  .catch(error => {
    alert("Unsucessful sign-in!")
    console.log(error)
  })
}

function clearcookies(){
  const cookies = document.cookie.split(";");
  
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

login_btn.addEventListener("click", login)
