//send funds from users 
//withdraw funds 
//set a min funding value in usd


//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error NotOwner(); 
contract FundMe{

    using PriceConverter for uint256;
    uint256 public constant MIN_USD = 50 * 1e18;
    address[] public funders; //array of all the addresses of the sender's 
    mapping(address=> uint256) public addressToAmountFunded; //see which address has funded how much 
    address public immutable i_owner;

    constructor(){
        i_owner = msg.sender;
    }

    function fund() public payable { //for sending money
        // set a minimum fund amt in USD
        // send eth to this contract 
        require(msg.value.getConversionRate() >= MIN_USD, "Didn't send enough!"); //this has 18 decimals because the value is in wei 
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner { //to withdraw money from the sender

        for(uint256 i = 0; i < funders.length; i++){
            address funderadd = funders[i];
            addressToAmountFunded[funderadd] =0 ;
        }
        //reset the array 
        funders = new address[] (0); //funders variable now equals a brand new address array with 0 objects in it.

        //actual withdrawal
        //To send the native currency there are 3 ways- TRANSFER, SEND, CALL
        
        //TRANSFER
        //msg.sender is of type address 
        // //payable(msg.sender) if of type payable address.
        // payable(msg.sender).transfer(address(this).balance);  // this automatically reverts if the function fails 

        // //SEND  
        // bool sendSuccess = payable(msg.sender).send(address(this).balance); // this returns a boolean value true or false 
        // require(sendSuccess, "Send Failed!"); 

        //CALL
        //This call function returns 2 variables 
        //The dataReturned will have the data which will be returned by the function that is called.
        //(bool callSuccess, bytes memory dataReturned) =  payable(msg.sender).call{value: address(this).balance}(""); //function information is included is ""
        (bool callSuccess,) =  payable(msg.sender).call{value: address(this).balance}(""); 
        require(callSuccess,"Call failed!");
    }
    //modifier
    modifier onlyOwner{
        //require(msg.sender == i_owner, "Sender is not the owner");
        if (msg.sender != i_owner){
            revert NotOwner();
        }
        _; 
    }

    //recieve 
    //fallback 
    

}
