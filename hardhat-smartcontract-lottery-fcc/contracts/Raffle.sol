//Raffle contract spec':
//People should be able to enter the lottery (paying some amount)
//The lottery should pick a random winner (verifiably random)
//  => needs a Chainlink Oracle
//A winner should be selected every X minutes (completely automated)
//  => needs a Chainlink Keeper

//SPDX-License-Identifier MIT

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle_err_NotEnoughETHEntered();
error Raffle_err_TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    /* *State variables* */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private immutable NUM_WORDS = 1;

    //Lottery variable
    address private s_recentWinner;

    /* Events */
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address _vrfCoordinatorV2,
        uint256 _entranceFee,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2(_vrfCoordinatorV2) {
        i_entranceFee = _entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
        i_gasLane = _gasLane;
        i_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle_err_NotEnoughETHEntered();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender); //Emit an Event when we update the number of players (a dynamic array or mapping)
    }

    //To pick a random number is a 2-transactions process
    function requestRandomWinner() external {
        //1.Request a random number
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //keyHash = gas lane or maximum gas we are willing to pay
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /*_requestId*/,
        uint256[] memory _randomwords
    ) internal override {
        //2.Do something with the received random number
        uint256 indexOfWinner = _randomwords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        //Send money to winner
        (bool success, ) = s_recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle_err_TransferFailed();
        }
        emit WinnerPicked(s_recentWinner);
    }

    /*
     * Getter functions
     */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 _index) public view returns (address) {
        return s_players[_index];
    }

    function getVRFCoordinator() public view returns (VRFCoordinatorV2Interface) {
        return i_vrfCoordinator;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
