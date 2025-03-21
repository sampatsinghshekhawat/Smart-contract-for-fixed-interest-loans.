// Set up Web3 and contract details
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const contractAddress = "0xe1b26baacf0587c11384e16e56e8dc5063524fc3";
const contractABI = [[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_loanAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_interestRate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "lender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			}
		],
		"name": "LoanGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LoanRepaid",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "borrower",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "interestRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repaymentAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
    // Add your contract's ABI here (after compiling the contract)
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Elements from the HTML
const lenderAddressElem = document.getElementById("lender-address");
const borrowerAddressElem = document.getElementById("borrower-address");
const loanAmountElem = document.getElementById("loan-amount");
const interestRateElem = document.getElementById("interest-rate");
const repaymentAmountElem = document.getElementById("repayment-amount");
const repaymentInput = document.getElementById("repayment-amount-input");
const repayButton = document.getElementById("repay-button");
const statusMessage = document.getElementById("status-message");

let lenderAddress;
let borrowerAddress;
let loanAmount;
let interestRate;
let repaymentAmount;

// Load contract details when page loads
window.onload = async () => {
    const accounts = await web3.eth.requestAccounts();
    lenderAddress = accounts[0];  // Assuming lender is the one interacting with the page
    borrowerAddress = "BORROWER_ADDRESS_HERE"; // Replace with the borrower address

    const loanDetails = await contract.methods.getLoanDetails().call();

    lenderAddressElem.textContent = loanDetails.lender;
    borrowerAddressElem.textContent = loanDetails.borrower;
    loanAmountElem.textContent = web3.utils.fromWei(loanDetails.loanAmount, "ether");
    interestRateElem.textContent = loanDetails.interestRate;
    repaymentAmountElem.textContent = web3.utils.fromWei(loanDetails.repaymentAmount, "ether");

    repaymentAmount = web3.utils.fromWei(loanDetails.repaymentAmount, "ether");
    document.getElementById("repayment-amount-display").textContent = repaymentAmount;
};

// Repay Loan
repayButton.onclick = async () => {
    const amountToRepay = web3.utils.toWei(repaymentInput.value, "ether");

    if (amountToRepay < repaymentAmount) {
        statusMessage.textContent = "Insufficient amount to repay the loan.";
        return;
    }

    try {
        await contract.methods.repayLoan().send({
            from: borrowerAddress,
            value: amountToRepay
        });
        statusMessage.textContent = "Loan repaid successfully!";
        statusMessage.style.color = "#28a745"; // Green
    } catch (error) {
        console.error(error);
        statusMessage.textContent = "An error occurred during repayment.";
    }
};
