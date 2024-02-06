// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;
    // People public person = People({favoriteNumber: 12, name: "Patrick"});

    struct People {
        uint256 favoriteNumber;
        string name;
    }
    People[] public people;

    mapping(string => uint256) public name2favNum;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        // people.push(People(_favoriteNumber, _name));
        // People memory newPerson = People({favoriteNumber: _favoriteNumber, name: _name});
        People memory newPerson = People(_favoriteNumber, _name);
        people.push(newPerson);
        name2favNum[_name] = _favoriteNumber;
    }
}
