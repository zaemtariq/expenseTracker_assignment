import './style.css';
import React, { useState} from "react";
import History from "./history";
import Ledger from "./IncomeExpense";
import BalanceCheck from "./balance";

const Web3 = require('web3')
const Tx = require("ethereumjs-tx").Transaction;

const infura_link = "https://ropsten.infura.io/v3/70d3232596d04f608335f4ec1e72f81e";
const deployed_contract_address = "0x430935c6f2f3b1073c2cb6a50e5d0373827259d8";
const account1_public_address = "0x8359605d620D6241f809007de4D674D66Bd4E2c0";
const account1_privatekey = Buffer.from("c40df1bffefea64f691ff145e47afc1604561f90de3e83ff4484e314a8b40fa9", 'hex');
const web3 = new Web3(infura_link);

const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_data",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "_val",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_type",
				"type": "string"
			}
		],
		"name": "Tranx",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dt",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "exp",
				"type": "int256"
			}
		],
		"name": "Expense",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetExpense",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetIncome",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dt",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "inc",
				"type": "int256"
			}
		],
		"name": "Income",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "bals",
				"type": "int256"
			}
		],
		"name": "currentBal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getcurrentBal",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new web3.eth.Contract(ABI, deployed_contract_address);


function Transaction() {
	const [text, setText] = useState();
	const [num, setNum] = useState(0);
	const [event, setEvent] = useState();
	const [inc, setInc] = useState(0);
	const [exp, setExp] = useState(0);
	const [balance, setBalance] = useState(0);
	const state = {
		bal: balance,
		Income: inc,
		Expense: exp,
		AllEvents: event
	}

	function ExpenseTransaction() {
		const i=Math.abs(num);
		async function doTrnx() {
			try {
				const txCount = await web3.eth.getTransactionCount(account1_public_address);
				const TxObject = {
					nonce: web3.utils.toHex(txCount),
					data: contract.methods.Expense(text, i).encodeABI(),
					to: "0x430935c6f2f3b1073c2cb6a50e5d0373827259d8",
					gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gWei')),
					gasLimit: web3.utils.toHex(3000000)
				}
				const tx = new Tx(TxObject, { 'chain': 'ropsten' });
				tx.sign(account1_privatekey);
				const serializedTX = tx.serialize();
				const raw = '0x' + serializedTX.toString('hex');
				 await web3.eth.sendSignedTransaction(raw);
				console.log("ETransaction Succesful");
				GetCurentBal();
				eventFunction();

			} catch (err) {
				console.log("This is Error:", err);
			}
		}
		doTrnx();
		
	}
	function IncomeTransaction() {
		async function doTrnx() {
			try {
				const txCount = await web3.eth.getTransactionCount(account1_public_address);
				const TxObject = {
					nonce: web3.utils.toHex(txCount),
					data: contract.methods.Income(text, num).encodeABI(),
					to: "0x430935c6f2f3b1073c2cb6a50e5d0373827259d8",
					gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gWei')),
					gasLimit: web3.utils.toHex(3000000)
				}
				const tx = new Tx(TxObject, { 'chain': 'ropsten' });
				tx.sign(account1_privatekey);
				const serializedTX = tx.serialize();
				const raw = '0x' + serializedTX.toString('hex');
				 await web3.eth.sendSignedTransaction(raw);
				console.log("Transaction Succesful");
				eventFunction();
				GetCurentBal();
			} catch (err) {
				console.log("This is Error:", err);
			}
		}
		doTrnx();
	}


	function GetCurentBal() {
		contract.methods.getcurrentBal().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setBalance(result);
			}
			else {
				console.log("Returned Error", err);
			}
		});

		contract.methods.GetExpense().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setExp(result);
			}
			else {
				console.log("Returned Error", err);
			}
		});

		contract.methods.GetIncome().call((err, result) => {
			if (!err) {
				console.log("reuturned value of retrieve", result);
				setInc(result);
				
			}
			else {
				console.log("Returned Error", err);
			}
		});
	}

	const eventFunction = async () => {
		try {
			let getAllEvent = await contract.getPastEvents("AllEvents", {
				fromBlock: 0,
				toBlock: "latest"
			});
			setEvent(getAllEvent);


		} catch (err) {
			console.log(err);
		}
	}

	return (<div>
		
		<div>
			<BalanceCheck name={state.bal} />
			<Ledger inc={state.Income} exp={state.Expense} />
			<History name={event} />
			<br />
			<h5>ADD TRANSACTION</h5>
			<input type="text" value={text} id="ex" onChange={(e) => setText(e.target.value)} placeholder="Enter Details..." />
			<br />
			<input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter Number..." />

			<button onClick={() => {
			if (num > 0) {
				console.log("Positive")
				IncomeTransaction();

			}
			else {
				console.log("Negative")
				ExpenseTransaction();
			}
		}}>Process Transaction</button>


		</div>
		


	</div>)
}

export default Transaction;
