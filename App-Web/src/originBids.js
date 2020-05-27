import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Dapp.json";

document.write('<script type="text/javascript" src="https://passport.cnblogs.com/scripts/jsencrypt.min.js"></script>')
const App = {
  web3: null,
  account: null,
  meta: null,
  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.renderForSDs();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
      renderForSDs: async function() {
        const {remainingOriBidTime} = this.meta.methods;
        const RemainingBidsOriTime = await remainingOriBidTime().call();
        const DomendBidsTime = document.getElementsByClassName("remainingOriBidTime")[0];

        const {remainingTranTime} = this.meta.methods;
        const RemainTranTime = await remainingTranTime().call();
        const DomTransTime = document.getElementById("remainingOriBidTime");
        //const DomTransTime1 = document.getElementById("remainingOriBidTime1");
       // const DomCurrentInf = document.getElementById("currentInf")
          var seconds = RemainingBidsOriTime;
          var transSeconds = RemainTranTime;
          //2.声明定时器
          var timer = null;
          //3.开启定时器
          timer = setInterval(show,1000);
          //开启定时器后要执行的函数
          function show(){
              if(transSeconds==0){
                   clearInterval(timer);//清除定时器
                  // const {getSDsNumber} = this.meta.methods;
                  // const {getSPsNumber} = this.meta.methods;
                  // let NumberOfSDs = getSDsNumber().call();
                  // let NumberOfSps = await;
                  // DomCurrentInf.innerHTML = "有"++"个SPs和"++"个SDs参与了拍卖。混淆函数为：Epsilon="++",Distance="++".";
                  // DomCurrentInf.removeAttribute("hidden");
                  //window.location.href = "realBids.html";//跳转到百度首页
                  return;
              }
              //将不断变化的秒数显示在页面上
              DomendBidsTime.innerHTML = seconds;
              if (seconds<=1){
                  seconds = 0;
              }else {
                  seconds--;
              }
              DomTransTime.innerHTML = transSeconds;
             // DomTransTime1.innerHTML = transSeconds;
              transSeconds--;
              //
          }
      },
  // refreshBalance: async function() {
  //   const { getBalance } = this.meta.methods;
  //   const balance = await getBalance(this.account).call();
  //
  //   const balanceElement = document.getElementsByClassName("balance")[0];
  //   balanceElement.innerHTML = balance;
  // },
  //
    sendCoin: async function() {
        const amount = document.getElementById("SDbids").value;
        //获取LAGs的公钥
        // const {chairperson} = this.meta.methods;
        // const PublicKeyOfLags = await chairperson.call();
        // const encode = encodeURI(PublicKeyOfLags);
        // // 对编码的字符串转化base64
        // const base64 = btoa(encode);
        const encrypt = new JSEncrypt();
        const PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMbiiJJbcIGhkzgKLemCtHamJPNA76uu" +
            "6eOOlTxpv5krFFSlYqDWYkH2hghdHXG29IYKf01eA8UdopCVseXInXsCAwEAAQ==";
        encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----" + PUBLIC_KEY + "-----END PUBLIC KEY-----");
        const encryptData = encrypt.encrypt(amount);//加密后的字符串
        const {giveEncryptBids} = this.meta.methods;
        this.setStatus(encryptData);
        await giveEncryptBids(encryptData).send({from:this.account});

        // let data = amount;
        // let list = data.split(",");
        // let dataIntArr = [];//保存转换后的整型字符串
        // list.forEach(item => {
        //     let temp = parseInt(item);
        //     dataIntArr.push(+temp);
        // });
        // const {giveOringinBid} = this.meta.methods;
        // let dataIntArr = [1,2,3,4,5];
        // this.setStatus("Initiating transaction... (please wait)");
        // await giveOringinBid(dataIntArr).send({from: this.account});
        // this.setStatus("Transaction complete,encrypted bid information has been sent!");
        // await giveOringinBid(dataIntArr).send({from: this.account});


        this.setStatus("Transaction complete,encrypted bid information has been sent!");
        //const {remainingTranTime} = this.meta.methods;
        //const RemainTranTime = await remainingTranTime().call();
        let str = "realBids.html"+"?raw=" + encryptData;
        window.location.href = str;//跳转到百度首页
        // const DomTransTime = window.document.getElementById("remainingTransTime");
        // DomTransTime.innerHTML = "111";
        //this.realBidsRender();


  //      this.refreshBalance();
    },
  // sendCoin: async function() {
  //   const amount = parseInt(document.getElementById("amount").value);
  //   const receiver = document.getElementById("receiver").value;
  //
  //   this.setStatus("Initiating transaction... (please wait)");
  //
  //   const { sendCoin } = this.meta.methods;
  //   await sendCoin(receiver, amount).send({ from: this.account });
  //
  //   this.setStatus("Transaction complete!");
  //   this.refreshBalance();
  // },
  //
  // realBidsRender: async function() {
  //     const {remainingTranTime} = this.meta.methods;
  //     const RemainTranTime = await remainingTranTime().call();
  //     const DomTransTime = document.getElementById("remainingTransTime");
  //     // let transSeconds = RemainTranTime;
  //     //2.声明定时器
  //     // let timer = null;
  //     // //3.开启定时器
  //     // timer = setInterval(show,1000);
  //     // //开启定时器后要执行的函数
  //     // function show() {
  //     //     if (transSeconds == 0) {
  //     //         clearInterval(timer);//清除定时器
  //     //         // const {getSDsNumber} = this.meta.methods;
  //     //         // const {getSPsNumber} = this.meta.methods;
  //     //         // let NumberOfSDs = getSDsNumber().call();
  //     //         // let NumberOfSps = await;
  //     //         // DomCurrentInf.innerHTML = "有"++"个SPs和"++"个SDs参与了拍卖。混淆函数为：Epsilon="++",Distance="++".";
  //     //         // DomCurrentInf.removeAttribute("hidden");
  //     //         window.location.href = "wwww.baidu.com";//跳转到百度首页
  //     //         return;
  //     //     }
  //     DomTransTime.innerHTML = "111";
  //     //将不断变化的秒数显示在页面上
  //     // if (transSeconds <= 1) {
  //     //     transSeconds = 0;
  //     // } else {
  //     //     transSeconds--;
  //     // }
  //
  // // }
  // },
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};
// renderRebids:async function(){
//     const { web3 } = this;
// }
window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
