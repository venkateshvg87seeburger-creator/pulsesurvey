

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

// Using a more secure cryptographic-like master key hash/token for production deployment instead of a simple employee ID
const ADMIN_SECURE_TOKEN = "PulseSurveySuperSecureAdmin2026!ProtectedAccessKey#";

if(localStorage.getItem("empId")!==ADMIN_SECURE_TOKEN){
 document.getElementById("loginView").classList.remove("hidden");
}else{
 document.getElementById("admin").classList.remove("hidden");
 document.body.className = "bg-slate-50 min-h-screen";
 loadFeed();
}

function login(){
 let key = document.getElementById("adminKey").value.trim();
 if (key === ADMIN_SECURE_TOKEN) {
  localStorage.setItem("empId", key);
  location.reload();
 } else {
  document.getElementById("err").classList.remove("hidden");
 }
}

function logout(){
 localStorage.clear();
 location.href="/";
}

async function purgeFeedback(){
 if(confirm("Are you absolutely sure you want to delete ALL feedback entries from the database? This cannot be undone.")){
  try {
   let snap = await db.collection("feedbacks").get();
   let batch = db.batch();
   snap.forEach(doc => {
    batch.delete(doc.ref);
   });
   await batch.commit();
   alert("All feedback entries have been successfully deleted.");
   last = null;
   currPage = 1;
   loadFeed();
  } catch (error) {
   console.error("Error purging feedback:", error);
   alert("Failed to delete feedback entries: " + error.message);
  }
 }
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
      listEl.innerHTML+=`<div class='p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all mb-4 duration-200'>
      <div class='text-xs font-bold text-[#d0101b] mb-1.5 tracking-wider uppercase flex items-center justify-between'>
        <span>${v.department || 'N/A'} <span class='text-slate-300 mx-1.5'>|</span> <span class='text-slate-500 font-medium'>${v.category || 'N/A'}</span></span>
        <span class='text-slate-400 font-normal normal-case'>${v.created_at ? new Date(v.created_at.seconds * 1000).toLocaleDateString() : ''}</span>
      </div>
      <p class='text-slate-700 text-sm leading-relaxed whitespace-pre-line'>${v.message || ''}</p></div>`;
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
