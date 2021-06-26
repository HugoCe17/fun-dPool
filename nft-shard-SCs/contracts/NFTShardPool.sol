pragma solidity ^0.7.0;


import "@openzeppelin/contracts/math/SafeMath.sol";
import "./NFTShardERC721.sol";
import "./NFTShardERC20.sol";

contract NFTShardPool {
    
    using SafeMath for uint256;

    enum PoolStatus {active, claim, inactive}

    struct PoolDetails {
        uint256 id;
        string nftURI;
        uint256 totalPrice;
        uint256 deadline;
        uint256 totalShards;
        uint256 startTime;
        uint256 pricePerShard;
        uint256 soldShards;
        address payable owner;
        PoolStatus status;
        address ERC20Token;
    }

    NFTShardERC721 tokenERC721;

    PoolDetails public pool;

    mapping(address => uint256) buyers;

    modifier onlyOwner() {
        require(msg.sender == pool.owner, "Pool owner can only do this");
        _;
    }

    constructor(
        uint256 _id, 
        string memory _uri, 
        uint256 _totalPrice, 
        uint256 _deadline, 
        uint256 _totalShards, 
        address payable _owner, 
        address _tokenERC721) public 
    {
        pool.id = _id;
        pool.nftURI = _uri;
        pool.totalPrice = _totalPrice;
        pool.deadline = _deadline;
        pool.totalShards = _totalShards;
        pool.startTime = block.timestamp;
        pool.pricePerShard = (_totalShards.div(_totalShards));
        pool.soldShards = 0;
        pool.status = PoolStatus.active;
        pool.owner = _owner;
        pool.ERC20Token = address(new NFTShardERC20("Dummy tokens", "DUMMY"));
        tokenERC721 = NFTShardERC721(_tokenERC721);
        // now minting dummy tokens -- later to be replced by NFTFY returned ERC20 tokens
        NFTShardERC20(pool.ERC20Token).mint(address(this), 1000000000000000000000000);
    }

    function buyShards(uint256 noOfShards) public payable returns(uint) {
        require(noOfShards > 0 , "Not allowed to borrow 0 shard");
        require(pool.status == PoolStatus.active, "Pool is not active anymore");
        require(block.timestamp <= pool.startTime.add(pool.deadline), "Deadline is over");
        require(msg.value >= noOfShards.mul(pool.pricePerShard), "Not enough ETH");
        require(pool.totalShards.sub(pool.soldShards) >= noOfShards, "Not enough shards left to buy");
        buyers[msg.sender] = noOfShards;
        pool.soldShards = (pool.soldShards).add(noOfShards);
        // deposit to aave
        return noOfShards;
    }

    function mintNFTandShard() public onlyOwner returns(address){
        require(block.timestamp >= pool.startTime.add(pool.deadline), "Deadline not over" );
        require(pool.status == PoolStatus.active, "Pool must be active");

        if(pool.soldShards == pool.totalShards) {
            // mint ERC721
            tokenERC721.mint(pool.nftURI);
            // shard it & get the ERC20Token address
            // withdraw from Aave + interest
            // set status as claim
            pool.status = PoolStatus.claim;
            // transfer the fixed amount to owner
            pool.owner.transfer(address(this).balance);
            return pool.ERC20Token;
        }

        // withdraw from Aave + interest
        // set status as inactive
        pool.status = PoolStatus.inactive;
        return address(0);
    }

    function withdrawETH() public {
        require(block.timestamp >= pool.startTime.add(pool.deadline), "Deadline not over");
        require(pool.status == PoolStatus.inactive, "Pool must be inactive");
        require(buyers[msg.sender] > 0, "No shards bought");
        // add profit to it once aave/compound is there
        msg.sender.transfer(buyers[msg.sender].mul(pool.pricePerShard));
    }

    function claimShards() public {
        require(block.timestamp >= pool.startTime.add(pool.deadline), "Deadline not over");
        require(pool.status == PoolStatus.claim, "Pool must be claim");
        require(buyers[msg.sender] > 0, "No shards bought");
        require(pool.ERC20Token != address(0), "NFT not been sharded yet");
        NFTShardERC20(pool.ERC20Token).transfer(msg.sender, buyers[msg.sender].mul(10**18));        
    }

    function closePool() public onlyOwner returns(bool) {
        // some logic
        return true;
    }

}
