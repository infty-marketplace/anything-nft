// contracts/Raffle.sol
pragma solidity ^0.4.22;

/*
  Requirements:
    The creator sets the number of tickets and ticket price
    Participants can buy as many tickets as are available
    The nftValue is awarded to a random participant once all tickets are sold
*/

contract Raffle {
  struct RaffleInfo {
    uint maxTickets;
    uint price;
    address[] participants;
    address owner;
    }

  address public manager;
  mapping(address => mapping(uint => RaffleInfo)) public raffles;

  event CreateEvent(address _minter, uint _tokenId, address _owner, uint _maxTickets, uint _price);
  event JoinEvent(address _minter, uint _tokenId, address _participant, uint _qty);
  event DrawEvent(address _minter, uint _tokenId, address _winner, uint _nftValue);
  event AbortEvent(address _minter, uint _tokenId, address _owner);
  event Paid(address _from, uint _value);

  function Raffle() public payable {
    manager = msg.sender;
  }

  function createRaffle(uint _maxTickets, uint _price, address _owner, address _minter, uint _tokenId) public payable {
    raffles[_minter][_tokenId].maxTickets = _maxTickets;
    raffles[_minter][_tokenId].price = _price;
    raffles[_minter][_tokenId].owner = _owner;

    emit CreateEvent(_minter, _tokenId, _owner, _maxTickets, _price);
  }

  // `fallback` function called when eth is sent to Payable contract
  function () public payable {
    emit Paid(msg.sender, msg.value);
  }

  // purchase tickets
  function joinRaffle(address _minter, uint _tokenId, uint _qty) public payable returns(bool) {

    require(msg.value == raffles[_minter][_tokenId].price * _qty, "message value is not equal to tickets' total price");
    require(int(raffles[_minter][_tokenId].participants.length) <= int(raffles[_minter][_tokenId].maxTickets - _qty), "raffle does not have enough tickets left");

    for (uint i = 0; i < _qty; i++) {
      raffles[_minter][_tokenId].participants.push(msg.sender);
    }

    emit JoinEvent (_minter, _tokenId, msg.sender, _qty);
    
    if (raffles[_minter][_tokenId].participants.length == raffles[_minter][_tokenId].maxTickets) {
      return draw(_minter, _tokenId);
    }
    return true;
  }

  // award nftValue when all tickets are sold
  function draw(address _minter, uint _tokenId) public restricted returns (bool) {

    if (raffles[_minter][_tokenId].participants.length > 0){
      uint seed = block.number;
      uint random = uint(keccak256(seed)) % raffles[_minter][_tokenId].participants.length;
      address winner = raffles[_minter][_tokenId].participants[random];
      uint nftValue = raffles[_minter][_tokenId].participants.length * raffles[_minter][_tokenId].price;
      uint commission = nftValue / 10 * 9;

      address(manager).transfer(commission);
      address(raffles[_minter][_tokenId].owner).transfer(nftValue - commission);
      // transfer nft to winner
      transferNft(winner, _minter, _tokenId);
      delete raffles[_minter][_tokenId];
      emit DrawEvent (_minter, _tokenId ,winner, nftValue);
    }else{
      // transfer nft to owner
      transferNft(raffles[_minter][_tokenId].owner, _minter, _tokenId);
      delete raffles[_minter][_tokenId];
      emit AbortEvent(_minter, _tokenId, raffles[_minter][_tokenId].owner);
    }

    return true;
  }

  function transferNft(address _to, address _minter, uint _tokenId) internal{
      // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
      _minter.call(bytes4(sha3("safeTransferFrom(address, address, uint256)")), address(this), _to, _tokenId);

  }

  function getParticipants(address _minter, uint _tokenId) public view returns (address []) {
    return raffles[_minter][_tokenId].participants;
  }

  modifier restricted() {
        require(msg.sender != manager, "message sender is unauthorized");
        _;
  }
}