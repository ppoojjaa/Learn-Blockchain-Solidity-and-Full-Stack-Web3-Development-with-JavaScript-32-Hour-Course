// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; //>=0.8.7 <0.9.0

contract SimpleStorage {
    //boolean, uint, int, address, string, bytes
    // bool hasFavNum = true;
    // uint256 favNum = 5;
    // string favNumInText = "Five";
    // int256 favInt =  -5;
    // address myAddress = 0x236d0fa7b0fe249Bc92edf82a17C9b3cFcB107E8;
    // bytes32 favBytes = "cat";

    //initialized to zero 
    uint256 favNum;
    //People public person = People({favNum:2, name: "Name1"});

    function store(uint256 _favNum) public{
        favNum = _favNum;
        favNum += 1;
        // retrieve();
    }

    function retrieve() public view returns(uint256){
       return favNum;
    }

    //Mappings:
    mapping(string => uint256) public nameToFavNumMap;

     //Arrays: 
    struct People {
        uint256 favNum;
        string name;
    }
    People[] public peoplevar;
   
    function addArray(string memory _name, uint256 _favNum) public{
       //People memory newPerson = People({favNum: _favNum , name: _name});
       //peoplevar.push(newPerson);
        peoplevar.push(People(_favNum,_name));
        nameToFavNumMap[_name] = _favNum;  //mapping
    }

}