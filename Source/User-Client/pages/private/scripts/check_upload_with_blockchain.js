if(!blockchainApprovesOfDocumentUpload()) {
   // redirect to home page
   window.location.replace("../home.html");
} 
// else, everything is okay and the user can proceed with uploading a document

function blockchainApprovesOfDocumentUpload() {
   return true;
}