//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{
    
    function getPrice() internal view returns(uint256) {
        //To interact with smart contracts you need two things
        //1. ABI: implemented through interface
        //2. Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        // address was retrived from chainlink datafeed  - Rinkby testnet 
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        (,int price,,,) = priceFeed.latestRoundData(); //eth in terms of usd; has 8 decimals 
        return uint256(price * 1e10);
    }
 
    function getVersion() internal view returns(uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount)  internal view returns(uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUSD;
    }

}
