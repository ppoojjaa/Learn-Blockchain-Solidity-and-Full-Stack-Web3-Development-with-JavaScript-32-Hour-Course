//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory{
    //Simple storage contract ; visibilty: public ; var name: simplestoragevar
    SimpleStorage[] public simpleStorageArr;
   
    function createSimpleStorageContract() public {
        SimpleStorage simpleStorageVar = new SimpleStorage(); //here a new simplestorage contract is deployed
        simpleStorageArr.push(simpleStorageVar);
    
    }
    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNum) public {
        //You always need 2 things while interacting with other smart contracts 
        //Address;
        //ABI- Application Binary Interface
        
        SimpleStorage simpleStorageVar = simpleStorageArr[_simpleStorageIndex];
        simpleStorageVar.store(_simpleStorageNum);

       // simpleStorageArr[_simpleStorageIndex].store(_simpleStorageNum);

    }
    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256){
        SimpleStorage simpleStorageVar = simpleStorageArr[_simpleStorageIndex];
        return simpleStorageVar.retrieve();
       
       // simpleStorageArr[_simpleStorageIndex].retrieve();
    }
}