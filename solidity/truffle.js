module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
	  2020: {
	    host: "127.0.0.1",
	    port: 8545,
	    network_id: "*",
	    from: "0x7B5FB9A5535f2976cdc99c57d19111B2Ed3cB925"	  
	  }
  },
  compilers: {
    solc: {
      version: "0.6.0"
    }
  }
};
