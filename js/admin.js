

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

if(localStorage.getItem("empId")!=="SEEIN00024"){
 denied.classList.remove("hidden");
}else{
 admin.classList.remove("hidden");
 loadEmp(); loadFeed();
}

function logout(){
 localStorage.clear();
 location.href="/";
}

function showTab(t){
 empTab.classList.add("hidden");
 feedTab.classList.add("hidden");
 if(t==="emp") empTab.classList.remove("hidden");
 else feedTab.classList.remove("hidden");
}

async function addEmp(){
 await db.collection("allowed_employees").doc(empInput.value).set({});
 loadEmp();
}

async function loadEmp(){
 let snap=await db.collection("allowed_employees").get();
 empList.innerHTML="";
 snap.forEach(d=>{ empList.innerHTML+=`<div class='p-2 border mb-1'>${d.id}</div>` });
}

function uploadCSV(){
 let r=new FileReader();
 r.onload=async e=>{
  for(let id of e.target.result.split("\n"))
   if(id.trim()) await db.collection("allowed_employees").doc(id.trim()).set({});
  loadEmp();
 };
 r.readAsText(csv.files[0]);
}

let last=null,page=1;

async function loadFeed(next=false){
 let q=db.collection("feedbacks").orderBy("created_at","desc").limit(10);
 if(last && next) q=q.startAfter(last);
 let snap=await q.get();
 if(!snap.empty) last=snap.docs[snap.docs.length-1];

 list.innerHTML="";
 snap.forEach(d=>{
  let v=d.data();
  list.innerHTML+=`<div class='p-3 bg-white rounded shadow'>
  <div class='text-xs text-gray-500'>${v.department} | ${v.category}</div>
  <p>${v.message}</p></div>`;
 });
 page.innerText="Page "+page;
}

function next(){page++;loadFeed(true);}
function prev(){
  if(page>1){
    page--;
    last=null; // reset cursor
    loadFeed(false);
  }
}
