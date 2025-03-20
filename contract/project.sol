// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedInterestLoan {
    address public lender;
    address public borrower;
    uint256 public loanAmount;
    uint256 public interestRate; // Interest rate as a percentage
    uint256 public repaymentAmount;
    bool public loanPaid;

    event LoanGranted(address indexed lender, address indexed borrower, uint256 amount, uint256 interestRate);
    event LoanRepaid(address indexed borrower, uint256 amount);

    constructor(address _borrower, uint256 _loanAmount, uint256 _interestRate) {
        lender = msg.sender;  // The address deploying the contract is the lender
        borrower = _borrower;
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        repaymentAmount = loanAmount + (loanAmount * interestRate / 100); // Calculate total repayment amount
        loanPaid = false;

        emit LoanGranted(lender, borrower, loanAmount, interestRate);
    }

    // Function to allow the borrower to repay the loan
    function repayLoan() public payable {
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        require(!loanPaid, "Loan already repaid");
        require(msg.value >= repaymentAmount, "Insufficient funds to repay the loan");

        loanPaid = true;
        payable(lender).transfer(msg.value);  // Transfer the repayment to the lender

        emit LoanRepaid(borrower, msg.value);
    }
}

