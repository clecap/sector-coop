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



identityServerApi.datablob = {};

//SecTor Smart Contract API

sectorApi.functions.interact = (methodObject, options, call=true, callback = (result){}) => {
    _exec = methodObject.send;
    if (call){
	_exec = methodObject.call;
    }
    options.gas = 1000000;

    _exec(options=options,
	  callback=(error, result) => {
	      if (error){
		  alert("An Error has occurred while attempting to interact with the SecTor Smart Contract");
		  throw error;
	      }
	      callback(result);
	      return result;
	  });
};

sectorApi.functions.loadWallet = () => {
    userclient.web3.eth.accounts.wallet.decrypt(identityServerApi.datablob.ethereum.keystoreArray,
					    $("#password").val());
};

sectorApi.functions.exportWallet = () => {
    _pass = $("#password").val();
    if ( _pass == "" ){
	throw "Password field is empty";
    }
    identityServerApi.datablob.ethereum.keystoreArray = userclient.web3.accounts.wallet.encrypt(_pass);
};
// Identity Server API
// {
//     "ethereum" : {
// 	"keystoreArray":[],
// 	"walletAccounts":{}
//     },
//     "bs" : {}
// }

identityServerApi.functions.decryptDatablob= (datablob, password) => { //TODO
    
};



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
