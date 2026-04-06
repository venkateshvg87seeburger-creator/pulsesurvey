

const firebaseConfig = {
 apiKey: "AIzaSyCzNV5BTDRytsRt2WES3xtrR8NvsgJlrGM",
 authDomain: "feedback-app-47ab6.firebaseapp.com",
 projectId: "feedback-app-47ab6",
 storageBucket: "feedback-app-47ab6.firebasestorage.app",
 messagingSenderId: "676801294222",
 appId: "1:676801294222:web:a1567871b97d5539b5fedf",
 measurementId: "G-LBE6CBWQNS"
};

firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

let last=null,currPage=1;

if(localStorage.getItem("empId")!=="SEEIN00024"){
 document.getElementById("denied").classList.remove("hidden");
}else{
 document.getElementById("admin").classList.remove("hidden");
 showTab('feed');
 loadEmp(); 
 loadFeed();
}

function logout(){
 localStorage.clear();
 location.href="/";
}

function showTab(t){
 document.getElementById("empTab").classList.add("hidden");
 document.getElementById("feedTab").classList.add("hidden");
 if(t==="emp") document.getElementById("empTab").classList.remove("hidden");
 else document.getElementById("feedTab").classList.remove("hidden");
}

async function addEmp(){
 let el = document.getElementById("empInput");
 await db.collection("allowed_employees").doc(el.value).set({});
 loadEmp();
}

async function loadEmp(){
 let snap=await db.collection("allowed_employees").get();
 let el = document.getElementById("empList");
 el.innerHTML="";
 snap.forEach(d=>{ el.innerHTML+=`<div class='p-2 border mb-1'>${d.id}</div>` });
}

function uploadCSV(){
 let r=new FileReader();
 r.onload=async e=>{
  for(let id of e.target.result.split("\n"))
   if(id.trim()) await db.collection("allowed_employees").doc(id.trim()).set({});
  loadEmp();
 };
 r.readAsText(document.getElementById("csv").files[0]);
}

async function loadFeed(isNext=false){
 try {
   let listEl = document.getElementById("list");
   let pageEl = document.getElementById("page");
   
   if (!listEl || !pageEl) {
     console.error("Missing DOM elements list/page");
     return;
   }
   
   listEl.innerHTML="<p class='text-gray-500'>Loading...</p>";
   
   let q=db.collection("feedbacks").orderBy("created_at","desc").limit(10);
   if(last && isNext) q=q.startAfter(last);
   let snap=await q.get();
   if(!snap.empty) last=snap.docs[snap.docs.length-1];

   listEl.innerHTML="";
   if(snap.empty) {
     listEl.innerHTML="<p class='text-gray-500 text-center'>No feedback found.</p>";
   } else {
     snap.forEach(d=>{
      let v=d.data();
      listEl.innerHTML+=`<div class='p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-3'>
      <div class='text-xs font-semibold text-indigo-600 mb-1 tracking-wider uppercase'>${v.department || 'N/A'} <span class='text-gray-400 mx-1'>|</span> <span class='text-gray-500'>${v.category || 'N/A'}</span></div>
      <p class='text-gray-800 text-sm leading-relaxed'>${v.message || ''}</p></div>`;
     });
   }
   pageEl.innerText="Page "+currPage;
 } catch (err) {
   console.error("Error loading feed:", err);
   document.getElementById("list").innerHTML=`<div class="p-4 bg-red-100 text-red-700 rounded-xl">Error: ${err.message}</div>`;
 }
}

function next(){currPage++;loadFeed(true);}
function prev(){
  if(currPage>1){
    currPage--;
    last=null; // reset cursor
    loadFeed(false);
  }
}
