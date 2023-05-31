import * as moment from "moment";

let siteName = "peach";
var from = new Date();
var date = moment(from).format('ZZ');
let hostname = window.origin;


export const environment = {
  production: true,
  siteName: 'peachAdmin',
  // xpgPay:false,
  // baseUrl: 'http://51.195.220.62:81', // Test
  baseUrl: 'http://136.244.79.114:81', // prod
  apisUrl: 'https://access.streamingtv.fun:3445/api/all_apis',
  BDapisUrl: 'https://api2.streamingtv.fun:3440/api/all_apis',
  // baseUrl: 'https://exchangegames.xyz/pad=81', // prod
  tvUrl: "https://tvlivestreaming.online/live_tv0test/index.html",
  currency: '', //for currency
  timeFormat:date,   // changing time format
  showCurrency:true,   // for dissplaying currency
  isProduction:false,   //for false for devip and true for adminIP
  scoreUrl: 'http://streamingtv.fun:3030/score_api',
  iframeTVScoreurl:"https://555555.services",
  oddsSocketUrl: 'ws://209.250.242.175',
  origin:'skyexch.live',
  captcha:true,
  oldAdmin: false, //for horizontal view for risk management
  whatsapp : "",
  whatsapp1 : "",
  skype:"",
  insta:"",
  telegram:"skyinplay365official",
  telegram1:"skyinplay365official",
  mail:"",
  fb:"",
  web:"",
  transferdelay:true,
  settlemettab:true,
  loader:true,
  manual:true,
  userMultiplier: 0,
  socialmediasection:false,
  internationalCasino:true,
  isAWCcasino:true,
  isFirstTimePassword:false,
  isSupernova:true,
  isSlot:true,
  isPoker:true,
  isSkyFancy:false,// for sky fancy admin in risk management
  isSharing:false,  
  isbetgame:true,
  islanguage:true,
  isB2C:true,
  isBajilogin:false, // true for Baji login Page

  isPremiumSite:true, //for Premium sites with Risk management and LC hierarchy also used this flag with BD hierarchy and Normal old Hirarchy
  isBdlevel:false, // for BD levels Hierarchy with premium flag and without premium flag
  isRental:false, // for Normal Vrnl old Hierarchy with premium flag and without premium flag

  domainMap:[
    { id: 0, name: 'cricbuzzer.io' },
  ]


};
