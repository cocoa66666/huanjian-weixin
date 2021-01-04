if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../pages/swiperDot/swiperDot?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/swiperDot/swiperDot2?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/forget/forget?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/index/index?hash=d4c7e325b640bd47ee64cec4896604dea2e7c409');
require('../../pages/version/version?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/recharge/recharge?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/power/power?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/charging/charging?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/powerDetail/powerDetail?hash=0d198faca3f459b5bd4b3720f2eef3ebe1e5035c');
require('../../pages/selectDetail/selectDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/aboutUs/aboutUs?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/mine/mine?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/notLogin/notLogin?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/navi/navi?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/myWalletDetail/myWalletDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/myWallet/myWallet?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}