// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RastrSalesMarketplace is Ownable {
  using Counters for Counters.Counter;

  struct NftItem {
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
  }

  event NftItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() {}

 function placeNftOnSale(
  address assetContract, 
  uint tokenId, 
  uint newPrice
  ) public payable {
    require(IERC721(assetContract).ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
    //require(_idToNftItem[tokenId].isListed == false, "Item is already on sale");
    //require(msg.value == listingPrice, "Price must be equal to listing price");

    //_idToNftItem[tokenId].isListed = true;
    //_idToNftItem[tokenId].price = newPrice;
    //_listedItems.increment();
  }

  function buyNft(
    address assetContract, 
    uint tokenId
  ) public payable {
    //uint price = _idToNftItem[tokenId].price;
    address owner = IERC721(assetContract).ownerOf(tokenId);

    require(msg.sender != owner, "You already own this NFT");
    //require(msg.value == price, "Please submit the asking price");

    //_idToNftItem[tokenId].isListed = false;
    //_listedItems.decrement();

    //_transfer(owner, msg.sender, tokenId);
    //payable(owner).transfer(msg.value);
    //emit NftItemCreated(tokenId, price, msg.sender, true);
  }

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    //listingPrice = newPrice;
  }

  

}