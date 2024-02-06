// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // uint256 public minUsd = 50 * 1e18; //set minimum expected USD fund amount
    uint256 public constant MIN_USD = 50 * 1e18;

    address[] private s_funders;

    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_owner; //"i_" prefix for immutable variables

    AggregatorV3Interface private s_priceFeed; //"s_" prefix for storage variables

    constructor(address _priceFeedAddress) {
        //called immediately when deploying a contract
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function fund() public payable {
        // set minimum fund amount in ETH
        // require(msg.value > 1e18, "Didn't send enough!");
        // reverting = undo any action before 'REQUIRE' instruction, and send remainig gas back
        // set minimum amount in USD instead -- need to use a decentralised network
        // as the value of ETH in USD is decided outside the blockchain
        // require(getConversionRate(msg.value) >= minUsd, "Didn't send enough!");
        require(
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
            "Didn't send enough!"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // require(msg.sender == owner, "Sender is not owner!");
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
            // reset array
            s_funders = new address[](0);
        }
        // actually withdraw the funds -- 3 ways: transfer x send x call
        // payable(msg.sender).transfer(address(this).balance);
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed!");
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
            // reset array
            //funders = new address[](0);
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Sender is not owner!");
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /*
     */
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getAddressToAmountFunded(
        address _funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[_funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
/*********************************************************** */
