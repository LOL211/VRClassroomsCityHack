import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'









export const firebaseApp = initializeApp(
{
  apiKey: "AIzaSyCpefYz7bDeQkV1evWvFpuEADfNPvsuABU",
authDomain: "vr-application-29195.firebaseapp.com",
databaseURL: "https://vr-application-29195-default-rtdb.firebaseio.com",
projectId: "vr-application-29195",
storageBucket: "vr-application-29195.appspot.com",
messagingSenderId: "454382693464",
appId: "1:454382693464:web:5b34e12099989ab74dee2d"
});
    
export const makeCourseRequest = async()=> {
  let r; 
 r = fetch("https://vr-app.fly.dev/home",
  {
      method:"POST",
      headers: {
      'Accept':"*/*",
      'Content-Type':"application/json",
      'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(
      {"requestType":"HOME",
          "idToken": getCookie("id")
      }
      )
  });



 return r;
}

 
export const verifymemebership = async(classid)=> {
  let r; 

 r = await fetch("https://vr-app.fly.dev/home/"+classid,
  {
      method:"POST",
      headers: {
      'Accept':"*/*",
      'Content-Type':"application/json",
      'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(
      {"requestType":"COURSEDETAIL",
          "idToken": getCookie("id")
      }
      )
  });
  let td = new TextDecoder();
  let rd = r['body'].getReader();
  let belongs =  td.decode((await rd.read()).value);

 return belongs;
}



export const getToken = async()=> {
  let r; 

 r = await fetch("https://vr-app.fly.dev/token",
  {
      method:"POST",
      headers: {
      'Accept':"*/*",
      'Content-Type':"application/json",
      'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(
      {"requestType":"TEACHER",
          "idToken": getCookie("id")
      }
      )
  });
  let td = new TextDecoder();
  let rd = r['body'].getReader();
  let belongs =  td.decode((await rd.read()).value);


 return belongs;
}

 
export const decodeSingleResponse = async (response) =>{
  let td = new TextDecoder();
  let rd = r['body'].getReader();
  let belongs = false;
  rd.read().then(tt=>  {
    belongs = td.decode(tt.value);

});


}
 
 
export  const getCourses = async (setup, response)=> {
     
      response = await response;

        let textDecoder = new TextDecoder();
        let read = response['body'].getReader();
        read.read().then(text=>  {
          let jsonResponse = JSON.parse(textDecoder.decode(text.value));
         setup(jsonResponse)
});    
}


export  const getCourseDetails = async (setup, response)=> {
     
  response = await response;

    let textDecoder = new TextDecoder();
    let read = response['body'].getReader();
    read.read().then(text=>  {
      let jsonResponse = JSON.parse(textDecoder.decode(text.value));
     setup(jsonResponse)
});    
}





export const setlogoutbutton = () =>{
  
  let logout = document.getElementById("logout")
  logout.onclick= () =>{
    const cookies = document.cookie.split(";");
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    
  window.open("../index.html","_top");
  }  
  
  
}


export  function createlinks(course)
{
  let child = document.createElement("li");
  child.innerHTML = "<a href=\"classhome.html?class="+course+"\">"+course+"</a>";
  return child;
}
export  function createhome()
{
  let child = document.createElement("li");
  child.innerHTML = "<a href=\"home.html\">Home</a>";
  return child;
}

export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
