import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Dapp.json";
document.write('<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>')
const App = {
    web3: null,
    account: null,
    meta: null,
    delta: null,
    epsilon: null,
    userKind: null,
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
        const DomendBidsTime = document.getElementById("remainingOriBidTime0");

        const {remainingTranTime} = this.meta.methods;
        const RemainTranTime = await remainingTranTime().call();
        const DomTransTime = document.getElementById("remainingOriBidTime1");

        const {getUsersNumber} = this.meta.methods;
        const numberOfUsers = await getUsersNumber().call();
        const DomCurrentInf = document.getElementById("currentInf");

        const rawBids = document.getElementById("raw");
        rawBids.innerHTML = this.getRaw()["raw"];
        DomCurrentInf.innerHTML = "截止目前有"+ numberOfUsers +"个用户参与了初始出价。";
        let seconds = RemainingBidsOriTime;
        let transSeconds = RemainTranTime;
        //2.声明定时器
        let timer = null;
        //3.开启定时器
        timer = setInterval(show,1000);
        //开启定时器后要执行的函数
        async function show(){
            if(transSeconds==0){
                clearInterval(timer);//清除定时器
                // const {getSDsNumber} = this.meta.methods;
                // const {getSPsNumber} = this.meta.methods;
                // let NumberOfSDs = getSDsNumber().call();
                // let NumberOfSps = await;
                const {getUsersNumber} = this.meta.methods;
                const numberOfUsers = await getUsersNumber().call();
                const DomCurrentInf = document.getElementById("currentInf");

                const {Delta} =  this.meta.methods;
                const {Epsilon} = this.meta.methods;
                const delta = await Delta().call();
                this.delta = delta;
                const epsilon = await Epsilon().call();
                this.epsilon = epsilon
                    DomCurrentInf.innerHTML = "初始出价阶段有"+ numberOfUsers +"个用户参与了出价，混淆函数 Epsilon="+epsilon+",Distance="+delta+"。";

                // DomCurrentInf.removeAttribute("hidden");
                //window.location.href = "realBids.html";//跳转到百度首页
                return;
            }
            // //将不断变化的秒数显示在页面上
            // DomendBidsTime.innerHTML = seconds;

            DomendBidsTime.innerHTML = seconds;
            DomTransTime.innerHTML = transSeconds;
            if (seconds<=1){
                seconds = 0;
            }else {
                seconds--;
            }
            if (transSeconds<=1){
                transSeconds = 0;
            }else {
                transSeconds--;
            }
            // DomTransTime1.innerHTML = transSeconds;
            //
        }
    },
    giveOxfordBids: async function(){

    },
    setStatus: function(message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },
    /**
     * [通过参数名获取url中的参数值]
     * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
     * @param  {[string]} queryName [参数名]
     * @return {[string]}           [参数值]
     */
    /**
     * [通过参数名获取url中的参数值]
     * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
     * @param  {[string]} queryName [参数名]
     * @return {[string]}           [参数值]
     */
    /**
     * [获取URL中的参数名及参数值的集合]
     * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
     * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
     * @return {[string]}       [参数集合]
     */
    getRaw: function (urlStr) {
    if (typeof urlStr == "undefined") {
        var url = decodeURI(location.search); //获取url中"?"符后的字符串
    } else {
        var url = "?" + urlStr.split("?")[1];
    }
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
    },

    //带入原始数据，调用函数得到加密后的出家，以string格式返回
    obtainOxfordBids: function () {
        //let queryVal=this.getRaw();
        $.ajax({
            type: "get",
            url: "http://localhost:8001/hello/?raw="+this.getRaw()["raw"]+"&epsilon="+this.epsilon+"&delta="+this.delta,
            dataType: "jsonp",
            contentType: "application/jsonp;charset=utf-8",
            jsonp:"callback",
            async: false,
            success: async function (data) {
                const show = document.getElementById("status");
                if (data.success) {
                    let arr = [];
                    let list = data.split(",");
                    // deMyarr存放解密后的数组
                    for (let i = 0; i < 5; i++) {
                        arr[i] = parseInt(list[i]);
                    }
                    if (App.userKind == 0){
                        const {reSells} = this.meta.methods;
                        await reSells(arr).send({from: this.account});
                    }else{
                        const {reBids} = this.meta.methods;
                        await reBids(arr).send({from: this.account});
                    }

                } else {
                    show.innerText = "出现错误：" + data.msg;
                }


            },
            error:function (jqXHR) {
                alert("发生错误:"+jqXHR.status );
            }
        });
        //使用ajax与本地python搭建的后台通讯，得到加密后的出价信息（字符串形式）
        //用户将出价信息发送到区块链
    }
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
