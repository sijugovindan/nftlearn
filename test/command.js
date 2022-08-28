const instance = await NftMarket.deployed();

instance.mintToken(
    "https://gateway.pinata.cloud/ipfs/QmbxywzVWctAgxwegzuuoskekjGqfKo33iJd1oFxhRrXox",
    //"500000000000000000", 
    {value: "25000000000000000",from: accounts[0]}
)
instance.mintToken(
    "https://gateway.pinata.cloud/ipfs/QmcDtHBj9CY3iFHiUBjhG44TzghDZox8egwpiosifkA9bV",
    //"300000000000000000", 
    {value: "25000000000000000",from: accounts[0]}
)
