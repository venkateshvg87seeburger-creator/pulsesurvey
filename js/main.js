

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

function resetForm() {
  document.getElementById("successView").classList.add("hidden");
  document.getElementById("formView").classList.remove("hidden");
}

async function submit(){
 let btn = document.getElementById("submitBtn");
 let btnText = btn.innerText;
 btn.innerText="Submitting...";
 try{
  await db.collection("feedbacks").add({
   department: document.getElementById("department").value,
   category: document.getElementById("category").value,
   message: document.getElementById("message").value,
   created_at: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // Hide form view, show success view
  document.getElementById("formView").classList.add("hidden");
  document.getElementById("successView").classList.remove("hidden");
  
  // Clear the message field for future
  document.getElementById("message").value="";
 }catch(e){
  document.getElementById("msg").innerText="Error submitting feedback";
  btn.innerText = btnText;
 }
}

function closeWindow() {
  // If the browser doesn't allow window.close() for unscripted windows,
  // we fallback to simply reloading to reset the app or thanking the user.
  if (confirm("Close the page? If the browser prevents this, you can manually close the tab.")) {
    window.close();
  }
}
