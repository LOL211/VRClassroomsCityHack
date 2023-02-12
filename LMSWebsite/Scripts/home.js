let createlinks;
let createhome;

function setup(response)
{  
  let courselist = JSON.parse(response.courses);
  console.log(response);
  
  let bodyy = document.getElementsByClassName("parent")[0]
  let linklist = document.getElementById("links");


  courselist.forEach(element=>{
    console.log(bodyy);
    linklist.appendChild(createlinks(element.CourseName));
    bodyy.appendChild(createcourse(element.CourseName, element.Teacher));  
  });
  linklist.appendChild(createhome());
  document.getElementById("title").innerHTML+=response.name;
}

function createcourse(coursename, teacher){
  let child = document.createElement("div");
  child.setAttribute("class", "child");
  child.innerHTML="<p>"+coursename+"<br><span class=\"details\">Teacher: "+teacher+"</span>";
  child.onclick = ()=>{
    window.open("classhome.html?class="+coursename, "_top");
  }
  return child;
}

let response;
let setupmod;


async function loadresources() {
  setupmod= await import("./setup.js");
  response = setupmod.makeCourseRequest().then(response=>{
 while(true){
    try{
      setupmod.getCourses(setup, response);
      setupmod.setlogoutbutton();
      break;
    }
    catch(err)
    {
      console.log("hmm");
    }}
})
  createlinks = setupmod.createlinks;
  createhome = setupmod.createhome;
 
}
loadresources();
