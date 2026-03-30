

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

async function login(){
 let id=empId.value.trim();

 if(id==="SEEIN00024"){
  localStorage.setItem("empId",id);
  location.href="/admin-view.html";
  return;
 }

 let doc=await db.collection("allowed_employees").doc(id).get();
 if(doc.exists){
  loginView.classList.add("hidden");
  formView.classList.remove("hidden");
 }else error.classList.remove("hidden");
}

async function submit(){
 msg.innerText="Submitting...";
 try{
 await db.collection("feedbacks").add({
  department:department.value,
  category:category.value,
  message:message.value,
  created_at:firebase.firestore.FieldValue.serverTimestamp()
 });
 msg.innerText="✅ Feedback submitted successfully";
 message.value="";
 }catch(e){
 msg.innerText="❌ Error submitting feedback";
 }
}
