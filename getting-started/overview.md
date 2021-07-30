---
description: You're invited to the pool party
---

# Overview

## High Level 

At a high level, the Pool Party NFT lego consist of two Smart Contracts that you will need to interact with

* PoolFactory
* Pool

And two Rarible API Endpoints.

* [https://api-reference.rarible.com/\#operation/getSellOrdersByItem](https://api-reference.rarible.com/#operation/getSellOrdersByItem)
* [https://api-reference.rarible.com/\#operation/prepareTxForOrder](https://api-reference.rarible.com/#operation/prepareTxForOrder)

You start by making a request to Rarible to get the hash for the item you want to create a pool for and seperate request to prepare the transaction, this information is then used to create a pool using Pool Factory Smart Contract. When it's time to buy the NFT, the pool contract sends the data over to the rarible match assets function contract to make the purchase. The NFT is then sharded and ownership is distributed.

{% hint style="info" %}
The PoolFactory lives on-chain at CONTRACT_ADDRESS_\_HERE and the Pool contracts are created dynamicly whenever some opens up a Pool for a Rarible NFT.
{% endhint %}

### Pool Factory Contract

The pool factory contract is responsible for spinning up the Pools that will be used to buy specific rarible NFTs. It contains two methods,

* Create Pool
* List Pools

### Pool Contract

The Pool Contracts are created by the pool factory whenever someone creates a Pool to buy an NFT. Pools are tied 1 to 1 to a Rarible Auction. The pool allows users to make contributions and when the contributions match the selling price, the NFT is purchased and shards are distributed. The Pool contract contains the following methods made to be used by your dApp

* Contribute
* Buy
* Close Pool
* Get Buyers Count
* Withdraw

### Rarible API Endpoints

Rarible provides us two important endpoints,

#### getSellOrdersByItem

One is used to query for a NFT contract and Token ID in order to check if the item is available in a fixed auction. 

* [https://api-reference.rarible.com/\#operation/getSellOrdersByItem](https://api-reference.rarible.com/#operation/getSellOrdersByItem)

The next is used to prepare the transaction that the Pool Smart contract will use to make the purchase.

* [https://api-reference.rarible.com/\#operation/prepareTxForOrder](https://api-reference.rarible.com/#operation/prepareTxForOrder)





