const express = require('express');
const {Web3} = require('web3');
require("dotenv").config();
const Provider = require('@truffle/hdwallet-provider');
const parseWithRetries = require('./parser')

const app = express();
const PORT = process.env.PORT || 3000;
const contractAddress = '0x6848ab8A45aDca9DC46Cd148FAAFE9A467Cd93E2';
const contractABI = require('./assets/abi/OracleContract.json');
const privatekey = process.env.METAMASK_PRIVATE_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY
const goerliNetworkURL = `wss://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`;

const inputs = [
    {
        "indexed": false,
        "internalType": "string",
        "name": "username1",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "username2",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "gameName",
        "type": "string"
    }
]
const web3 = new Web3(goerliNetworkURL);

var options = {
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    },
    address: contractAddress,
    topics: [
        '0x3be8b6185ef56eed69207e34c8d758a57cbfc332dac69434d5b06f202a065468'
    ]
};
const getEvents = async () => {
    const eventSignature = 'CallbackGetWinner(string,string,string)';
    let subscription = await web3.eth.subscribe('logs', options, function(error, result){
        if (!error)
            console.log(result);
    })
    subscription.on('data', async log => {

        const decodedData = web3.eth.abi.decodeLog(inputs, log.data, log.topics);
        console.log(decodedData)
    });
    subscription.on('error', error =>
        console.log('Error when subscribing to New block header: ', error),
    );
}
getEvents()
parseWithRetries(5,'2216221', '#11374126')