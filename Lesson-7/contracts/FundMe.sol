// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    //Type Declaration-
    using PriceConverter for uint256;

    //State variables-
    uint256 public constant MIN_USD = 50 * 10**18;
    address[] private s_funders; //array of all the addresses of the sender's
    mapping(address => uint256) private addressToAmountFunded; //see which address has funded how much
    address private immutable i_owner;
    AggregatorV3Interface public s_priceFeed;

    //Parameterizing the priceFeed address and passing it in with the constructor
    //that gets saved as a global variable to an AggregatorV3Interface type

    //or passing it to the getConversionRate() function which passes it
    //to the getPrice() function which then calls the latestrounddata

    //events -none
    //modifier-
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeed) {
        s_priceFeed = AggregatorV3Interface(priceFeed);
        i_owner = msg.sender;
    }

    receive() external payable {
        fund();
    }

    function fund() public payable {
        require( //passes msg.value in getConversion function
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
            "Didn't send enough!"
        );
        addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funderadd = s_funders[i];
            addressToAmountFunded[funderadd] = 0;
        }

        s_funders = new address[](0);
        //Transfer vs send vs call
        (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(callSuccess);
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    //getters
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return addressToAmountFunded[fundingAddress];
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
