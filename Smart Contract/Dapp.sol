pragma solidity ^0.5.16;
contract Dapp{
   uint time;
   uint endBidsTime;
   uint endTime;
    address public chairperson;
    uint public NumberOfUsers = 0;
    uint public NumberOfSDs;
    uint public NumberOfSPs;
    uint public NumberOfSlots = 5;
    uint public Epsilon;
    uint public Delta;
    bool flag = false;
    uint public voteNum;
    uint public clearPrice;
    constructor (uint32 i) public{
        chairperson = msg.sender;
        // NumberOfSlots = NumOfSlots;
        //NumberOfSPs = NumOfSPs;
        Epsilon = i;
        time = now;
        endBidsTime = time + 100000 seconds;
        endTime = time + 200000 seconds;
    }
    mapping(address=>uint256[5]) public Biders;
    mapping(address=>uint256[5]) public Sellers;
    mapping(address=>uint256) voteCount;
    mapping(address=>string) public publicDecrpt;
    mapping(address=>uint256[5]) public reBiders;
    mapping(address=>uint256[5]) public reSellers;
    mapping(address=>address[5]) public winners;
    mapping(address=>address) public SDWinners;
    mapping(address=>uint[5]) public winnerPrice;
    mapping(address=>uint) public users;
    mapping(uint=>address) public AddressOfUsers;
    mapping(uint=>address) public addressOfSDs;
    mapping(uint=>address) public addressOfSPs;
    mapping(address=>uint256[5]) public allBids;
    mapping(address=>uint) public allMoney;
    mapping(address=>uint) public SPWinners;
    function SDsgiveRealBid(uint256[5] memory originBid) public payable{
        NumberOfSDs = NumberOfSDs + 1;
       // NumberOfUsers = NumberOfUsers + 1;
        Biders[msg.sender] = originBid;
       // users[msg.sender] = NumberOfUsers;
        //AddressOfUsers[NumberOfUsers] = msg.sender;
        //allBids[msg.sender] = originBid;
        //voteCount[msg.sender] = 1;
    }
    function SPsgiveRealBid(uint256[5] memory realBid) public payable{
        NumberOfSPs = NumberOfSPs + 1;
        //NumberOfUsers = NumberOfUsers + 1;
        Sellers[msg.sender] = realBid;
        //users[msg.sender] = NumberOfUsers;
        //AddressOfUsers[NumberOfUsers] = msg.sender;
        //allBids[msg.sender] = originBid;
        //voteCount[msg.sender] = 1;
        allMoney[msg.sender] = msg.value;
    }
    function giveOringinBid(uint256[5] memory originBid) public{
        NumberOfUsers = NumberOfUsers + 1;
        //Sellers[msg.sender] = originBid;
        users[msg.sender] = NumberOfUsers;
        AddressOfUsers[NumberOfUsers] = msg.sender;
        allBids[msg.sender] = originBid;
        voteCount[msg.sender] = 1;
    }
    function giveEncryptBids(string memory deOriginBid) public{
        NumberOfUsers = NumberOfUsers + 1;
        //Sellers[msg.sender] = originBid;
        users[msg.sender] = NumberOfUsers;
        AddressOfUsers[NumberOfUsers] = msg.sender;
        voteCount[msg.sender] = 1;
        publicDecrpt[msg.sender] = deOriginBid;
    }
    function getEncryptBidsById(uint id) public view returns (string memory){
        return publicDecrpt[AddressOfUsers[id]];
    }
   function setLaplacePara(uint epsilon,uint delta) public{
       require(msg.sender==chairperson);
       Epsilon = epsilon;
       Delta = delta;
   }
//   function getParaOfLap() view public returns (uint){
//       //require(flag == true);
//       return Delta;
//   }
    function getSPsNumber() view public returns(uint){
        return NumberOfSPs;
    }
    function getSDsNumber() view public returns(uint){
        return NumberOfSDs;
    }
    function getUsersNumber() view public returns(uint){
        return NumberOfUsers;
    }
    // function execCalDelta() public{
    //     require(now > endBidsTime&&msg.sender == chairperson);
    //     caculateDelta();
    // }
    function reBids(uint[5] memory SDRebids) public{
        reBiders[msg.sender] = SDRebids;
    }
    function reSells(uint[5] memory SPRebids) public{
        reSellers[msg.sender] = SPRebids;
    }
    function setWinnerMap(address seller,address[5] memory buyers,uint[5] memory price) public{
        require(msg.sender==chairperson);
        winners[seller] = buyers;
        winnerPrice[seller] = price;
        SPWinners[seller] = 1;
    }
    function setClearPrice(uint clearP)public{
        clearPrice = clearP;
    }
    function vote()public{
        require(users[msg.sender]!=0&&voteCount[msg.sender]==1);
        voteNum = voteNum + 1;
        voteCount[msg.sender] = 0;
    }
    function canTrans() internal view returns (bool){
        if(voteNum>=NumberOfUsers/2){
            return true;
        }else{
            return false;
        }
    }
    function getReSDsBisById(uint id) view public returns (uint[5] memory){
        uint[5] memory res;
        res = reBiders[addressOfSDs[id]];
        return res;
    }
    function getReSPsBisById(uint id) view public returns (uint[5] memory){
        uint[5] memory res;
        res = reSellers[addressOfSPs[id]];
        return res;
    }
    function SDrefund()public{
        require(canTrans());
        //require(now )
        if(SDWinners[msg.sender]!=address(0)){
            msg.sender.transfer(allMoney[msg.sender]-clearPrice);
        }else{
            msg.sender.transfer(allMoney[msg.sender]);
        }
        
    }
    function SPrefund()public{
        require(canTrans());
       require(SPWinners[msg.sender]!=0);
       msg.sender.transfer(clearPrice);
    }
    function remainingOriBidTime() public view returns (uint){
        return endBidsTime-now;
    }
    function remainingTranTime() public view returns (uint){
        return endTime - now;
    }
    
}


