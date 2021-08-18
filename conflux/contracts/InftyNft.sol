pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InftyNft is ERC721URIStorage, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("InftyNft", "iNFT") {}

  function mint(address creator, string memory URI)
    public
    returns (uint256)
  {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(creator, newItemId);
    _setTokenURI(newItemId, URI);

    return newItemId;
  }

  function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal override(ERC721, ERC721Enumerable)
  {
      super._beforeTokenTransfer(_from, _to, _tokenId);
  }

  function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
  {
      return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool)
  {
      return super.supportsInterface(_interfaceId);
  }

  function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) 
  {
      super._burn(_tokenId);
  }
}
