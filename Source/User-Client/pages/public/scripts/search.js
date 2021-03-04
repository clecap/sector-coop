var server = "http://localhost:3000/search-document"

$(function() {
   $("#search-button").on('click', function(e) {
      e.preventDefault();
      var hash = $('#hash').val();
      var payload = JSON.stringify(
         {
            "hash" : hash.toString()
         }
      );

      $.ajax({
         type: "POST",
         url: server,
         data: payload,
         contentType: "application/json",
         dataType: "json",
         success: function (response) {
            
         },
         statusCode: {
            204: function() {
               // the document with the given hash exists and was found.
               alert("This document exists.")
            },
            404: function() {
               // document does not exist
               alert("This document does not exist.");
            }
         }
      });
       $("#log").html("");
       sectorApi.functions.interact(sectorApi.smartContract.methods.getDocument("0x".concat( hash )), {}, true, callback=(result)=>{
	   $("#log").append(JSON.stringify(result, null, "<br/>"));
	   $("#log").append("<br/>")
       });
       sectorApi.functions.interact(sectorApi.smartContract.methods.getDocHashes(), {}, true, callback=(result)=>{
	   $("#log").append(JSON.stringify(result, null, "<br/>"));
       });
      
   })
})
