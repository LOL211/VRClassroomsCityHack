

let createlinks;
let createhome;

let response;
let setupmod;

let classsname = getParameterByName("class");

let storagefile;
let teacher= false;
let verify = false;

let signedin = false;



function setup(response)
{  


  let courselist = JSON.parse(response.courses);
  
  teacher = response.role;
  
  let linklist = document.getElementById("links");
  courselist.forEach(element=>{
    linklist.appendChild(createlinks(element.CourseName));
  });
  linklist.appendChild(createhome())

  document.getElementById("classtitle").innerHTML+= classsname;
  document.getElementById("title").innerHTML+=response.name;

  getfiles(classsname);


}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


async function uploadfiles(file){

  const storage = storagefile.getStorage(setupmod.firebaseApp);
    if(file.name.includes(" "))
    {
      const newwFile = new Blob([file], {type: file.type});
      newwFile.name = file.name.replaceAll(" ","_");
      
      const newfile = new File([newwFile], newwFile.name, {type: file.type});
     
      const listRef=storagefile.ref(storage, '/'+classsname+'/'+ newfile .name);
      await storagefile.uploadBytes(listRef, newfile).then((snapshot) => {
       getfiles(classsname)
      });
    }
    else
    {
      const listRef=storagefile.ref(storage, '/'+classsname+'/'+file.name);
      await storagefile.uploadBytes(listRef, file).then((snapshot) => {
       getfiles(classsname)
      });
    }

  
  return null;
  }


  function uploadfilesbutton(){
    let container = document.createElement("div");
    let fileinput = document.createElement("input");
    let filesubmit = document.createElement("button");
    fileinput.setAttribute("type", "file");
    fileinput.setAttribute("id", "file");
    filesubmit.setAttribute("type", "button");
    filesubmit.innerHTML="Upload file";
    filesubmit.onclick = () =>{
  
      let file = document.getElementById("file").files[0];
      if(file==undefined)
      {
        alert("Select file");
        return;
      }

      document.getElementById("heading").innerHTML="Uploading "+file.name+"";
      uploadfiles(file).then(no =>{
        document.getElementById("heading").innerHTML="Uploaded "+file.name+"";
      });
      
    }
    container.appendChild(fileinput);
    container.appendChild(filesubmit);
  
    return container;
  
  }





async function getfiles(cname){


  if(verify !="true")
 {
  document.getElementById("bodydiv").innerHTML="<p> Sorry you don't have permission to view this class</p>"
  return;
 }



 storagefile  = await  storagefile ;

while(!signedin){

}

  const storage = storagefile.getStorage(setupmod.firebaseApp);
  const listRef= storagefile.ref(storage, '/'+cname);
  let table = document.getElementsByClassName("table")[0];

  while(table.rows.length!=1)
    table.deleteRow(-1);
  
  await storagefile.listAll(listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
    });
    res.items.forEach((itemRef) => {
      storagefile.getMetadata(itemRef)
      .then((metadata) => {

        let date = new Date(metadata.timeCreated);
        const options = {year: 'numeric', month: 'long', day: 'numeric' };

       let fileinfo ={
        filename: metadata.name,
        filesize: metadata.size,
        filedate:  date.toLocaleDateString(undefined, options)
       }
      document.getElementsByClassName("table")[0].appendChild(createrow(fileinfo, itemRef));

      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    });
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });

  let heading = document.getElementById("cap");
  heading.innerHTML="<p id =\"heading\"></p>";

  if(teacher=="Teacher")
  {
    heading.appendChild(uploadfilesbutton());
  }

}




async function downloadfile(fileref)
{


  document.getElementById("heading").innerHTML="Downloading "+fileref.name+"";
  let allblobs = await storagefile.getBlob(fileref);
  document.getElementById("heading").innerHTML="Downloaded "+fileref.name+"";
 
  let saveBlob = (function () {
    let a = document.createElement("a");
    a.style = "display: none";
    return function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
  
saveBlob(allblobs, fileref.name);

}



function createrow(fileinfo, item)
{
  let row = document.createElement("tr");
  row.classList.add("data-row")
  let filename = document.createElement("td");
  filename.innerHTML=fileinfo.filename;
  let filedate = document.createElement("td");
  filedate.innerHTML = fileinfo.filedate;
  let filesize= document.createElement("td");
  filesize.innerHTML = fileinfo.filesize;
  row.appendChild(filename);
  row.appendChild(filedate);
  row.appendChild(filesize);


  row.onclick= 
  ()=>{
  
    downloadfile(item);
  };

  return row;
}

async function loadresources() {
  setupmod= import("./setup.js");

  
  storagefile =  import("https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js")
  import("https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js").then( async response => { 
    
    authfile = response;
    setupmod = await setupmod;
    let token = await setupmod.getToken();
   
    auth = authfile.getAuth(setupmod.firebaseApp);
    authfile.signInWithCustomToken(auth, token);
    signedin = true;

    verify = await setupmod.verifymemebership(classsname)
    response = setupmod.makeCourseRequest().then(response=>{
    while(true){
       try{
         setupmod.getCourses(setup, response);
         setupmod.setlogoutbutton();
         break;
       }
       catch(err)
       {
   
       }}
   })
  createlinks = setupmod.createlinks;
  createhome = setupmod.createhome;
 






  })

    
}
loadresources();
