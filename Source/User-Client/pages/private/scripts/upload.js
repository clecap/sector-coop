var server = "http://localhost:3000/upload-document";

$(function() {
   $("#upload-button").on('click', function(e) {
      e.preventDefault();
      var document = $('#file').val();

      var payload = document; //maybe add optional metadata here to JSON
      //another possibility would be to send a second request with the metadata only
      if(blockchainApprovesOfDocumentUpload()) {
         $.ajax({
            type: "POST",
            url: server,
            data: payload,
            mimeType: "application/pdf",
            statusCode: {
               201: function() {
                  alert("The document was uploaded successfully");
               },
               500: function() {
                  alert("Something went wrong.");
               }
            }
         })
      }
   })
});

function blockchainApprovesOfDocumentUpload() {
   return true;
}