import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Dapp.json";

document.write('<script type="text/javascript" src="https://passport.cnblogs.com/scripts/jsencrypt.min.js"></script>');

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
        const DomendBidsTime = document.getElementById("remainingOriBidTime0");

        const {remainingTranTime} = this.meta.methods;
        const RemainTranTime = await remainingTranTime().call();
        const DomTransTime = document.getElementById("remainingOriBidTime1");

        let seconds = RemainingBidsOriTime;
        let transSeconds = RemainTranTime;
        //2.声明定时器
        let timer = null;
        //3.开启定时器
        timer = setInterval(show,1000);
        //开启定时器后要执行的函数
        async function show(){
            if(seconds===0){
               this.decryptBids();
            }
            if(transSeconds===0){
                clearInterval(timer);//清除定时器
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
    //TODO
    // 引入IPFS 存储解密后的信息（数值及对应的加密值）以及laplace混淆函数,LAGs在本地进行解密以及计算混淆函数。
    decryptBids: async function() {
        const PRIVATE_KEY = "MIIBVwIBADANBgkqhkiG9w0BAQEFAASCAUEwggE9AgEAAkEAxuKIkltwgaGTOAot6YK0dqYk80Dvq67p446VPGm/mSsUVKVioNZiQfaGCF0dcbb0hgp/TV4DxR2ikJWx5cidewIDAQABAkEAo8OsyTbZ8SPmYWKgY4LorjooetShhTDGDkY9xD0fMzK85cLgzxxCsajXJejULNr65DpFXGQ96sGh7rus/UVEgQIhAPVpN5Pq9oL+Lj8/c7Od2JDqSRwpAYt42/UL0U/JBhqrAiEAz3dk5U0MUsxVQvBOJSC+ME1XuTjFeFJUtQMjF4PEiHECIQDavekTCFink8ZHC9imXeh96sY1unstBRIRjnIICqdNNwIhALCNzpNEymP79+MLVbVK9A9vAmRh58rJZcTVcpukSzBBAiEAkqbqo1RGs2mV6rNQjPOvhWKn3ojl/OMEmwhOWVcdN74=";
        //首先得到参与第一轮出价的用户总数
        const {getEncryptBidsById} = this.meta.methods;
        const {setLaplacePara} = this.meta.methods;
        const {getUsersNumber} = this.meta.methods;
        const userNumber = await getUsersNumber().call();
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + PRIVATE_KEY + '-----END RSA PRIVATE KEY-----');

        const myarr = [];//解密前字符串一维数组
        let deMyarr = [];//解密后二维数组

        for (let k = 1; k <= userNumber; k++) {
            //解密前的一维数组
            myarr[k - 1] = await getEncryptBidsById(k).call();
            deMyarr[k - 1] = [];
            //解密
            let data = decrypt.decrypt(myarr[k - 1]);
            let list = data.split(",");
            // deMyarr存放解密后的数组
            for (let i = 0;i < 5;i++){
                deMyarr[k - 1][i] = parseInt(list[i]);
            }
            // list.forEach(item => {
            //     let temp = parseInt(item);
            //     deMyarr[k - 1][];
            // });
        }
        //计算
        let min = 0;
        let max = 0;
        let value = 0;
        for (let i = 1; i <= userNumber; i++) {
            min = 100000000000000000;
            max = 0;
            for (let j = 0; j < 5; j++) {
                value = deMyarr[i-1][j];
                if (value > max) {
                    max = value;
                }
                if (value < min) {
                    min = value;
                }
            }
        }
        const Epsilon = 1;
        const Delta = max - min;
        await setLaplacePara(Epsilon,Delta).send({from:this.account});
        const DomDelta = document.getElementById("calcu");
        DomDelta.innerHTML = "混淆函数参数：Epsilon="+Epsilon+",Delta="+Delta+"。";
    },

};

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
