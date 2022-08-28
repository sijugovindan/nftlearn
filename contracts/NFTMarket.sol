// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
  using Counters for Counters.Counter;

  struct Asset{
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
  }

  Counters.Counter private _listedItems;
  Counters.Counter private _tokenIds;

  mapping(string => bool) private _usedTokenURIs;

  uint256[] private _allAssetTokens;
  mapping(uint => Asset) private _idToAsset;
  mapping(uint => uint) private _idToAssetTokenIndex;

  mapping(address => mapping(uint => uint)) private _ownedAssetTokens;
  mapping(uint => uint) private _idToOwnedAssetTokenIndex;

  uint public listingPrice = 0.025 ether;

  event AssetRegistered(
    uint tokenId,
    address creator,
    bool isListed
  );

  constructor() ERC721("RastrAssets", "RASTR") {}

  function mintToken(string memory tokenURI,uint price) external payable returns (uint) {
    require(_usedTokenURIs[tokenURI]==false, "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _tokenIds.increment();
    _listedItems.increment();
    uint newTokenId = _tokenIds.current();
    
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _usedTokenURIs[tokenURI] = true;
    _idToAsset[newTokenId] = Asset(
      newTokenId,
      price,
      msg.sender,
      true
    );
    emit AssetRegistered(newTokenId, msg.sender, false);
    return newTokenId;
  }

  
   function burnToken(uint tokenId) external {
    _burn(tokenId);
  }

   function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId
  ) internal virtual override {

    super._beforeTokenTransfer(from, to, tokenId);
    // minting token
    if (from == address(0)) {
      // add token to all assetTokens enumeration
      _idToAssetTokenIndex[tokenId] = _allAssetTokens.length;
      _allAssetTokens.push(tokenId);
    }else if (from != to) { // burn or transfer
      // remove token  from specfic owner enumeration
      uint lastTokenIndex = balanceOf(from) - 1;
      uint tokenIndex = _idToOwnedAssetTokenIndex[tokenId];

      if (tokenIndex != lastTokenIndex) {
        uint lastTokenId = _ownedAssetTokens[from][lastTokenIndex];

        _ownedAssetTokens[from][tokenIndex] = lastTokenId;
        _idToOwnedAssetTokenIndex[lastTokenId] = tokenIndex;
      }
      delete _idToOwnedAssetTokenIndex[tokenId];
      delete _ownedAssetTokens[from][lastTokenIndex];
    }

    //burn
    if (to == address(0)) {
      // remove token from all assetTokens enumeration
      uint lastTokenIndex = _allAssetTokens.length - 1;
      uint tokenIndex = _idToAssetTokenIndex[tokenId];
      uint lastTokenId = _allAssetTokens[lastTokenIndex];

      _allAssetTokens[tokenIndex] = lastTokenId;
      _idToAssetTokenIndex[lastTokenId] = tokenIndex;

      delete _idToAssetTokenIndex[tokenId];
      _allAssetTokens.pop();
    }
    else if (to != from) { //mint or transfer
      // add token to specfic owner enumeration
      uint length = balanceOf(to);
      _ownedAssetTokens[to][length] = tokenId;
      _idToOwnedAssetTokenIndex[tokenId] = length;
    }
  }

  function getAsset(uint tokenId) external view returns (Asset memory) {
    return _idToAsset[tokenId];
  }

  function listedItemsCount() external view returns (uint) {
    return _listedItems.current();
  }

  function totalSupply() public view returns (uint) {
    return _allAssetTokens.length;
  }

  

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _allAssetTokens[index];
  }

  function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
    require(index < balanceOf(owner), "Index out of bounds");
    return _ownedAssetTokens[owner][index];
  }

  //To  fix if not listed then returning empty lists
  function getAllAssetsOnSale() public view returns (Asset[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    Asset[] memory items = new Asset[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      Asset storage item = _idToAsset[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }
    return items;
  }

  function getOwnedNfts() public view returns (Asset[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    Asset[] memory items = new Asset[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
      Asset storage item = _idToAsset[tokenId];
      items[i] = item;
    }

    return items;
  }

  function buyNft(
    uint tokenId
  ) public payable {
    uint price = _idToAsset[tokenId].price;
    //address owner = IERC721(assetContract).ownerOf(tokenId);
    address owner = ownerOf(tokenId);
    require(msg.sender != _idToAsset[tokenId].creator, "You already own this NFT");
    require(msg.value == price, "Please submit the asking price");

    _idToAsset[tokenId].isListed = false;
     _listedItems.decrement();

    _transfer(owner, msg.sender, tokenId);
    payable(owner).transfer(msg.value);
    emit AssetRegistered(tokenId, msg.sender, true);
  }

    function placeNftOnSale(uint tokenId, uint newPrice) public payable {

    require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
    
    require(_idToAsset[tokenId].isListed == false, "Item is already on sale");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _idToAsset[tokenId].isListed = true;
    _idToAsset[tokenId].price = newPrice;
    _listedItems.increment();
  }


}