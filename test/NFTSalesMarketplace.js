const RastrSalesMarketplace = artifacts.require("RastrSalesMarketplace");
const { ethers } = require("ethers");

contract("RastrSalesMarketplace", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();
  let  assetContract = "0x1";

  before(async () => {
    _contract = await RastrSalesMarketplace.deployed();
  })

  describe("List an Nft for Sale", () => {
    before(async () => {
      await _contract.placeNftOnSale(
        1,
        _nftPrice, { from: accounts[1], value: _listingPrice}
      )
    })

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();

      assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
    })

    it("should set new listing price", async () => {
      await _contract
        .setListingPrice(_listingPrice, {from: accounts[0]});
      const listingPrice = await _contract.listingPrice();

      assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
    })

  })
 
  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(assetContract,1, {
        from: accounts[1],
        value: _nftPrice
      })
    })

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    })

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
    })

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Item is still listed");
    })
  })
})
