var userclient = {config:undefined,
		  web3:undefined};
var sectorApi = {config:undefined,
		 smartContract:undefined,
		 functions:{}};
var identityServerApi = {config:undefined};
var documentServerApi = {config:undefined};


$.getJSON('/config/contract/SecTor.json', (data) => {
    sectorApi.config = data;
    $.getJSON('/config/deploy/userclient.json', (data) => {
	userclient.config = data;
	userclient.web3 = new Web3(userclient.config.ethereum.providerAddress);
	sectorApi.smartContract = new userclient.web3.eth.Contract(sectorApi.config.abi,
								   userclient.config.ethereum.contractAddress);

	identityServerApi.config = userclient.config.identityServer;
	documentServerApi.config = userclient.config.documentServer;
    });
});



identityServerApi.datablob = {};



sectorApi.functions.interact = (methodObject, options, call=true) => {
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
	      return result;
	  });
};
