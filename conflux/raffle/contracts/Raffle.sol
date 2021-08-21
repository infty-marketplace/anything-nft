// contracts/Raffle.sol
pragma solidity ^0.4.22;

/*
  Requirements:
    The creator sets the number of tickets and ticket price
    The creator must purchase the first ticket on creation
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
  
  address internal nftContract = address(keccak256("cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr"));

  address public manager;
  mapping(uint256 => RaffleInfo) public raffles;

  event CreateEvent(uint256 _tokenId, address _owner, uint _maxTickets, uint _price);
  event JoinEvent(uint256 _tokenId, address _participant, uint _qty);
  event DrawEvent(uint256 _tokenId, address _winner, uint _nftValue);
  event AbortEvent(uint256 _tokenId, address _owner);
  event Paid(address _from, uint _value);

  function Raffle() public payable {
    manager = msg.sender;
  }

  function createRaffle(uint _maxTickets, uint _price, address _owner, uint256 _tokenId) public payable {
    raffles[_tokenId].maxTickets = _maxTickets;
    raffles[_tokenId].price = _price;
    raffles[_tokenId].owner = _owner;

    emit CreateEvent(_tokenId, _owner, _maxTickets, _price);
  }

  // `fallback` function called when eth is sent to Payable contract
  function () public payable {
    emit Paid(msg.sender, msg.value);
  }

  // purchase tickets
  function joinRaffle(uint256 _tokenId, uint _qty) public payable returns(bool) {
    require(msg.value == raffles[_tokenId].price * _qty, "message value is not equal to tickets' total price");
    require(int(raffles[_tokenId].participants.length) <= int(raffles[_tokenId].maxTickets - _qty), "raffle does not have enough tickets left");

    for (uint i = 0; i < _qty; i++) {
      raffles[_tokenId].participants.push(msg.sender);
    }

    emit JoinEvent (_tokenId, msg.sender, _qty);
    
    if (raffles[_tokenId].participants.length == raffles[_tokenId].maxTickets) {
      return draw(_tokenId);
    }
    return true;
  }

  // award nftValue when all tickets are sold
  function draw(uint256 _tokenId) public restricted returns (bool) {

    if (raffles[_tokenId].participants.length > 0){
      uint seed = block.number;
      uint random = uint(keccak256(seed)) % raffles[_tokenId].participants.length;
      address winner = raffles[_tokenId].participants[random];
      uint nftValue = raffles[_tokenId].participants.length * raffles[_tokenId].price;
      uint commission = nftValue / 10 * 9;

      address(manager).transfer(commission);
      address(raffles[_tokenId].owner).transfer(nftValue - commission);
      // transfer nft to winner
      transferNft(winner, _tokenId);
      delete raffles[_tokenId];
      emit DrawEvent (_tokenId ,winner, nftValue);
    }else{
      // transfer nft to owner
      transferNft(raffles[_tokenId].owner, _tokenId);
      delete raffles[_tokenId];
      emit AbortEvent(_tokenId, raffles[_tokenId].owner);
    }

    return true;
  }

  function transferNft(address _to, uint256 _tokenId) internal{
      // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
      nftContract.call(bytes4(sha3("safeTransferFrom(address, address, uint256)")), address(this), _to, _tokenId);

  }

  function getParticipants(uint256 _tokenId) public view returns (address []) {
    return raffles[_tokenId].participants;
  }

  modifier restricted() {
        require(msg.sender == manager, "message sender is unauthorized");
        _;
  }
}