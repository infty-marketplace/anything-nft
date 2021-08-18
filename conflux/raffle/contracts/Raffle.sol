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
    uint256 tokenId;
    }
  
  address internal nftContract = address(keccak256("cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr"));

  address public manager;
  mapping(address => RaffleInfo) public raffles;

  event CreateEvent(address _nft, address _owner, uint _maxTickets, uint _price);
  event JoinEvent(address _nft, address _participant, uint _qty);
  event DrawEvent(address _nft, address _winner, uint _nftValue);
  event AbortEvent(address _nft, address _owner);
  event Paid(address _from, uint _value);

  function Raffle() public payable {
    manager = msg.sender;
  }

  function createRaffle(uint _maxTickets, uint _price, address _owner, address _nft, uint256 _tokenId) public payable {
    raffles[_nft].maxTickets = _maxTickets;
    raffles[_nft].price = _price;
    raffles[_nft].owner = _owner;
    raffles[_nft].tokenId = _tokenId;

    emit CreateEvent(_nft, _owner, _maxTickets, _price);
  }

  // `fallback` function called when eth is sent to Payable contract
  function () public payable {
    emit Paid(msg.sender, msg.value);
  }

  // purchase tickets
  function joinRaffle(address _nft, uint _qty) public payable returns(bool) {
    require(msg.value == raffles[_nft].price * _qty, "message value is not equal to tickets' total price");
    require(int(raffles[_nft].participants.length) <= int(raffles[_nft].maxTickets - _qty), "raffle does not have enough tickets left");

    for (uint i = 0; i < _qty; i++) {
      raffles[_nft].participants.push(msg.sender);
    }

    emit JoinEvent (_nft, msg.sender, _qty);
    
    if (raffles[_nft].participants.length == raffles[_nft].maxTickets) {
      return draw(_nft);
    }
    return true;
  }

  // award nftValue when all tickets are sold
  function draw(address _nft) public restricted returns (bool) {

    if (raffles[_nft].participants.length > 0){
      uint seed = block.number;
      uint random = uint(keccak256(seed)) % raffles[_nft].participants.length;
      address winner = raffles[_nft].participants[random];
      uint nftValue = raffles[_nft].participants.length * raffles[_nft].price;
      address(raffles[_nft].owner).transfer(nftValue);
      // transfer nft to winner
      // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
      // nftContract.call(bytes4(sha3("safeTransferFrom(address, address, uint256)")), (address(this), winner, raffles[_nft].tokenId));
      transferNft(winner, raffles[_nft].tokenId);
      delete raffles[_nft];
      emit DrawEvent (_nft ,winner, nftValue);
    }else{
      // transfer nft to owner
      transferNft(raffles[_nft].owner, raffles[_nft].tokenId);
      delete raffles[_nft];
      emit AbortEvent(_nft, raffles[_nft].owner);
    }

    return true;
  }

  function transferNft(address _to, uint256 _tokenId) internal{
      // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
      nftContract.call(bytes4(sha3("safeTransferFrom(address, address, uint256)")), address(this), _to, _tokenId);

  }

  function getParticipants(address _nft) public view returns (address []) {
    return raffles[_nft].participants;
  }

  modifier restricted() {
        require(msg.sender == manager, "message sender is unauthorized");
        _;
  }
}