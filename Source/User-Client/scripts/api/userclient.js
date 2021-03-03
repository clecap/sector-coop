var userclient = {config:undefined,
		  web3:undefined};
var sectorApi = {config:undefined,
		 smartContract:undefined,
		 functions:{}};
var identityServerApi = {config:undefined,
			 functions:{}};
var documentServerApi = {config:undefined};


$.getJSON('/config/contract/SecTor.json', (data) => {
    console.log("Loaded SecTor SmartContract abi");
    sectorApi.config = data;
    $.getJSON('/config/deploy/userclient.json', (data) => {
	console.log("Loaded Userclient Configuration");
	userclient.config = data;
	userclient.web3 = new Web3(userclient.config.ethereum.providerAddress);
	sectorApi.smartContract = new userclient.web3.eth.Contract(sectorApi.config.abi,
								   userclient.config.ethereum.contractAddress);
	identityServerApi.config = userclient.config.identityServer;
	documentServerApi.config = userclient.config.documentServer;
    });
});



identityServerApi.datablob = {"ethereum" :
			      {
				  "keystoreArray":[],
				  "walletAccounts":{}
			      },
			      "bs" : {}
			     };

//SecTor Smart Contract API

sectorApi.functions.interact = (methodObject, options, call=true, callback = (result)=>{}) => {
    options.gas = 1000000;
    if (call){
	methodObject.call(options=options).then(callback);
    }
    else{
	methodObject.send(options=options)
	    .on("receipt", callback)
	    .on("error", (error, receipt) => {
		console.log(receipt);
		throw error;
	    });
    }
};

sectorApi.functions.loadWallet = () => {
    userclient.web3.eth.accounts.wallet.decrypt(identityServerApi.datablob.ethereum.keystoreArray,
						$("#password").val());
};

sectorApi.functions.exportWallet = () => {
    _pass = $("#password").val();
    if ( _pass == "" ){
	alert("Please enter your password");
	throw "Please enter your password";
    }
    identityServerApi.datablob.ethereum.keystoreArray = userclient.web3.accounts.wallet.encrypt(_pass);
};

// Identity Server API


identityServerApi.functions.decryptDatablob= (datablob, password) => { //TODO
    
};

identityServerApi.functions.fetchDatablob = () => {
    $.getJSON('/download-datablob', (datablob) => {
	console.log("Downloaded Datablob");
	identityServerApi.datablob = datablob;
	console.log("Successfully loaded data from Identity Server");
	alert("Successfully loaded data from Indentity Server");
    }); 
};

identityServerApi.functions.fetchDatablob();

identityServerApi.functions.uploadDatablob = () => {
    $.ajax({
	type: "POST",
	url: "/upload-datablob",
	data: JSON.stringify(identityServerApi.datablob),
	success: () => {alert("Success");},
	contentType:"application/json"
    });
};

$("#datablob-upload-button").click(()=>{
    identityServerApi.functions.uploadDatablob();
});

$("#datablob-button").click(()=>{
    fr = new FileReader();
    fr.readAsText( $("#datablob")[0].files[0] ); 
    fr.onload = () => {
	datablob = JSON.parse(fr.result);
	identityServerApi.datablob = datablob;
	sectorApi.functions.loadWallet();
    };
});

//TODO: Datablob-export
$("#datablob-export-button").click(()=> { //https://stackoverflow.com/a/34156339
    function download(content, fileName, contentType) {
	var a = document.createElement("a");
	var file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
    }
    download(JSON.stringify(identityServerApi.datablob), 'datablob.json', 'text/json');
});
