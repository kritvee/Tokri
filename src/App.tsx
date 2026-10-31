import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { supabase } from "./supabase/client";

type Language = 'en' | 'hi' | 'mr'
type Theme = 'light' | 'dark'
type Tab = 'live' | 'billing' | 'stock' | 'baskets' | 'settings'
type Screen =
  | 'splash'
  | 'intro'
  | 'language'
  | 'login'
  | 'otp'
  | 'setup'
  | 'main'
  | 'detail'
  | 'summary'
  | 'receipt'
  | 'pair'
  | 'prices'
  | 'languages'
  | 'profile'
type IconName =
  | 'basket'
  | 'bill'
  | 'chart'
  | 'layers'
  | 'settings'
  | 'mic'
  | 'sparkle'
  | 'back'
  | 'help'
  | 'wifi'
  | 'battery'
  | 'chevron'
  | 'check'
  | 'close'
  | 'speaker'
  | 'share'
  | 'search'
  | 'sun'
  | 'moon'
  | 'plus'
  | 'shop'
  | 'language'
  | 'price'
  | 'trash'

const copy = {
  en: {
    splashTagline: 'Smart baskets. Faster billing.',
    introOneTitle: 'The basket does the weighing',
    introOneBody: 'Add vegetables normally. The camera identifies them and the scale records the weight.',
    introTwoTitle: 'Your bill is ready instantly',
    introTwoBody: 'See every coloured basket live. Check the items, choose payment and finish the bill.',
    introThreeTitle: 'Just ask for help',
    introThreeBody: 'Use your voice to change prices, understand sales or learn any part of the app.',
    next: 'Next',
    getStarted: 'Get started',
    introSkip: 'Skip introduction',
    chooseLanguage: 'Choose your language',
    languageHint: 'You can change this later.',
    otherLanguages: 'Others +',
    moreLanguagesSoon: 'More languages are coming soon.',
    continue: 'Continue',
    welcome: 'Welcome to Sabzi Basket',
    welcomeHint: 'Enter your phone number to set up your shop.',
    phone: 'Phone number',
    sendOtp: 'Send OTP',
    otpTitle: 'Enter the 4-digit code',
    otpHint: 'Sent to +91 98765 43210',
    otp: 'OTP code',
    confirm: 'Confirm',
    setupTitle: 'Set today’s prices',
    setupHint: 'You can change these any time.',
    skip: 'Do later',
    start: 'Start selling',
    perKg: 'per kg',
    live: 'Live Baskets',
    billing: 'Billing',
    stock: 'Stock',
    baskets: 'Baskets',
    settings: 'Settings',
    connected: '6 baskets connected',
    today: 'Today',
    waiting: 'Waiting',
    active: 'Active',
    ready: 'Ready to bill',
    items: 'items',
    emptyTitle: 'No baskets in use.',
    emptyHint: 'New items will appear here.',
    noItems: 'No vegetables yet',
    basket: 'basket',
    runningTotal: 'Running total',
    newItem: 'Tomato added. 1.5 kg',
    unsure: 'Not sure about this one. Is it Tomato?',
    pickRight: 'Pick the right vegetable.',
    chooseOther: 'Choose other',
    remove: 'Remove',
    removed: 'Item removed.',
    undo: 'Undo',
    bill: 'Bill',
    billSummary: 'Bill Summary',
    payment: 'Choose payment',
    cash: 'Cash',
    upi: 'UPI',
    done: 'Done',
    receipt: 'Receipt',
    billSaved: 'Bill saved',
    share: 'Share receipt',
    backHome: 'Back to baskets',
    pastBills: 'Past Bills',
    noBills: 'No past bills yet.',
    noBillsHint: 'Completed bills will appear here.',
    dailySales: 'Daily Sales',
    monthlyTrend: 'Monthly trend',
    runningLow: 'Running Low',
    left: 'left',
    vegetableTotals: 'Vegetable Totals',
    soldToday: 'sold today',
    manageBaskets: 'Manage Baskets',
    pairNew: 'Pair New Basket',
    online: 'Online',
    offline: 'Offline',
    reconnecting: 'Basket is offline. Reconnecting, your items are safe.',
    step: 'Step',
    switchOn: 'Switch on the basket',
    switchHint: 'Hold the power button until the light turns blue.',
    basketOn: 'Basket is on',
    chooseColour: 'Choose its colour',
    chooseColourHint: 'Pick the colour that matches the basket.',
    paired: 'Basket paired',
    pairedHint: 'Purple basket is ready to use.',
    priceSettings: 'Price per kg',
    language: 'Language',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    voiceReplies: 'Voice replies',
    shopProfile: 'Shop Profile',
    shopName: 'Shop name',
    ownerName: 'Owner name',
    save: 'Save',
    saved: 'Saved',
    ask: 'Ask',
    helperIntro: "I'm your helper. Ask me anything by voice.",
    gotIt: 'Got it',
    assistant: 'Sabzi Helper',
    askAnything: 'Ask anything',
    suggestions: 'Try asking',
    setTomato: 'Set tomato price to ₹40',
    billBlue: 'Bill the blue basket',
    showLow: 'Show what is running low',
    howPair: 'How do I pair a basket?',
    salesExplain: 'Explain today’s sales',
    whyGrey: 'Why is green basket grey?',
    listening: 'Listening',
    heard: 'I heard',
    sayAgain: 'Say again',
    notClear: "I didn't catch that. Please say it again.",
    thinking: 'One moment',
    answerSales: 'Onions sold the most today. 38 kg.',
    answerLow: 'Potatoes and capsicum are running low.',
    answerGrey: 'Green basket is waiting. It will light up when an item is added.',
    pairSteps: '1. Switch on the basket.\n2. Choose its colour.\n3. Tap Done.',
    showMe: 'Show me',
    confirmPrice: 'Set tomato to ₹40 per kg?',
    cancel: 'Cancel',
    priceDone: 'Tomato price is now ₹40 per kg.',
    cancelled: 'Nothing changed.',
    assistantOffline: 'Assistant is offline. Your app still works.',
    vegetableSearch: 'Search vegetable',
    heardPhone: '98765 43210',
    heardPrice: '40 rupees',
    heardShop: 'Mahalaxmi Fresh Vegetables',
    recognised: 'Recognised words',
    allGood: 'All systems ready',
    itemsCorrect: 'Items correct?',
    yesBill: 'Yes, bill now',
    correctItems: 'Review items',
    firstTime: 'First time?',
    recognition: 'Vegetable recognised?',
    search: 'Search',
    total: 'Total',
    paymentCash: 'Paid with Cash',
    paymentUpi: 'Paid with UPI',
  },
  hi: {
    splashTagline: 'स्मार्ट बास्केट। तेज़ बिलिंग।',
    introOneTitle: 'बास्केट खुद वज़न करती है',
    introOneBody: 'सब्ज़ी सामान्य तरीके से डालें। कैमरा उसे पहचानता है और तराज़ू वज़न दर्ज करता है।',
    introTwoTitle: 'आपका बिल तुरंत तैयार है',
    introTwoBody: 'हर रंग की बास्केट लाइव देखें। सामान जाँचें, भुगतान चुनें और बिल पूरा करें।',
    introThreeTitle: 'बस मदद माँगें',
    introThreeBody: 'भाव बदलने, बिक्री समझने या ऐप चलाना सीखने के लिए आवाज़ का उपयोग करें।',
    next: 'आगे',
    getStarted: 'शुरू करें',
    introSkip: 'परिचय छोड़ें',
    chooseLanguage: 'अपनी भाषा चुनें',
    languageHint: 'इसे बाद में बदल सकते हैं।',
    otherLanguages: 'अन्य +',
    moreLanguagesSoon: 'और भाषाएँ जल्द आ रही हैं।',
    continue: 'आगे बढ़ें',
    welcome: 'सब्ज़ी बास्केट में आपका स्वागत है',
    welcomeHint: 'अपनी दुकान सेट करने के लिए फ़ोन नंबर डालें।',
    phone: 'फ़ोन नंबर',
    sendOtp: 'OTP भेजें',
    otpTitle: '4 अंकों का कोड डालें',
    otpHint: '+91 98765 43210 पर भेजा गया',
    otp: 'OTP कोड',
    confirm: 'पुष्टि करें',
    setupTitle: 'आज के भाव तय करें',
    setupHint: 'इन्हें कभी भी बदल सकते हैं।',
    skip: 'बाद में करें',
    start: 'बिक्री शुरू करें',
    perKg: 'प्रति kg',
    live: 'लाइव बास्केट',
    billing: 'बिलिंग',
    stock: 'स्टॉक',
    baskets: 'बास्केट',
    settings: 'सेटिंग्स',
    connected: '6 बास्केट जुड़ी हैं',
    today: 'आज',
    waiting: 'इंतज़ार',
    active: 'चालू',
    ready: 'बिल के लिए तैयार',
    items: 'सामान',
    emptyTitle: 'कोई बास्केट उपयोग में नहीं है।',
    emptyHint: 'नया सामान यहाँ दिखेगा।',
    noItems: 'अभी कोई सब्ज़ी नहीं',
    basket: 'बास्केट',
    runningTotal: 'अभी तक कुल',
    newItem: 'टमाटर जुड़ा। 1.5 kg',
    unsure: 'यह पक्का नहीं है। क्या यह टमाटर है?',
    pickRight: 'सही सब्ज़ी चुनें।',
    chooseOther: 'दूसरी चुनें',
    remove: 'हटाएँ',
    removed: 'सामान हटा दिया।',
    undo: 'वापस लाएँ',
    bill: 'बिल बनाएँ',
    billSummary: 'बिल का सार',
    payment: 'भुगतान चुनें',
    cash: 'नकद',
    upi: 'UPI',
    done: 'पूरा हुआ',
    receipt: 'रसीद',
    billSaved: 'बिल सेव हो गया',
    share: 'रसीद भेजें',
    backHome: 'बास्केट पर जाएँ',
    pastBills: 'पुराने बिल',
    noBills: 'अभी कोई पुराना बिल नहीं है।',
    noBillsHint: 'पूरे हुए बिल यहाँ दिखेंगे।',
    dailySales: 'आज की बिक्री',
    monthlyTrend: 'मासिक रुझान',
    runningLow: 'कम बचा है',
    left: 'बाकी',
    vegetableTotals: 'सब्ज़ी का कुल',
    soldToday: 'आज बिका',
    manageBaskets: 'बास्केट संभालें',
    pairNew: 'नई बास्केट जोड़ें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    reconnecting: 'बास्केट ऑफ़लाइन है। फिर जुड़ रही है, आपका सामान सुरक्षित है।',
    step: 'कदम',
    switchOn: 'बास्केट चालू करें',
    switchHint: 'नीली बत्ती आने तक पावर बटन दबाएँ।',
    basketOn: 'बास्केट चालू है',
    chooseColour: 'इसका रंग चुनें',
    chooseColourHint: 'बास्केट से मिलता रंग चुनें।',
    paired: 'बास्केट जुड़ गई',
    pairedHint: 'बैंगनी बास्केट उपयोग के लिए तैयार है।',
    priceSettings: 'प्रति kg भाव',
    language: 'भाषा',
    appearance: 'रूप',
    light: 'लाइट',
    dark: 'डार्क',
    voiceReplies: 'आवाज़ में जवाब',
    shopProfile: 'दुकान की जानकारी',
    shopName: 'दुकान का नाम',
    ownerName: 'मालिक का नाम',
    save: 'सेव करें',
    saved: 'सेव हो गया',
    ask: 'पूछें',
    helperIntro: 'मैं आपका सहायक हूँ। आवाज़ से कुछ भी पूछें।',
    gotIt: 'समझ गया',
    assistant: 'सब्ज़ी सहायक',
    askAnything: 'कुछ भी पूछें',
    suggestions: 'यह पूछें',
    setTomato: 'टमाटर का भाव ₹40 करें',
    billBlue: 'नीली बास्केट का बिल बनाएँ',
    showLow: 'कम स्टॉक दिखाएँ',
    howPair: 'बास्केट कैसे जोड़ें?',
    salesExplain: 'आज की बिक्री समझाएँ',
    whyGrey: 'हरी बास्केट धुंधली क्यों है?',
    listening: 'सुन रहा हूँ',
    heard: 'मैंने सुना',
    sayAgain: 'फिर बोलें',
    notClear: 'मैं समझ नहीं पाया। कृपया फिर बोलें।',
    thinking: 'एक पल',
    answerSales: 'आज प्याज़ सबसे ज़्यादा बिका। 38 kg।',
    answerLow: 'आलू और शिमला मिर्च कम हैं।',
    answerGrey: 'हरी बास्केट इंतज़ार में है। सामान डालते ही यह चालू दिखेगी।',
    pairSteps: '1. बास्केट चालू करें।\n2. उसका रंग चुनें।\n3. पूरा हुआ दबाएँ।',
    showMe: 'दिखाएँ',
    confirmPrice: 'टमाटर ₹40 प्रति kg करें?',
    cancel: 'रद्द करें',
    priceDone: 'टमाटर का भाव अब ₹40 प्रति kg है।',
    cancelled: 'कुछ नहीं बदला।',
    assistantOffline: 'सहायक ऑफ़लाइन है। ऐप फिर भी काम कर रहा है।',
    vegetableSearch: 'सब्ज़ी खोजें',
    heardPhone: '98765 43210',
    heardPrice: '40 रुपये',
    heardShop: 'महालक्ष्मी ताज़ी सब्ज़ियाँ',
    recognised: 'सुने गए शब्द',
    allGood: 'सब कुछ तैयार है',
    itemsCorrect: 'सामान सही है?',
    yesBill: 'हाँ, बिल बनाएँ',
    correctItems: 'सामान देखें',
    firstTime: 'पहली बार?',
    recognition: 'सब्ज़ी पहचानी गई?',
    search: 'खोजें',
    total: 'कुल',
    paymentCash: 'नकद भुगतान',
    paymentUpi: 'UPI भुगतान',
  },
  mr: {
    splashTagline: 'स्मार्ट बास्केट. जलद बिलिंग.',
    introOneTitle: 'बास्केट स्वतः वजन करते',
    introOneBody: 'भाजी नेहमीप्रमाणे टाका. कॅमेरा ती ओळखतो आणि काटा वजन नोंदवतो.',
    introTwoTitle: 'तुमचे बिल लगेच तयार',
    introTwoBody: 'प्रत्येक रंगाची बास्केट लाइव्ह पाहा. वस्तू तपासा, पेमेंट निवडा आणि बिल पूर्ण करा.',
    introThreeTitle: 'फक्त मदत विचारा',
    introThreeBody: 'भाव बदलण्यासाठी, विक्री समजून घेण्यासाठी किंवा ॲप शिकण्यासाठी आवाज वापरा.',
    next: 'पुढे',
    getStarted: 'सुरू करा',
    introSkip: 'ओळख वगळा',
    chooseLanguage: 'तुमची भाषा निवडा',
    languageHint: 'हे नंतर बदलता येईल.',
    otherLanguages: 'इतर +',
    moreLanguagesSoon: 'आणखी भाषा लवकरच येत आहेत.',
    continue: 'पुढे जा',
    welcome: 'सब्जी बास्केटमध्ये स्वागत आहे',
    welcomeHint: 'दुकान सेट करण्यासाठी फोन नंबर टाका.',
    phone: 'फोन नंबर',
    sendOtp: 'OTP पाठवा',
    otpTitle: '4 अंकी कोड टाका',
    otpHint: '+91 98765 43210 वर पाठवला',
    otp: 'OTP कोड',
    confirm: 'खात्री करा',
    setupTitle: 'आजचे भाव ठरवा',
    setupHint: 'हे कधीही बदलता येतील.',
    skip: 'नंतर करा',
    start: 'विक्री सुरू करा',
    perKg: 'प्रति kg',
    live: 'लाइव्ह बास्केट',
    billing: 'बिलिंग',
    stock: 'साठा',
    baskets: 'बास्केट',
    settings: 'सेटिंग्ज',
    connected: '6 बास्केट जोडल्या आहेत',
    today: 'आज',
    waiting: 'वाट पाहत आहे',
    active: 'सुरू',
    ready: 'बिलासाठी तयार',
    items: 'वस्तू',
    emptyTitle: 'कोणतीही बास्केट वापरात नाही.',
    emptyHint: 'नवीन वस्तू येथे दिसतील.',
    noItems: 'अजून भाजी नाही',
    basket: 'बास्केट',
    runningTotal: 'आतापर्यंत एकूण',
    newItem: 'टोमॅटो जोडला. 1.5 kg',
    unsure: 'याची खात्री नाही. हा टोमॅटो आहे का?',
    pickRight: 'योग्य भाजी निवडा.',
    chooseOther: 'दुसरी निवडा',
    remove: 'काढा',
    removed: 'वस्तू काढली.',
    undo: 'परत आणा',
    bill: 'बिल करा',
    billSummary: 'बिलाचा सारांश',
    payment: 'पेमेंट निवडा',
    cash: 'रोख',
    upi: 'UPI',
    done: 'पूर्ण',
    receipt: 'पावती',
    billSaved: 'बिल सेव्ह झाले',
    share: 'पावती पाठवा',
    backHome: 'बास्केटवर जा',
    pastBills: 'मागील बिले',
    noBills: 'अजून मागील बिले नाहीत.',
    noBillsHint: 'पूर्ण झालेली बिले येथे दिसतील.',
    dailySales: 'आजची विक्री',
    monthlyTrend: 'मासिक कल',
    runningLow: 'साठा कमी',
    left: 'बाकी',
    vegetableTotals: 'भाज्यांची एकूण विक्री',
    soldToday: 'आज विकले',
    manageBaskets: 'बास्केट सांभाळा',
    pairNew: 'नवीन बास्केट जोडा',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    reconnecting: 'बास्केट ऑफलाइन आहे. पुन्हा जोडत आहोत, तुमच्या वस्तू सुरक्षित आहेत.',
    step: 'पायरी',
    switchOn: 'बास्केट सुरू करा',
    switchHint: 'निळा दिवा लागेपर्यंत पॉवर बटण दाबा.',
    basketOn: 'बास्केट सुरू आहे',
    chooseColour: 'तिचा रंग निवडा',
    chooseColourHint: 'बास्केटशी जुळणारा रंग निवडा.',
    paired: 'बास्केट जोडली',
    pairedHint: 'जांभळी बास्केट वापरण्यास तयार आहे.',
    priceSettings: 'प्रति kg भाव',
    language: 'भाषा',
    appearance: 'दिसणे',
    light: 'लाइट',
    dark: 'डार्क',
    voiceReplies: 'आवाजात उत्तरे',
    shopProfile: 'दुकानाची माहिती',
    shopName: 'दुकानाचे नाव',
    ownerName: 'मालकाचे नाव',
    save: 'सेव्ह करा',
    saved: 'सेव्ह झाले',
    ask: 'विचारा',
    helperIntro: 'मी तुमचा मदतनीस आहे. आवाजाने काहीही विचारा.',
    gotIt: 'समजले',
    assistant: 'सब्जी मदतनीस',
    askAnything: 'काहीही विचारा',
    suggestions: 'हे विचारून पहा',
    setTomato: 'टोमॅटोचा भाव ₹40 करा',
    billBlue: 'निळ्या बास्केटचे बिल करा',
    showLow: 'कमी साठा दाखवा',
    howPair: 'बास्केट कशी जोडायची?',
    salesExplain: 'आजची विक्री समजवा',
    whyGrey: 'हिरवी बास्केट फिकी का आहे?',
    listening: 'ऐकत आहे',
    heard: 'मी ऐकले',
    sayAgain: 'पुन्हा बोला',
    notClear: 'मला समजले नाही. कृपया पुन्हा बोला.',
    thinking: 'एक क्षण',
    answerSales: 'आज कांदा सर्वाधिक विकला. 38 kg.',
    answerLow: 'बटाटा आणि ढोबळी मिरचीचा साठा कमी आहे.',
    answerGrey: 'हिरवी बास्केट वाट पाहत आहे. वस्तू टाकल्यावर ती सुरू दिसेल.',
    pairSteps: '1. बास्केट सुरू करा.\n2. तिचा रंग निवडा.\n3. पूर्ण दाबा.',
    showMe: 'दाखवा',
    confirmPrice: 'टोमॅटो ₹40 प्रति kg करायचा?',
    cancel: 'रद्द करा',
    priceDone: 'टोमॅटोचा भाव आता ₹40 प्रति kg आहे.',
    cancelled: 'काहीही बदलले नाही.',
    assistantOffline: 'मदतनीस ऑफलाइन आहे. ॲप तरीही चालू आहे.',
    vegetableSearch: 'भाजी शोधा',
    heardPhone: '98765 43210',
    heardPrice: '40 रुपये',
    heardShop: 'महालक्ष्मी ताज्या भाज्या',
    recognised: 'ऐकलेले शब्द',
    allGood: 'सर्व यंत्रणा तयार',
    itemsCorrect: 'वस्तू बरोबर आहेत?',
    yesBill: 'हो, बिल करा',
    correctItems: 'वस्तू तपासा',
    firstTime: 'पहिली वेळ?',
    recognition: 'भाजी ओळखली?',
    search: 'शोधा',
    total: 'एकूण',
    paymentCash: 'रोख पेमेंट',
    paymentUpi: 'UPI पेमेंट',
  },
} as const

type CopyKey = keyof typeof copy.en

const vegetables = [
  { id: 'tomato', en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो', price: 40 },
  { id: 'onion', en: 'Onion', hi: 'प्याज़', mr: 'कांदा', price: 32 },
  { id: 'potato', en: 'Potato', hi: 'आलू', mr: 'बटाटा', price: 28 },
  { id: 'capsicum', en: 'Capsicum', hi: 'शिमला मिर्च', mr: 'ढोबळी मिरची', price: 60 },
  { id: 'cauliflower', en: 'Cauliflower', hi: 'फूलगोभी', mr: 'फुलकोबी', price: 48 },
  { id: 'cabbage', en: 'Cabbage', hi: 'पत्तागोभी', mr: 'कोबी', price: 36 },
  { id: 'carrot', en: 'Carrot', hi: 'गाजर', mr: 'गाजर', price: 44 },
  { id: 'brinjal', en: 'Brinjal', hi: 'बैंगन', mr: 'वांगी', price: 52 },
  { id: 'okra', en: 'Okra', hi: 'भिंडी', mr: 'भेंडी', price: 56 },
  { id: 'peas', en: 'Green Peas', hi: 'मटर', mr: 'वाटाणा', price: 80 },
  { id: 'cucumber', en: 'Cucumber', hi: 'खीरा', mr: 'काकडी', price: 38 },
  { id: 'spinach', en: 'Spinach', hi: 'पालक', mr: 'पालक', price: 30 },
  { id: 'radish', en: 'Radish', hi: 'मूली', mr: 'मुळा', price: 34 },
  { id: 'garlic', en: 'Garlic', hi: 'लहसुन', mr: 'लसूण', price: 120 },
  { id: 'ginger', en: 'Ginger', hi: 'अदरक', mr: 'आले', price: 140 },
  { id: 'chilli', en: 'Green Chilli', hi: 'हरी मिर्च', mr: 'हिरवी मिरची', price: 90 },
  { id: 'pumpkin', en: 'Pumpkin', hi: 'कद्दू', mr: 'भोपळा', price: 26 },
  { id: 'bottleGourd', en: 'Bottle Gourd', hi: 'लौकी', mr: 'दुधी भोपळा', price: 42 },
  { id: 'bitterGourd', en: 'Bitter Gourd', hi: 'करेला', mr: 'कारले', price: 64 },
  { id: 'coriander', en: 'Coriander', hi: 'धनिया', mr: 'कोथिंबीर', price: 24 },
] as const

const baskets = [
  { id: 'blue', name: { en: 'Blue', hi: 'नीली', mr: 'निळी' }, state: 'ready', items: 3, weight: '4.2', amount: 186, vegIds: ['tomato', 'onion', 'potato'] },
  { id: 'red', name: { en: 'Red', hi: 'लाल', mr: 'लाल' }, state: 'active', items: 2, weight: '2.7', amount: 132, vegIds: ['capsicum', 'tomato'] },
  { id: 'green', name: { en: 'Green', hi: 'हरी', mr: 'हिरवी' }, state: 'waiting', items: 0, weight: '0', amount: 0, vegIds: [] },
  { id: 'yellow', name: { en: 'Yellow', hi: 'पीली', mr: 'पिवळी' }, state: 'active', items: 1, weight: '1.3', amount: 42, vegIds: ['onion'] },
  { id: 'orange', name: { en: 'Orange', hi: 'नारंगी', mr: 'नारिंगी' }, state: 'waiting', items: 0, weight: '0', amount: 0, vegIds: [] },
  { id: 'purple', name: { en: 'Purple', hi: 'बैंगनी', mr: 'जांभळी' }, state: 'waiting', items: 0, weight: '0', amount: 0, vegIds: [] },
] as const

type BasketId = typeof baskets[number]['id']
type CreatedDisplaySession = { session_id: string; join_code: string; expires_at: string }
type DisplayJoinResult = {
  joined_session_id: string | null
  status: string
  retry_after_seconds: number
}
type DisplayBasket = {
  id: string
  session_id: string
  color: string
  running_total: number | string
  updated_at: string
}
type DisplayBasketItem = {
  id: string
  basket_id: string
  produce_name: string
  weight_kg: number | string
  rate_per_kg: number | string
  item_price: number | string
  display_order: number
}
type VendorItem = {
  id: string
  vegId: VegetableId | null
  name: string
  weight: string
  price: number
  amount: number
}
type BasketView = {
  id: BasketId
  name: typeof baskets[number]['name']
  state: 'ready' | 'active' | 'waiting'
  items: number
  weight: string
  amount: number
  vegIds: readonly VegetableId[]
}
type VegetableId = typeof vegetables[number]['id']

const pairingColors = [
  ...baskets.map(({ id, name }) => ({ id, name })),
  { id: 'pink', name: { en: 'Pink', hi: 'गुलाबी', mr: 'गुलाबी' } },
  { id: 'teal', name: { en: 'Teal', hi: 'नीलहरित', mr: 'नीलहरित' } },
  { id: 'brown', name: { en: 'Brown', hi: 'भूरा', mr: 'तपकिरी' } },
  { id: 'grey', name: { en: 'Grey', hi: 'स्लेटी', mr: 'राखाडी' } },
] as const

const basketItems: Record<BasketId, { vegId: VegetableId; weight: string; price: number; amount: number }[]> = {
  blue: [
    { vegId: 'tomato', weight: '1.5', price: 40, amount: 60 },
    { vegId: 'onion', weight: '1.7', price: 32, amount: 54 },
    { vegId: 'potato', weight: '1.5', price: 48, amount: 72 },
  ],
  red: [
    { vegId: 'capsicum', weight: '1.2', price: 60, amount: 72 },
    { vegId: 'tomato', weight: '1.5', price: 40, amount: 60 },
  ],
  green: [],
  yellow: [
    { vegId: 'onion', weight: '1.3', price: 32, amount: 42 },
  ],
  orange: [],
  purple: [],
}

function getVegetable(id: VegetableId) {
  return vegetables.find((vegetable) => vegetable.id === id)!
}

function toVendorItems(items: DisplayBasketItem[]): VendorItem[] {
  return items.map((item) => {
    const vegetable = vegetables.find(({ en }) => en.toLowerCase() === item.produce_name.toLowerCase())
    return {
      id: item.id,
      vegId: vegetable?.id ?? null,
      name: item.produce_name,
      weight: String(item.weight_kg),
      price: Number(item.rate_per_kg),
      amount: Number(item.item_price),
    }
  })
}

function getInitialVendorItems(basketId: BasketId): VendorItem[] {
  return basketItems[basketId].map((item, index) => {
    const vegetable = getVegetable(item.vegId)
    return {
      id: `initial-${basketId}-${index}`,
      vegId: item.vegId,
      name: vegetable.en,
      weight: item.weight,
      price: item.price,
      amount: item.amount,
    }
  })
}

async function loadVendorSessionData(sessionId: string): Promise<{ baskets: DisplayBasket[]; items: DisplayBasketItem[] }> {
  const { data: basketData, error: basketError } = await supabase
    .from('baskets')
    .select('id, session_id, color, running_total, updated_at')
    .eq('session_id', sessionId)
    .order('color')
  if (basketError) throw basketError
  const sessionBaskets = (basketData ?? []) as DisplayBasket[]

  if (!sessionBaskets.length) {
    throw new Error('No baskets were returned for this display session.')
  }

  const { data: itemData, error: itemError } = await supabase
    .from('basket_items')
    .select('id, basket_id, produce_name, weight_kg, rate_per_kg, item_price, display_order')
    .in('basket_id', sessionBaskets.map(({ id }) => id))
    .order('display_order')
  if (itemError) throw itemError

  return {
    baskets: sessionBaskets,
    items: (itemData ?? []) as DisplayBasketItem[],
  }
}

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    basket: <><path d="M4 10h16l-2 9H6l-2-9Z"/><path d="m8 10 4-6 4 6M9 14v2m6-2v2"/></>,
    bill: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6m-6 4h6"/></>,
    chart: <><path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5m-18 4 9 5 9-5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.7-1.7.9-2-2.2-2-1.9 1-1.7-.7-.8-2.1h-3l-.7 2.1-1.7.7-2-1L1.2 6l1 2-.8 1.8-2 .7v3l2 .7.8 1.8-1 2 2.1 2 2-1 1.7.7.7 2.1h3l.8-2.1 1.7-.7 1.9 1 2.2-2-.9-2 .7-1.8 2-.7Z" transform="scale(.86) translate(2 2)"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-3 0h6"/></>,
    sparkle: <><path d="m17 3 .8 2.2L20 6l-2.2.8L17 9l-.8-2.2L14 6l2.2-.8L17 3Z"/><path d="m8 7 1.4 3.6L13 12l-3.6 1.4L8 17l-1.4-3.6L3 12l3.6-1.4L8 7Z"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.8.4-1.3 1-1.3 1.9m0 3h.01"/></>,
    wifi: <><path d="M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 3a4 4 0 0 1 4 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/></>,
    battery: <><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M6 10h8v4H6z" fill="currentColor"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="M6 6l12 12M18 6 6 18"/>,
    speaker: <><path d="M5 10v4h4l5 4V6l-5 4H5Z"/><path d="M17 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10"/></>,
    share: <><path d="M12 16V3m-4 4 4-4 4 4"/><path d="M5 13v7h14v-7"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/></>,
    moon: <path d="M20 15a8 8 0 0 1-11-11 8.5 8.5 0 1 0 11 11Z"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    shop: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M8 20v-6h8v6"/></>,
    language: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18m0-18c-3 3-3 15 0 18"/></>,
    price: <><circle cx="12" cy="12" r="9"/><path d="M15 7H9m0 4h6m-6-4c4 0 4 4 0 4l6 6"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7"/><path d="M10 11v6m4-6v6"/></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function VegIcon({ id, size = 30 }: { id: typeof vegetables[number]['id']; size?: number }) {
  const art = {
    tomato: <><circle cx="16" cy="17" r="10" fill="#ef5a54"/><path d="m16 8-3-4m3 4 3-4m-3 4-5-2m5 2 5-2" stroke="#3b8b5a"/></>,
    onion: <><path d="M16 5c-1 5-9 7-9 16 0 5 4 8 9 8s9-3 9-8c0-9-8-11-9-16Z" fill="#c993bf"/><path d="M16 5c-2-2-1-4 0-4m0 4c2-2 1-4 0-4M10 21c1 3 3 4 6 4" stroke="#7c4a73"/></>,
    potato: <><path d="M7 9c3-6 12-7 18-1 5 6 1 16-6 19-7 3-14-1-15-8-1-4 1-7 3-10Z" fill="#c99458"/><circle cx="11" cy="12" r="1" fill="#8e6038"/><circle cx="21" cy="16" r="1" fill="#8e6038"/><circle cx="14" cy="23" r="1" fill="#8e6038"/></>,
    capsicum: <><path d="M16 8c-7-3-12 2-10 11 2 8 7 10 10 7 3 3 8 1 10-7 2-9-3-14-10-11Z" fill="#53a767"/><path d="M16 9c-2-4 0-7 3-8" stroke="#2d7440"/><path d="M16 11v14" stroke="#2d7440" opacity=".55"/></>,
    cauliflower: <><path d="M10 27c2-7 10-7 12 0" fill="#4f9149"/><circle cx="11" cy="15" r="6" fill="#f3f0dc"/><circle cx="19" cy="13" r="7" fill="#fffbea"/><circle cx="23" cy="19" r="5" fill="#eee9d3"/><circle cx="13" cy="21" r="6" fill="#faf6e4"/></>,
    cabbage: <><circle cx="16" cy="17" r="12" fill="#79ad69"/><path d="M16 6c-6 5-7 14 0 22M8 11c7 0 13 5 16 12M7 23c4-6 11-10 18-10" stroke="#4f8147"/></>,
    carrot: <><path d="m12 9 13 3-9 17c-2 3-5 2-5-2L12 9Z" fill="#e98035"/><path d="M13 9c-4-4-2-7-1-8m2 8c3-5 6-5 8-5m-7 6c0-5 3-7 4-8" stroke="#4c914b"/></>,
    brinjal: <><path d="M12 8c-8 4-7 15-1 20 6 4 14 0 15-7 1-8-6-13-14-13Z" fill="#76509a"/><path d="M11 9c0-5 4-7 8-6m-7 6 5-4 4 4" stroke="#4f9149"/></>,
    okra: <><path d="M10 5c4 3 10 14 12 22-4 3-9 2-12-2C7 18 7 10 10 5Z" fill="#4f9f55"/><path d="m10 6-3-3m4 6 8 15M10 14l5-2m-4 7 7-2" stroke="#30763a"/></>,
    peas: <><path d="M5 20c5-12 15-15 23-10-2 11-12 17-23 10Z" fill="#68ae55"/><circle cx="11" cy="17" r="3" fill="#b4d66d"/><circle cx="17" cy="14" r="3" fill="#b4d66d"/><circle cx="23" cy="12" r="3" fill="#b4d66d"/></>,
    cucumber: <><rect x="6" y="11" width="22" height="11" rx="5.5" transform="rotate(-18 17 16)" fill="#54a15c"/><path d="m10 18 2-1m5-2 2-1m4-1 2-1" stroke="#b7d98c"/></>,
    spinach: <><path d="M16 28C4 21 4 9 15 4c9 5 11 16 1 24Z" fill="#3f9450"/><path d="M16 27V8m0 11-6-5m6 1 5-4" stroke="#b8d99a"/></>,
    radish: <><path d="M10 11c3-5 11-5 14 0 3 6-3 13-8 17-5-4-9-11-6-17Z" fill="#e9e3dc"/><path d="m15 8-4-6m6 6 1-7m1 8 6-5" stroke="#4d9852"/><path d="m16 27-2 4m2-4 2 4" stroke="#c9bdb5"/></>,
    garlic: <><path d="M16 7c-1 5-9 5-9 14 0 8 7 9 9 5 2 4 9 3 9-5 0-9-8-9-9-14Z" fill="#eee6dc"/><path d="M16 8c-2-3 0-6 2-7m-2 7v17" stroke="#b9a99c"/></>,
    ginger: <><path d="M7 18c-3-4 1-8 5-6-1-6 6-7 8-3 5-3 9 2 6 6 5 2 3 9-2 9-2 6-10 5-11 0-5 2-9-2-6-6Z" fill="#c99a61"/><path d="m11 16 4 4m5-8-3 7m7-3-6 5" stroke="#9b6e43"/></>,
    chilli: <><path d="M8 11c8 1 11 8 19 13-7 5-18-1-19-13Z" fill="#3d9e4b"/><path d="M8 11c-2-4 1-7 4-8" stroke="#2c7136"/><path d="M13 15c4 2 7 5 10 7" stroke="#91c56c"/></>,
    pumpkin: <><ellipse cx="16" cy="18" rx="13" ry="10" fill="#dd8130"/><ellipse cx="16" cy="18" rx="6" ry="10" fill="#ec9841"/><path d="M16 8c-2-4 1-7 4-7" stroke="#467f40"/></>,
    bottleGourd: <><path d="M13 5c5 0 7 4 5 8 9 4 8 15-2 16C6 28 5 17 13 13c-2-3-2-6 0-8Z" fill="#7db86b"/><path d="M14 5c-1-3 1-4 3-5" stroke="#4d8245"/></>,
    bitterGourd: <><path d="M12 5c9 3 13 13 8 24-8 0-13-9-8-24Z" fill="#478e4c"/><path d="m13 9 5 1m-6 4 8 2m-8 4 9 2m-8 3 6 1" stroke="#93bd6e"/></>,
    coriander: <><path d="M16 29V9m0 8-7-4m7 9 8-5" stroke="#397d40"/><circle cx="9" cy="10" r="5" fill="#5fa65c"/><circle cx="17" cy="7" r="5" fill="#70b56a"/><circle cx="24" cy="14" r="5" fill="#5a9e55"/><circle cx="8" cy="20" r="4" fill="#72b66b"/></>,
  } as const
  return <svg className="veg-art" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">{art[id]}</svg>
}

function SalesGraphic({ label }: { label: string }) {
  return <div className="sales-graphic" aria-hidden="true">
    <span>{label}</span>
    <svg viewBox="0 0 180 80">
      <rect x="4" y="48" width="9" height="24" rx="3"/>
      <rect x="19" y="42" width="9" height="30" rx="3"/>
      <rect x="34" y="52" width="9" height="20" rx="3"/>
      <rect x="49" y="36" width="9" height="36" rx="3"/>
      <rect x="64" y="40" width="9" height="32" rx="3"/>
      <rect x="79" y="28" width="9" height="44" rx="3"/>
      <rect x="94" y="33" width="9" height="39" rx="3"/>
      <rect x="109" y="22" width="9" height="50" rx="3"/>
      <rect x="124" y="27" width="9" height="45" rx="3"/>
      <rect x="139" y="17" width="9" height="55" rx="3"/>
      <rect x="154" y="21" width="9" height="51" rx="3"/>
      <rect className="current-month" x="169" y="8" width="9" height="64" rx="3"/>
    </svg>
  </div>
}

function ActionButton({
  children,
  onClick,
  kind = 'primary',
  icon,
  disabled = false,
  type = 'submit',
}: {
  children: ReactNode
  onClick?: () => void
  kind?: 'primary' | 'secondary' | 'ghost'
  icon?: IconName
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return <button type={type} className={`action action-${kind}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon}/>}<span>{children}</span></button>
}

function Header({ title, onBack, onHelp }: { title: string; onBack?: () => void; onHelp?: () => void }) {
  return <header className="header">
    {onBack ? <button className="icon-button" onClick={onBack} aria-label="Back"><Icon name="back"/></button> : <div className="header-mark"><span>S</span></div>}
    <div className="header-title">{title}</div>
    {onHelp ? <button className="icon-button" onClick={onHelp} aria-label="Help"><Icon name="help"/></button> : <div className="header-spacer"/>}
  </header>
}

function VoiceField({
  label,
  value,
  onChange,
  onMic,
  inputMode = 'text',
  icon = 'mic',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onMic: () => void
  inputMode?: 'text' | 'numeric' | 'tel'
  icon?: IconName
}) {
  return <label className="field-wrap">
    <span>{label}</span>
    <div className="field">
      <input value={value} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} placeholder={label}/>
      <button type="button" className="field-mic" onClick={onMic} aria-label={`${label} voice input`}><Icon name={icon}/></button>
    </div>
  </label>
}

function LanguageChoices({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const [showMore, setShowMore] = useState(false)
  const choices: { id: Language; label: string; detail: string }[] = [
    { id: 'en', label: 'English', detail: 'English' },
    { id: 'hi', label: 'हिन्दी', detail: 'Hindi' },
    { id: 'mr', label: 'मराठी', detail: 'Marathi' },
  ]
  return <div className="language-list">
    {choices.map((choice) => <button key={choice.id} className={`language-choice ${language === choice.id ? 'selected' : ''}`} onClick={() => setLanguage(choice.id)}>
      <span className="language-name">{choice.label}</span>
      <span className="language-detail">{choice.detail}</span>
      <span className="check-circle">{language === choice.id && <Icon name="check" size={18}/>}</span>
    </button>)}
    <button className="language-choice other-language-choice" onClick={() => setShowMore(!showMore)}>
      <span className="language-name">{copy[language].otherLanguages}</span>
      <span className="language-detail">English · हिन्दी · मराठी</span>
      <span className="check-circle"><Icon name="plus" size={18}/></span>
    </button>
    {showMore && <div className="language-note"><Icon name="language"/><span>{copy[language].moreLanguagesSoon}</span></div>}
  </div>
}

function VoiceOverlay({
  t,
  kind,
  onClose,
  onConfirm,
}: {
  t: (key: CopyKey) => string
  kind: 'phone' | 'price' | 'shop' | 'search' | 'message'
  onClose: () => void
  onConfirm: (value: string) => void
}) {
  const [state, setState] = useState<'listening' | 'heard' | 'unclear'>('listening')
  const heard = kind === 'phone' ? t('heardPhone') : kind === 'shop' ? t('heardShop') : kind === 'search' ? 'Tomato' : kind === 'message' ? t('showLow') : t('heardPrice')
  useEffect(() => {
    const timer = window.setTimeout(() => setState('heard'), 1400)
    return () => window.clearTimeout(timer)
  }, [])
  return <div className="overlay" role="dialog" aria-modal="true">
    <button className="overlay-scrim" onClick={onClose} aria-label="Close"/>
    <div className="voice-sheet">
      <div className="sheet-grabber"/>
      {state === 'listening' && <>
        <div className="voice-orb listening-orb"><Icon name="mic" size={32}/></div>
        <h2>{t('listening')}</h2>
        <div className="wave"><i/><i/><i/><i/><i/></div>
        <p>{heard.slice(0, Math.max(3, Math.floor(heard.length / 2)))}…</p>
        <button className="text-link" onClick={() => setState('unclear')}>{t('sayAgain')}</button>
      </>}
      {state === 'heard' && <>
        <div className="voice-orb"><Icon name="check" size={32}/></div>
        <p className="eyebrow">{t('heard')}</p>
        <h2>{heard}</h2>
        <div className="sheet-actions">
          <ActionButton kind="secondary" onClick={() => setState('listening')}>{t('sayAgain')}</ActionButton>
          <ActionButton onClick={() => onConfirm(heard)}>{t('confirm')}</ActionButton>
        </div>
      </>}
      {state === 'unclear' && <>
        <div className="voice-orb quiet"><Icon name="mic" size={32}/></div>
        <h2>{t('notClear')}</h2>
        <ActionButton onClick={() => setState('listening')}>{t('sayAgain')}</ActionButton>
      </>}
    </div>
  </div>
}

function AssistantSheet({
  t,
  tab,
  introduced,
  setIntroduced,
  onClose,
  onNavigate,
}: {
  t: (key: CopyKey) => string
  tab: Tab
  introduced: boolean
  setIntroduced: (value: boolean) => void
  onClose: () => void
  onNavigate: (screen: Screen) => void
}) {
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'answer' | 'confirm' | 'notunderstood' | 'offline'>('idle')
  const [answer, setAnswer] = useState(t('helperIntro'))
  const suggestions: Record<Tab, CopyKey[]> = {
    live: ['billBlue', 'whyGrey', 'howPair'],
    billing: ['billBlue', 'salesExplain', 'howPair'],
    stock: ['showLow', 'salesExplain', 'setTomato'],
    baskets: ['howPair', 'whyGrey', 'showLow'],
    settings: ['setTomato', 'howPair', 'salesExplain'],
  }
  const ask = (key: CopyKey) => {
    if (key === 'setTomato') {
      setState('confirm')
      return
    }
    setState('thinking')
    window.setTimeout(() => {
      if (key === 'howPair') setAnswer(t('pairSteps'))
      else if (key === 'showLow') setAnswer(t('answerLow'))
      else if (key === 'whyGrey') setAnswer(t('answerGrey'))
      else setAnswer(t('answerSales'))
      setState('answer')
    }, 900)
  }
  if (!introduced) return <div className="overlay" role="dialog" aria-modal="true">
    <button className="overlay-scrim" onClick={onClose} aria-label="Close"/>
    <div className="assistant-sheet intro-sheet">
      <div className="sheet-grabber"/>
      <div className="assistant-avatar"><Icon name="sparkle" size={32}/></div>
      <h2>{t('assistant')}</h2>
      <p>{t('helperIntro')}</p>
      <ActionButton onClick={() => setIntroduced(true)}>{t('gotIt')}</ActionButton>
    </div>
  </div>
  return <div className="overlay" role="dialog" aria-modal="true">
    <button className="overlay-scrim" onClick={onClose} aria-label="Close"/>
    <div className="assistant-sheet">
      <div className="sheet-grabber"/>
      <div className="assistant-head">
        <div><span className="eyebrow">{t('assistant')}</span><strong>{t('askAnything')}</strong></div>
        <button className="icon-button" onClick={onClose}><Icon name="close"/></button>
      </div>
      {state === 'idle' && <>
        <button className="big-mic" onClick={() => { setState('listening'); window.setTimeout(() => ask('showLow'), 1200) }}><Icon name="mic" size={36}/></button>
        <p className="center secondary">{t('helperIntro')}</p>
        <p className="eyebrow suggestion-label">{t('suggestions')}</p>
        <div className="suggestions">{suggestions[tab].map((key) => <button key={key} onClick={() => ask(key)}>{t(key)}</button>)}</div>
      </>}
      {state === 'listening' && <div className="assistant-state"><div className="big-mic pulse"><Icon name="mic" size={36}/></div><h2>{t('listening')}</h2><div className="wave"><i/><i/><i/><i/><i/></div></div>}
      {state === 'thinking' && <div className="assistant-state"><div className="thinking-dots"><i/><i/><i/></div><h2>{t('thinking')}</h2></div>}
      {state === 'answer' && <div className="answer-card">
        <div className="answer-icon"><Icon name="sparkle"/></div>
        <p>{answer}</p>
        <button className="speaker-button"><Icon name="speaker"/><span>{t('voiceReplies')}</span></button>
        {answer === t('pairSteps') && <ActionButton onClick={() => { onClose(); onNavigate('pair') }}>{t('showMe')}</ActionButton>}
      </div>}
      {state === 'confirm' && <div className="confirm-card">
        <div className="answer-icon"><Icon name="price"/></div>
        <h2>{t('confirmPrice')}</h2>
        <div className="sheet-actions">
          <ActionButton kind="secondary" onClick={() => { setAnswer(t('cancelled')); setState('answer') }}>{t('cancel')}</ActionButton>
          <ActionButton onClick={() => { setAnswer(t('priceDone')); setState('answer') }}>{t('confirm')}</ActionButton>
        </div>
      </div>}
      {state === 'notunderstood' && <div className="assistant-state"><h2>{t('notClear')}</h2><ActionButton onClick={() => setState('listening')}>{t('sayAgain')}</ActionButton></div>}
      {state === 'offline' && <div className="assistant-state"><h2>{t('assistantOffline')}</h2><ActionButton onClick={() => setState('idle')}>{t('done')}</ActionButton></div>}
      <div className="assistant-input">
        <input placeholder={t('askAnything')}/>
        <button onClick={() => setState('listening')}><Icon name="mic"/></button>
      </div>
      <div className="state-demo-links">
        <button onClick={() => setState('notunderstood')}>{t('notClear')}</button>
        <button onClick={() => setState('offline')}>{t('offline')}</button>
      </div>
    </div>
  </div>
}

function FloatingNav({ tab, setTab, t, onAsk }: { tab: Tab; setTab: (tab: Tab) => void; t: (key: CopyKey) => string; onAsk: () => void }) {
  const items: { id: Tab; icon: IconName; label: CopyKey }[] = [
    { id: 'live', icon: 'basket', label: 'live' },
    { id: 'billing', icon: 'bill', label: 'billing' },
    { id: 'stock', icon: 'chart', label: 'stock' },
    { id: 'baskets', icon: 'layers', label: 'baskets' },
    { id: 'settings', icon: 'settings', label: 'settings' },
  ]
  return <div className="floating-controls">
    <nav className="floating-nav">
      {items.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
        <Icon name={item.icon}/><span>{t(item.label)}</span>
      </button>)}
    </nav>
    <button className="ask-button" onClick={onAsk}><span className="ask-icon"><Icon name="mic" size={22}/><Icon name="sparkle" size={13}/></span><span>{t('ask')}</span></button>
  </div>
}

function Onboarding({
  screen,
  setScreen,
  language,
  setLanguage,
  t,
  openVoice,
  onSkipForNow,
}: {
  screen: Screen
  setScreen: (screen: Screen) => void
  language: Language
  setLanguage: (language: Language) => void
  t: (key: CopyKey) => string
  openVoice: (kind: 'phone' | 'price' | 'shop' | 'search' | 'message', setter: (value: string) => void) => void
  onSkipForNow: () => Promise<void>
}) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [prices, setPrices] = useState<Record<string, string>>(() => Object.fromEntries(vegetables.map((vegetable) => [vegetable.id, String(vegetable.price)])))
  const [isSkipping, setIsSkipping] = useState(false)
  const [skipError, setSkipError] = useState<string | null>(null)
  const skipOnboarding = async () => {
    setIsSkipping(true)
    setSkipError(null)
    try {
      await onSkipForNow()
    } catch (error) {
      setSkipError(error instanceof Error ? error.message : 'Unable to continue without signing in.')
    } finally {
      setIsSkipping(false)
    }
  }
  const skipForNow = <div className="skip-for-now">
    {skipError && <p role="alert">{skipError}</p>}
    <button className="text-link" type="button" disabled={isSkipping} onClick={() => void skipOnboarding()}>{isSkipping ? 'Preparing Vendor...' : 'Skip for now'}</button>
  </div>
  if (screen === 'language') return <main className="onboarding">
    <div className="brand-lockup"><div className="brand-symbol"><Icon name="basket" size={32}/></div><span>Sabzi Basket</span></div>
    <div className="onboarding-copy"><span className="step-chip">1 / 3</span><h1>{t('chooseLanguage')}</h1><p>{t('languageHint')}</p></div>
    <LanguageChoices language={language} setLanguage={setLanguage}/>
    <ActionButton onClick={() => setScreen('intro')}>{t('continue')}</ActionButton>
    {skipForNow}
  </main>
  if (screen === 'login') return <main className="onboarding">
    <Header title="Sabzi Basket" onBack={() => setScreen('language')}/>
    <div className="onboarding-copy"><span className="step-chip">2 / 3</span><h1>{t('welcome')}</h1><p>{t('welcomeHint')}</p></div>
    <VoiceField label={t('phone')} value={phone} onChange={setPhone} inputMode="tel" onMic={() => openVoice('phone', setPhone)}/>
    <ActionButton onClick={() => setScreen('otp')}>{t('sendOtp')}</ActionButton>
    {skipForNow}
  </main>
  if (screen === 'otp') return <main className="onboarding">
    <Header title="Sabzi Basket" onBack={() => setScreen('login')}/>
    <div className="onboarding-copy"><h1>{t('otpTitle')}</h1><p>{t('otpHint')}</p></div>
    <VoiceField label={t('otp')} value={otp} onChange={setOtp} inputMode="numeric" onMic={() => openVoice('phone', setOtp)}/>
    <ActionButton onClick={() => setScreen('setup')}>{t('confirm')}</ActionButton>
    {skipForNow}
  </main>
  return <main className="onboarding setup-screen">
    <Header title="Sabzi Basket" onBack={() => setScreen('otp')}/>
    <div className="onboarding-copy"><span className="step-chip">3 / 3</span><h1>{t('setupTitle')}</h1><p>{t('setupHint')}</p></div>
    <div className="price-list">
      {vegetables.map((veg) => <div className="price-row" key={veg.id}><span className="veg-icon"><VegIcon id={veg.id}/></span><div className="price-name"><strong>{veg[language]}</strong><span>{t('perKg')}</span></div><div className="compact-field"><span>₹</span><input value={prices[veg.id]} inputMode="numeric" onChange={(e) => setPrices({ ...prices, [veg.id]: e.target.value })}/><button onClick={() => openVoice('price', (value) => setPrices({ ...prices, [veg.id]: value.replace(/\D/g, '') }))}><Icon name="mic"/></button></div></div>)}
    </div>
    <div className="onboarding-actions"><button className="text-link" disabled={isSkipping} onClick={() => void skipOnboarding()}>{t('skip')}</button><ActionButton disabled={isSkipping} onClick={() => void skipOnboarding()}>{t('start')}</ActionButton>{skipForNow}</div>
  </main>
}

function SplashScreen({ t, onDone }: { t: (key: CopyKey) => string; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1800)
    return () => window.clearTimeout(timer)
  }, [onDone])
  return <main className="splash-screen" onClick={onDone}>
    <div className="splash-glow"/>
    <div className="splash-brand">
      <div className="splash-symbol">
        <Icon name="basket" size={44}/>
        <span><Icon name="sparkle" size={20}/></span>
      </div>
      <h1>Sabzi Basket</h1>
      <p>{t('splashTagline')}</p>
    </div>
    <div className="splash-progress"><i/></div>
  </main>
}

function IntroScreen({ t, onDone }: { t: (key: CopyKey) => string; onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const slides: { title: CopyKey; body: CopyKey; art: ReactNode }[] = [
    {
      title: 'introOneTitle',
      body: 'introOneBody',
      art: <div className="intro-basket-art">
        <div className="intro-camera"><Icon name="sparkle" size={18}/></div>
        <Icon name="basket" size={78}/>
        <div className="intro-veg-stack"><VegIcon id="tomato" size={38}/><VegIcon id="capsicum" size={38}/></div>
        <div className="intro-weight">2.4 kg</div>
      </div>,
    },
    {
      title: 'introTwoTitle',
      body: 'introTwoBody',
      art: <div className="intro-billing-art">
        <div className="mini-basket-card blue"><span/><div><strong>4.2 kg</strong><small>₹186</small></div></div>
        <div className="mini-basket-card red"><span/><div><strong>2.7 kg</strong><small>₹112</small></div></div>
        <div className="intro-receipt"><Icon name="bill" size={30}/><strong>₹298</strong><span><Icon name="check" size={16}/></span></div>
      </div>,
    },
    {
      title: 'introThreeTitle',
      body: 'introThreeBody',
      art: <div className="intro-assistant-art">
        <div className="intro-speech">₹40 / kg</div>
        <div className="intro-assistant-orb"><Icon name="mic" size={42}/><span><Icon name="sparkle" size={18}/></span></div>
        <div className="intro-wave"><i/><i/><i/><i/><i/></div>
      </div>,
    },
  ]
  const current = slides[slide]
  return <main className="intro-screen">
    <div className="intro-top">
      <div className="brand-lockup"><div className="brand-symbol"><Icon name="basket" size={32}/></div><span>Sabzi Basket</span></div>
      <button className="intro-skip" onClick={onDone}>{t('introSkip')}</button>
    </div>
    <div className="intro-art-stage" key={slide}>{current.art}</div>
    <div className="intro-copy" key={`copy-${slide}`}>
      <div className="intro-dots">{slides.map((_, index) => <span key={index} className={index === slide ? 'active' : ''}/>)}</div>
      <h1>{t(current.title)}</h1>
      <p>{t(current.body)}</p>
    </div>
    <ActionButton onClick={() => slide < slides.length - 1 ? setSlide(slide + 1) : onDone()}>
      {slide < slides.length - 1 ? t('next') : t('getStarted')}
    </ActionButton>
  </main>
}

function LiveScreen({ t, language, openDetail, createDisplaySession, isCreatingDisplaySession, displaySession, displaySessionError, persistedBaskets, persistedItems, persistenceError }: {
  t: (key: CopyKey) => string
  language: Language
  openDetail: (basketId: BasketId) => void
  createDisplaySession: () => void
  isCreatingDisplaySession: boolean
  displaySession: CreatedDisplaySession | null
  displaySessionError: string | null
  persistedBaskets: DisplayBasket[]
  persistedItems: DisplayBasketItem[]
  persistenceError: string | null
}) {
  const visibleBaskets = displaySession
    ? persistedBaskets.flatMap((record) => {
      const basket = baskets.find(({ id }) => id === record.color)
      if (!basket) return []
      const items = persistedItems.filter((item) => item.basket_id === record.id)
      const weight = items.reduce((total, item) => total + Number(item.weight_kg), 0)
      return [{
        ...basket,
        state: items.length ? 'active' : 'waiting',
        items: items.length,
        weight: weight.toFixed(1),
        amount: Number(record.running_total),
        persistedRecord: record,
        persistedItems: items,
      }]
    })
    : baskets.map((basket) => ({ ...basket, persistedRecord: null, persistedItems: [] as DisplayBasketItem[] }))

  return <div className="page live-page">
    <div className="live-sticky-header">
      <div className="page-head live-page-head">
        <div><span className="eyebrow">{t('today')}</span><h1 className="live-page-title">{t('live')}</h1></div>
        <div className="connection"><span/><Icon name="wifi" size={18}/>{t('connected')}</div>
      </div>
      <div className="status-banner"><div className="status-check"><Icon name="check" size={18}/></div><span>{t('allGood')}</span><strong>{t('active')}</strong></div>
    </div>
    <ActionButton onClick={createDisplaySession} disabled={isCreatingDisplaySession}>
      {isCreatingDisplaySession ? 'Creating and syncing...' : 'Create display session'}
    </ActionButton>
    {displaySessionError && <p role="alert" style={{ color: '#b42318' }}>{displaySessionError}</p>}
    {persistenceError && <p role="alert" style={{ color: '#b42318' }}>{persistenceError}</p>}
    {displaySession && <p role="status">
      <strong>Join code:</strong> {displaySession.join_code}<br/>
      <strong>Expires at:</strong> <time dateTime={displaySession.expires_at}>{displaySession.expires_at}</time>
    </p>}
    <div className="basket-grid">
      {visibleBaskets.map((basket) => <button key={basket.id} className={`basket-card ${basket.state}`} onClick={() => openDetail(basket.id)}>
        <div className={`basket-band band-${basket.id}`}><span>{basket.name[language]}</span>{basket.state === 'active' && <i/>}</div>
        <div className="basket-content">
          <span className={`state-label ${basket.state}`}>{basket.state === 'ready' ? t('ready') : basket.state === 'active' ? t('active') : t('waiting')}</span>
          {basket.state === 'waiting' ? <div className="waiting-visual"><Icon name="basket" size={32}/><span>0 kg</span></div> : <>
            <strong className="basket-weight">{basket.weight} kg</strong>
            <span>{basket.items} {t('items')}</span>
            <div className="basket-veg-list">
              {basket.persistedRecord
                ? <span>{basket.persistedItems.map((item) => item.produce_name).join(' · ')}</span>
                : <>
                  <span className="basket-veg-icons">{basket.vegIds.map((vegId) => <span key={vegId}><VegIcon id={vegId} size={22}/></span>)}</span>
                  <span>{basket.vegIds.map((vegId) => getVegetable(vegId)[language]).join(' · ')}</span>
                </>}
            </div>
            <strong className="basket-amount">₹{basket.amount}</strong>
          </>}
        </div>
      </button>)}
    </div>
  </div>
}

function DetailScreen({ t, language, basket, items, goBack, goBill, onHelp, openVoice, onRemoveItem, onRestoreItem, onAddItem, onCreateSession, isCreatingSession, activeSessionId, selectedBasketDatabaseId, sessionError, persistenceError }: {
  t: (key: CopyKey) => string
  language: Language
  basket: BasketView
  items: VendorItem[]
  goBack: () => void
  goBill: () => void
  onHelp: () => void
  openVoice: (kind: 'search', setter: (value: string) => void) => void
  onRemoveItem?: (item: VendorItem) => Promise<void>
  onRestoreItem?: (item: VendorItem) => Promise<void>
  onAddItem: (vegetable: typeof vegetables[number], quantityKg: number, sessionId: string, basketId: string) => Promise<void>
  onCreateSession: () => Promise<void>
  isCreatingSession: boolean
  activeSessionId: string | null
  selectedBasketDatabaseId: string | null
  sessionError: string | null
  persistenceError: string | null
}) {
  const [unsure, setUnsure] = useState(true)
  const [removedItem, setRemovedItem] = useState<VendorItem | null>(null)
  const [savingItemId, setSavingItemId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedVegetableId, setSelectedVegetableId] = useState<VegetableId>(vegetables[0].id)
  const [quantityKg, setQuantityKg] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [addItemError, setAddItemError] = useState<string | null>(null)
  const [addItemSuccess, setAddItemSuccess] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const removeItem = async (item: VendorItem) => {
    setSavingItemId(item.id)
    try {
      if (onRemoveItem) {
        await onRemoveItem(item)
      }
      setRemovedItem(item)
    } catch {
      return
    } finally {
      setSavingItemId(null)
    }
  }
  const restoreItem = async () => {
    if (!removedItem) return
    setSavingItemId(removedItem.id)
    try {
      if (onRestoreItem) {
        await onRestoreItem(removedItem)
      }
      setRemovedItem(null)
    } catch {
      return
    } finally {
      setSavingItemId(null)
    }
  }
  const addItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const quantity = Number(quantityKg)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setAddItemError('Enter a quantity greater than zero kg.')
      return
    }
    if (!activeSessionId || !selectedBasketDatabaseId) {
      setAddItemError('Create a display session before adding items to this basket.')
      return
    }
    const vegetable = vegetables.find(({ id }) => id === selectedVegetableId)
    if (!vegetable) {
      setAddItemError('Choose a valid vegetable.')
      return
    }

    setIsAddingItem(true)
    setAddItemError(null)
    setAddItemSuccess(null)
    try {
      await onAddItem(vegetable, quantity, activeSessionId, selectedBasketDatabaseId)
      setQuantityKg('')
      setAddItemSuccess(`${vegetable[language]} added to ${basket.name[language]} basket.`)
    } catch (error) {
      setAddItemError(error instanceof Error ? error.message : 'Unable to add this vegetable.')
    } finally {
      setIsAddingItem(false)
    }
  }
  return <div className="detail-layout">
    <Header title={`${basket.name[language]} ${t('basket')}`} onBack={goBack} onHelp={onHelp}/>
    <main className="detail-content">
      {persistenceError && <p role="alert" style={{ color: '#b42318' }}>{persistenceError}</p>}
      <div className="total-hero"><span>{t('runningTotal')}</span><strong>₹{basket.amount}</strong><div className="weight-pill">{basket.weight} kg</div></div>
      {basket.id === 'blue' && <div className="live-update"><span className="veg-icon"><VegIcon id="tomato"/></span><div><strong>{t('newItem')}</strong><span>₹60</span></div><span className="live-dot">{t('active')}</span></div>}
      {basket.id === 'blue' && unsure && <div className="recognition-card">
        <div className="recognition-head"><div className="camera-preview"><VegIcon id="tomato" size={44}/><span><Icon name="sparkle" size={16}/></span></div><div><h2>{t('unsure')}</h2><p>{t('pickRight')}</p></div></div>
        <div className="guess-grid">
          {vegetables.slice(0, 3).map((veg) => <button key={veg.id} onClick={() => setUnsure(false)}><span><VegIcon id={veg.id}/></span>{veg[language]}</button>)}
        </div>
        <VoiceField label={t('chooseOther')} value={search} onChange={setSearch} icon="search" onMic={() => openVoice('search', setSearch)}/>
      </div>}
      <button className="text-link" type="button" onClick={() => { setAddOpen(!addOpen); setAddItemError(null); setAddItemSuccess(null) }}>Add vegetable</button>
      {addOpen && <form className="basket-add-form" onSubmit={(event) => void addItem(event)}>
        {(!activeSessionId || !selectedBasketDatabaseId) && <>
          <p className="secondary">Create a display session before adding items to this basket.</p>
          {sessionError && <p className="display-error" role="alert">{sessionError}</p>}
          <ActionButton type="button" disabled={isCreatingSession} onClick={() => void onCreateSession()}>
            {isCreatingSession ? 'Creating session...' : 'Create display session'}
          </ActionButton>
        </>}
        {activeSessionId && selectedBasketDatabaseId && <>
        <label htmlFor="basket-vegetable">Vegetable</label>
        <select id="basket-vegetable" value={selectedVegetableId} onChange={(event) => {
          const nextVegetable = vegetables.find(({ id }) => id === event.target.value)
          if (nextVegetable) setSelectedVegetableId(nextVegetable.id)
        }}>
          {vegetables.map((vegetable) => <option value={vegetable.id} key={vegetable.id}>{vegetable[language]} · ₹{vegetable.price}/kg</option>)}
        </select>
        <label htmlFor="basket-quantity">Quantity (kg)</label>
        <input id="basket-quantity" type="number" min="0.001" step="0.001" inputMode="decimal" value={quantityKg} onChange={(event) => setQuantityKg(event.target.value)} />
        {addItemSuccess && <p role="status">{addItemSuccess}</p>}
        {sessionError && <p className="display-error" role="alert">{sessionError}</p>}
        {addItemError && <p className="display-error" role="alert">{addItemError}</p>}
        <ActionButton disabled={isAddingItem}>{isAddingItem ? 'Adding...' : 'Confirm add'}</ActionButton>
        </>}
      </form>}
      <div className="section-title"><h2>{t('items')}</h2><span>{items.filter((item) => item.id !== removedItem?.id).length}</span></div>
      <div className="item-list">
        {items.filter((item) => item.id !== removedItem?.id).length === 0 && <div className="empty-items"><Icon name="basket" size={36}/><span>{t('noItems')}</span></div>}
        {items.map((item, index) => {
          if (item.id === removedItem?.id) return null
          return <div className={`item-row ${index === 0 ? 'new-row' : ''}`} key={item.id}><span className="veg-icon">{item.vegId ? <VegIcon id={item.vegId}/> : '🥬'}</span><div><strong>{item.vegId ? getVegetable(item.vegId)[language] : item.name}</strong><span>{item.weight} kg × ₹{item.price}</span></div><strong>₹{item.amount}</strong><button disabled={savingItemId !== null} aria-label={`Remove ${item.name}`} onClick={() => void removeItem(item)}><Icon name="trash"/></button></div>
        })}
      </div>
      {removedItem && <div className="toast"><span>{savingItemId ? 'Saving...' : t('removed')}</span><button disabled={savingItemId !== null} onClick={() => void restoreItem()}>{t('undo')}</button></div>}
    </main>
    <div className="bottom-action"><ActionButton onClick={goBill} disabled={items.length === 0}>{items.length ? `${t('bill')} · ₹${basket.amount}` : t('waiting')}</ActionButton></div>
  </div>
}

function SummaryScreen({ t, language, basket, items, goBack, goReceipt, onHelp }: { t: (key: CopyKey) => string; language: Language; basket: BasketView; items: VendorItem[]; goBack: () => void; goReceipt: (payment: 'cash' | 'upi') => void; onHelp: () => void }) {
  const [payment, setPayment] = useState<'cash' | 'upi'>('cash')
  return <div className="detail-layout">
    <Header title={t('billSummary')} onBack={goBack} onHelp={onHelp}/>
    <main className="detail-content">
      <div className="summary-card">
        <span className={`basket-chip basket-chip-${basket.id}`}>{basket.name[language]} {t('basket')}</span>
        {items.map((item) => <div className="summary-row" key={item.id}><span>{item.vegId ? <VegIcon id={item.vegId}/> : '🥬'}</span><div><strong>{item.vegId ? getVegetable(item.vegId)[language] : item.name}</strong><small>{item.weight} kg</small></div><strong>₹{item.amount}</strong></div>)}
        <div className="grand-total"><span>{t('total')}</span><strong>₹{basket.amount}</strong></div>
      </div>
      <div className="payment-section"><h2>{t('payment')}</h2><div className="payment-grid">
        <button className={payment === 'cash' ? 'selected' : ''} onClick={() => setPayment('cash')}><span>₹</span><strong>{t('cash')}</strong><i>{payment === 'cash' && <Icon name="check" size={18}/>}</i></button>
        <button className={payment === 'upi' ? 'selected' : ''} onClick={() => setPayment('upi')}><span className="upi-mark">U</span><strong>{t('upi')}</strong><i>{payment === 'upi' && <Icon name="check" size={18}/>}</i></button>
      </div></div>
    </main>
    <div className="bottom-action"><ActionButton onClick={() => goReceipt(payment)}>{t('done')} · ₹{basket.amount}</ActionButton></div>
  </div>
}

function ReceiptScreen({ t, language, basket, items, payment, finish, onHelp }: { t: (key: CopyKey) => string; language: Language; basket: BasketView; items: VendorItem[]; payment: 'cash' | 'upi'; finish: () => void; onHelp: () => void }) {
  return <div className="detail-layout receipt-page">
    <Header title={t('receipt')} onHelp={onHelp}/>
    <main className="detail-content">
      <div className="success-mark"><Icon name="check" size={36}/></div>
      <h1 className="receipt-title">{t('billSaved')}</h1>
      <p className="secondary center">{basket.name[language]} {t('basket')} · {payment === 'cash' ? t('paymentCash') : t('paymentUpi')}</p>
      <div className="receipt-card">
        <div className="receipt-brand"><div className="brand-symbol small"><Icon name="basket"/></div><div><strong>Sabzi Basket</strong><span>Mahalaxmi Fresh Vegetables</span></div></div>
        <div className="receipt-meta"><span>{t('bill')} #1042</span><span>{t('today')}, 10:42 AM</span></div>
        {items.map((item) => <div className="receipt-line" key={item.id}><span>{item.vegId ? getVegetable(item.vegId)[language] : item.name} · {item.weight} kg</span><strong>₹{item.amount}</strong></div>)}
        <div className="grand-total"><span>{t('total')}</span><strong>₹{basket.amount}</strong></div>
      </div>
      <ActionButton kind="secondary" icon="share">{t('share')}</ActionButton>
    </main>
    <div className="bottom-action"><ActionButton onClick={finish}>{t('done')}</ActionButton></div>
  </div>
}

function BillingScreen({ t }: { t: (key: CopyKey) => string }) {
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">{t('today')}</span><h1>{t('billing')}</h1></div></div>
    <div className="metric-card"><span>{t('dailySales')}</span><strong>₹8,460</strong><small>24 bills · 126 kg</small><SalesGraphic label={t('monthlyTrend')}/></div>
    <div className="section-title"><h2>{t('pastBills')}</h2><span>24</span></div>
    <div className="bill-list">
      {[['#1041', '₹420', '10:18 AM'], ['#1040', '₹286', '9:55 AM'], ['#1039', '₹640', '9:30 AM'], ['#1038', '₹196', '9:12 AM']].map((bill, i) => <button className="bill-row" key={bill[0]}><span className={`basket-dot ${['red', 'yellow', 'blue', 'green'][i]}`}/><div><strong>{bill[0]}</strong><span>{bill[2]} · {i % 2 ? t('upi') : t('cash')}</span></div><strong>{bill[1]}</strong><Icon name="chevron"/></button>)}
    </div>
  </div>
}

function StockScreen({ t, language }: { t: (key: CopyKey) => string; language: Language }) {
  const stockLevels = [[31, 40], [38, 40], [24, 50], [12, 40], [18, 30], [17, 30], [16, 25], [15, 25], [14, 25], [13, 20], [12, 25], [11, 20], [10, 20], [9, 15], [8, 15], [7, 15], [6, 20], [5, 15], [4, 15], [3, 10]] as const
  const data = vegetables.map((veg, index) => ({ veg, kg: stockLevels[index][0], total: stockLevels[index][1] })).sort((a, b) => b.kg - a.kg)
  const lowStock = data.filter(({ kg }) => kg <= 10)
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">{t('today')}</span><h1>{t('stock')}</h1></div></div>
    <div className="metric-card"><span>{t('dailySales')}</span><strong>₹8,460</strong><small>126 kg {t('soldToday')}</small><SalesGraphic label={t('monthlyTrend')}/></div>
    <section className="running-low-section"><div className="section-title"><h2>{t('runningLow')}</h2><span>{lowStock.length}</span></div><div className="low-grid">
      {lowStock.map(({ veg, kg }) => <div key={veg.id}><span><VegIcon id={veg.id}/></span><strong>{veg[language]}</strong><small>{kg} kg {t('left')}</small></div>)}
    </div></section>
    <section><div className="section-title"><h2>{t('vegetableTotals')}</h2></div><div className="vegetable-total-grid">
      {data.map(({ veg, kg, total }) => {
        const percentage = Math.round((kg / total) * 100)
        return <div className="vegetable-total-card" key={veg.id}>
          <span className="veg-icon"><VegIcon id={veg.id}/></span>
          <div className="vegetable-total-copy"><strong>{veg[language]}</strong><span>{kg}/{total} kg</span></div>
          <div className="total-ring" style={{ '--progress': `${percentage}%` } as CSSProperties}><span>{percentage}%</span></div>
        </div>
      })}
    </div></section>
  </div>
}

function BasketsScreen({ t, language, openPair }: { t: (key: CopyKey) => string; language: Language; openPair: () => void }) {
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">{t('connected')}</span><h1>{t('manageBaskets')}</h1></div></div>
    <ActionButton icon="plus" onClick={openPair}>{t('pairNew')}</ActionButton>
    <div className="manage-list">
      {baskets.map((basket, index) => <button className="manage-row" key={basket.id}>
        <span className={`basket-swatch band-${basket.id}`}><Icon name="basket"/></span>
        <div><strong>{basket.name[language]} {t('basket')}</strong><span className={index === 4 ? 'offline-text' : ''}>{index === 4 ? t('offline') : t('online')}</span></div>
        <span className="battery-value"><Icon name="battery"/>{[88, 76, 61, 52, 34, 90][index]}%</span>
        <Icon name="chevron"/>
      </button>)}
    </div>
    <div className="offline-note"><Icon name="wifi"/><p>{t('reconnecting')}</p></div>
  </div>
}

function PairScreen({ t, language, goBack, finish, onHelp }: { t: (key: CopyKey) => string; language: Language; goBack: () => void; finish: () => void; onHelp: () => void }) {
  const [step, setStep] = useState(1)
  return <div className="detail-layout pair-page">
    <Header title={t('pairNew')} onBack={goBack} onHelp={onHelp}/>
    <main className="detail-content">
      <div className="step-progress">{[1, 2, 3].map((num) => <span key={num} className={num <= step ? 'active' : ''}/>)}</div>
      <p className="eyebrow center">{t('step')} {step} / 3</p>
      {step === 1 && <div className="pair-content"><div className="basket-illustration"><Icon name="basket" size={64}/><i/></div><h1>{t('switchOn')}</h1><p>{t('switchHint')}</p></div>}
      {step === 2 && <div className="pair-content"><h1>{t('chooseColour')}</h1><p>{t('chooseColourHint')}</p><div className="colour-grid">{pairingColors.map((color) => <button key={color.id} className={`colour-choice band-${color.id}`} onClick={() => setStep(3)}><Icon name="basket"/><span>{color.name[language]}</span></button>)}</div></div>}
      {step === 3 && <div className="pair-content"><div className="success-mark"><Icon name="check" size={36}/></div><h1>{t('paired')}</h1><p>{t('pairedHint')}</p></div>}
    </main>
    <div className="bottom-action"><ActionButton onClick={() => step < 3 ? setStep(step + 1) : finish()}>{step === 1 ? t('basketOn') : step === 2 ? t('confirm') : t('done')}</ActionButton></div>
  </div>
}

function SettingsScreen({
  t,
  theme,
  setTheme,
  voiceReplies,
  setVoiceReplies,
  navigate,
}: {
  t: (key: CopyKey) => string
  theme: Theme
  setTheme: (theme: Theme) => void
  voiceReplies: boolean
  setVoiceReplies: (value: boolean) => void
  navigate: (screen: Screen) => void
}) {
  return <div className="page">
    <div className="page-head"><div><h1>{t('settings')}</h1></div></div>
    <div className="shop-card"><div className="shop-avatar"><Icon name="shop" size={30}/></div><div><strong>Mahalaxmi Fresh Vegetables</strong><span>Ravi Patil · Pune Mandi</span></div><button onClick={() => navigate('profile')}><Icon name="chevron"/></button></div>
    <div className="settings-group">
      <button onClick={() => navigate('prices')}><span className="setting-icon"><Icon name="price"/></span><div><strong>{t('priceSettings')}</strong><span>4 vegetables</span></div><Icon name="chevron"/></button>
      <button onClick={() => navigate('languages')}><span className="setting-icon"><Icon name="language"/></span><div><strong>{t('language')}</strong><span>English · हिन्दी · मराठी</span></div><Icon name="chevron"/></button>
    </div>
    <div className="settings-group">
      <div className="setting-static"><span className="setting-icon">{theme === 'light' ? <Icon name="sun"/> : <Icon name="moon"/>}</span><div><strong>{t('appearance')}</strong><span>{theme === 'light' ? t('light') : t('dark')}</span></div><div className="segmented"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><Icon name="sun" size={18}/></button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><Icon name="moon" size={18}/></button></div></div>
      <div className="setting-static"><span className="setting-icon"><Icon name="speaker"/></span><div><strong>{t('voiceReplies')}</strong><span>{voiceReplies ? t('online') : t('offline')}</span></div><button className={`toggle ${voiceReplies ? 'on' : ''}`} onClick={() => setVoiceReplies(!voiceReplies)}><i/></button></div>
    </div>
  </div>
}

function PricesScreen({ t, language, goBack, onHelp, openVoice }: { t: (key: CopyKey) => string; language: Language; goBack: () => void; onHelp: () => void; openVoice: (kind: 'price', setter: (value: string) => void) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(vegetables.map((vegetable) => [vegetable.id, String(vegetable.price)])))
  const [saved, setSaved] = useState(false)
  return <div className="detail-layout">
    <Header title={t('priceSettings')} onBack={goBack} onHelp={onHelp}/>
    <main className="detail-content">
      <p className="secondary">{t('setupHint')}</p>
      <div className="price-list">{vegetables.map((veg) => <div className="price-row" key={veg.id}><span className="veg-icon"><VegIcon id={veg.id}/></span><div className="price-name"><strong>{veg[language]}</strong><span>{t('perKg')}</span></div><div className="compact-field"><span>₹</span><input value={values[veg.id]} onChange={(e) => setValues({ ...values, [veg.id]: e.target.value })}/><button onClick={() => openVoice('price', (value) => setValues({ ...values, [veg.id]: value.replace(/\D/g, '') }))}><Icon name="mic"/></button></div></div>)}</div>
      {saved && <div className="saved-note"><Icon name="check"/>{t('saved')}</div>}
    </main>
    <div className="bottom-action"><ActionButton onClick={() => setSaved(true)}>{t('save')}</ActionButton></div>
  </div>
}

function LanguageScreen({ t, language, setLanguage, goBack, onHelp }: { t: (key: CopyKey) => string; language: Language; setLanguage: (language: Language) => void; goBack: () => void; onHelp: () => void }) {
  return <div className="detail-layout"><Header title={t('language')} onBack={goBack} onHelp={onHelp}/><main className="detail-content"><LanguageChoices language={language} setLanguage={setLanguage}/></main><div className="bottom-action"><ActionButton onClick={goBack}>{t('done')}</ActionButton></div></div>
}

function ProfileScreen({ t, goBack, onHelp, openVoice }: { t: (key: CopyKey) => string; goBack: () => void; onHelp: () => void; openVoice: (kind: 'shop', setter: (value: string) => void) => void }) {
  const [shop, setShop] = useState('Mahalaxmi Fresh Vegetables')
  const [owner, setOwner] = useState('Ravi Patil')
  return <div className="detail-layout"><Header title={t('shopProfile')} onBack={goBack} onHelp={onHelp}/><main className="detail-content profile-fields"><div className="shop-avatar large"><Icon name="shop" size={36}/></div><VoiceField label={t('shopName')} value={shop} onChange={setShop} onMic={() => openVoice('shop', setShop)}/><VoiceField label={t('ownerName')} value={owner} onChange={setOwner} onMic={() => openVoice('shop', setOwner)}/></main><div className="bottom-action"><ActionButton onClick={goBack}>{t('save')}</ActionButton></div></div>
}

function DisplayScreen() {
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinedSessionId, setJoinedSessionId] = useState<string | null>(null)
  const [baskets, setBaskets] = useState<DisplayBasket[]>([])
  const [items, setItems] = useState<DisplayBasketItem[]>([])
  const [dataError, setDataError] = useState<string | null>(null)

  const joinSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = joinCode.trim()
    if (!code) {
      setJoinError('Enter a join code.')
      return
    }

    setIsJoining(true)
    setJoinError(null)
    setJoinedSessionId(null)
    setBaskets([])
    setItems([])
    setDataError(null)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setJoinError(sessionError.message)
        return
      }

      if (!sessionData.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
        if (signInError) {
          setJoinError(signInError.message)
          return
        }
        if (!signInData.session) {
          setJoinError('Anonymous sign-in did not return a session.')
          return
        }
      }

      const { data, error } = await supabase.rpc('join_display_session', { p_join_code: code })
      if (error) {
        setJoinError(error.message)
        return
      }

      const result = (Array.isArray(data) ? data[0] : data) as DisplayJoinResult | null
      if (!result || typeof result !== 'object' || typeof result.status !== 'string') {
        setJoinError('The server returned an invalid join response.')
        return
      }

      if (result.status === 'invalid_code') {
        setJoinError('That join code is invalid or has expired.')
      } else if (result.status === 'locked') {
        setJoinError(`Too many attempts. Try again in ${result.retry_after_seconds} seconds.`)
      } else if (result.status === 'controller_cannot_join') {
        setJoinError('The vendor device cannot join its own display session.')
      } else if (result.status === 'joined' && typeof result.joined_session_id === 'string') {
        setJoinCode('')
        setJoinedSessionId(result.joined_session_id)
      } else {
        setJoinError('The server returned an unexpected join status.')
      }
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Unable to join display session.')
    } finally {
      setIsJoining(false)
    }
  }

  useEffect(() => {
    if (!joinedSessionId) return

    let active = true
    let subscribedBasketIds = ''
    let itemChannels: ReturnType<typeof supabase.channel>[] = []
    const removeItemChannels = async () => {
      const previousChannels = itemChannels
      itemChannels = []
      subscribedBasketIds = ''
      await Promise.all(previousChannels.map((channel) => supabase.removeChannel(channel)))
    }

    const subscribeToBasketItems = async (basketIds: string[]) => {
      const nextBasketIds = [...basketIds].sort().join(',')
      if (nextBasketIds === subscribedBasketIds) return

      await removeItemChannels()
      if (!active || !nextBasketIds) return

      subscribedBasketIds = nextBasketIds
      itemChannels = basketIds.map((basketId) => supabase
        .channel(`display-items-${joinedSessionId}-${basketId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'basket_items',
          filter: `basket_id=eq.${basketId}`,
        }, () => { void refreshDisplayData() })
        .subscribe((status, error) => {
          if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
            setDataError(error?.message ?? 'Realtime connection failed.')
          }
        }))
    }

    const refreshDisplayData = async () => {
      try {
        const { data: basketData, error: basketError } = await supabase
          .from('baskets')
          .select('id, color, running_total, updated_at')
          .eq('session_id', joinedSessionId)
          .order('color')
        if (basketError) throw basketError
        const nextBaskets = (basketData ?? []) as DisplayBasket[]
        await subscribeToBasketItems(nextBaskets.map(({ id }) => id))

        let nextItems: DisplayBasketItem[] = []
        if (nextBaskets.length > 0) {
          const { data: itemData, error: itemError } = await supabase
            .from('basket_items')
            .select('id, basket_id, produce_name, weight_kg, rate_per_kg, item_price, display_order')
            .in('basket_id', nextBaskets.map((basket) => basket.id))
            .order('display_order')
          if (itemError) throw itemError
          nextItems = (itemData ?? []) as DisplayBasketItem[]
        }

        if (!active) return
        setBaskets(nextBaskets)
        setItems(nextItems)
        setDataError(null)
      } catch (error) {
        if (active) {
          setDataError(error instanceof Error ? error.message : 'Unable to load display data.')
        }
      }
    }

    const channel = supabase
      .channel(`display-session-${joinedSessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'baskets',
        filter: `session_id=eq.${joinedSessionId}`,
      }, () => { void refreshDisplayData() })
      .subscribe((status, error) => {
        if (active && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
          setDataError(error?.message ?? 'Realtime connection failed.')
        }
      })

    void refreshDisplayData()
    return () => {
      active = false
      void supabase.removeChannel(channel)
      void removeItemChannels()
    }
  }, [joinedSessionId])

  return <main className="display-screen">
    <div className="display-content">
      <header className="display-header">
        <span className="eyebrow">Sabzi Basket</span>
        <h1>Display</h1>
        <p>Join the vendor’s active session to view baskets live.</p>
      </header>
      {!joinedSessionId && <form className="display-join-form" onSubmit={joinSession}>
        <label htmlFor="display-join-code">Join code</label>
        <input
          id="display-join-code"
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value)}
          autoComplete="one-time-code"
          autoCapitalize="characters"
          disabled={isJoining}
          aria-describedby={joinError ? 'display-join-error' : undefined}
        />
        <ActionButton disabled={isJoining}>{isJoining ? 'Joining...' : 'Join'}</ActionButton>
        {joinError && <p className="display-error" id="display-join-error" role="alert">{joinError}</p>}
      </form>}
      {joinedSessionId && <>
        <div className="display-live-status" role="status">Connected to live display</div>
        {dataError && <p className="display-error" role="alert">{dataError}</p>}
        {baskets.length === 0 && !dataError && <p className="display-empty">No baskets are available in this session yet.</p>}
        <div className="display-basket-grid">
          {baskets.map((basket) => {
            const basketItems = items.filter((item) => item.basket_id === basket.id)
            return <section className="display-basket-card" key={basket.id}>
              <header className={`display-basket-header band-${basket.color}`}>
                <h2>{basket.color} basket</h2>
                <strong>₹{Number(basket.running_total).toFixed(2)}</strong>
              </header>
              <ul>
                {basketItems.map((item) => <li key={item.id}>
                  <span>{item.produce_name}</span>
                  <span>{Number(item.weight_kg).toFixed(3)} kg × ₹{Number(item.rate_per_kg).toFixed(2)}/kg</span>
                  <strong>₹{Number(item.item_price).toFixed(2)}</strong>
                </li>)}
                {basketItems.length === 0 && <li className="display-empty-item">No items yet</li>}
              </ul>
            </section>
          })}
        </div>
      </>}
    </div>
  </main>
}

export default function App() {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('sabzi-language') as Language) || 'en')
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('sabzi-theme') as Theme) || 'light')
  const [screen, setScreen] = useState<Screen>('splash')
  const [appMode, setAppMode] = useState<'vendor' | 'display'>('vendor')
  const [tab, setTab] = useState<Tab>('live')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantIntroduced, setAssistantIntroduced] = useState(false)
  const [voiceReplies, setVoiceReplies] = useState(true)
  const [voice, setVoice] = useState<{ kind: 'phone' | 'price' | 'shop' | 'search' | 'message'; setter: (value: string) => void } | null>(null)
  const [payment, setPayment] = useState<'cash' | 'upi'>('cash')
  const [selectedBasketId, setSelectedBasketId] = useState<BasketId>('blue')
  const [isCreatingDisplaySession, setIsCreatingDisplaySession] = useState(false)
  const [displaySession, setDisplaySession] = useState<CreatedDisplaySession | null>(null)
  const [displaySessionError, setDisplaySessionError] = useState<string | null>(null)
  const [persistedBaskets, setPersistedBaskets] = useState<DisplayBasket[]>([])
  const [persistedItems, setPersistedItems] = useState<DisplayBasketItem[]>([])
  const [persistenceError, setPersistenceError] = useState<string | null>(null)
  const t = useMemo(() => (key: CopyKey) => copy[language][key], [language])
  const setLanguage = (next: Language) => {
    setLanguageState(next)
    localStorage.setItem('sabzi-language', next)
  }
  const setTheme = (next: Theme) => {
    setThemeState(next)
    localStorage.setItem('sabzi-theme', next)
  }
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language
  }, [theme, language])
  const openVoice = (kind: 'phone' | 'price' | 'shop' | 'search' | 'message', setter: (value: string) => void) => setVoice({ kind, setter })
  const ensureAuthenticatedSession = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (sessionData.session) return

    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
    if (signInError) throw signInError
    if (!signInData.session) throw new Error('Anonymous sign-in did not return a session.')
  }
  const skipOnboardingToVendor = async () => {
    await ensureAuthenticatedSession()
    setAppMode('vendor')
    setTab('live')
    setScreen('main')
  }
  const createDisplaySession = async () => {
    setIsCreatingDisplaySession(true)
    setDisplaySession(null)
    setDisplaySessionError(null)
    setPersistenceError(null)
    setPersistedBaskets([])
    setPersistedItems([])
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setDisplaySessionError(sessionError.message)
        return
      }

      if (!sessionData.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
        if (signInError) {
          setDisplaySessionError(signInError.message)
          return
        }
        if (!signInData.session) {
          setDisplaySessionError('Anonymous sign-in did not return a session.')
          return
        }
      }

      const { data, error } = await supabase.rpc("create_display_session")
      if (error) {
        setDisplaySessionError(error.message)
        return
      }

      const result = Array.isArray(data) ? data[0] : data
      if (!result || typeof result !== 'object') {
        setDisplaySessionError('The server returned an invalid display session.')
        return
      }

      const session = result as Record<string, unknown>
      if (typeof session.session_id !== 'string' || typeof session.join_code !== 'string' || typeof session.expires_at !== 'string') {
        setDisplaySessionError('The server returned an incomplete display session.')
        return
      }

      const createdSession: CreatedDisplaySession = {
        session_id: session.session_id,
        join_code: session.join_code,
        expires_at: session.expires_at,
      }
      setDisplaySession(createdSession)

      const { baskets: sessionBaskets } = await loadVendorSessionData(createdSession.session_id)
      const basketIdsByColor = new Map(sessionBaskets.map(({ color, id }) => [color, id]))
      const initialRows = baskets.flatMap((basket) => {
        const basketId = basketIdsByColor.get(basket.id)
        if (!basketId) {
          throw new Error(`The session is missing the ${basket.id} basket.`)
        }
        return basketItems[basket.id].map((item, index) => ({
          basket_id: basketId,
          produce_name: getVegetable(item.vegId).en,
          weight_kg: Number(item.weight),
          rate_per_kg: item.price,
          display_order: index,
        }))
      })

      if (initialRows.length > 0) {
        const { error: seedError } = await supabase.from('basket_items').insert(initialRows)
        if (seedError) throw seedError
      }

      const syncedData = await loadVendorSessionData(createdSession.session_id)
      setPersistedBaskets(syncedData.baskets)
      setPersistedItems(syncedData.items)
    } catch (error) {
      setPersistenceError(error instanceof Error ? error.message : 'Unable to persist vendor basket data.')
    } finally {
      setIsCreatingDisplaySession(false)
    }
  }
  const refreshVendorSession = async () => {
    if (!displaySession) return
    const data = await loadVendorSessionData(displaySession.session_id)
    setPersistedBaskets(data.baskets)
    setPersistedItems(data.items)
  }
  const removeVendorItem = async (item: VendorItem) => {
    if (!displaySession) return
    setPersistenceError(null)
    const { error } = await supabase.from('basket_items').delete().eq('id', item.id)
    if (error) {
      setPersistenceError(error.message)
      throw error
    }
    try {
      await refreshVendorSession()
    } catch (error) {
      setPersistenceError(error instanceof Error ? error.message : 'Unable to refresh vendor basket data.')
      throw error
    }
  }
  const restoreVendorItem = async (item: VendorItem) => {
    if (!displaySession) return
    setPersistenceError(null)
    const basket = persistedBaskets.find(({ color }) => color === selectedBasketId)
    if (!basket) {
      const error = new Error(`The session is missing the ${selectedBasketId} basket.`)
      setPersistenceError(error.message)
      throw error
    }
    const order = persistedItems.filter(({ basket_id }) => basket_id === basket.id).length
    const { error } = await supabase.from('basket_items').insert({
      basket_id: basket.id,
      produce_name: item.name,
      weight_kg: Number(item.weight),
      rate_per_kg: item.price,
      display_order: order,
    })
    if (error) {
      setPersistenceError(error.message)
      throw error
    }
    try {
      await refreshVendorSession()
    } catch (error) {
      setPersistenceError(error instanceof Error ? error.message : 'Unable to refresh vendor basket data.')
      throw error
    }
  }
  const addVendorItem = async (vegetable: typeof vegetables[number], quantityKg: number, activeSessionId: string, selectedBasketDatabaseId: string) => {
    if (!displaySession || displaySession.session_id !== activeSessionId) {
      const error = new Error('Create a display session before adding persisted basket items.')
      setPersistenceError(error.message)
      throw error
    }
    if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
      const error = new Error('Quantity must be greater than zero kg.')
      setPersistenceError(error.message)
      throw error
    }
    const basket = persistedBaskets.find(({ id, color, session_id }) =>
      id === selectedBasketDatabaseId && color === selectedBasketId && session_id === activeSessionId)
    if (!basket) {
      const error = new Error(`The active session is missing the ${selectedBasketId} basket.`)
      setPersistenceError(error.message)
      throw error
    }

    setPersistenceError(null)
    console.info('[Vendor] Add vegetable target', {
      sessionId: activeSessionId,
      selectedBasketId,
      basketDatabaseId: basket.id,
    })
    const displayOrder = persistedItems.filter(({ basket_id }) => basket_id === basket.id).length
    const { error } = await supabase.from('basket_items').insert({
      basket_id: basket.id,
      produce_name: vegetable.en,
      weight_kg: quantityKg,
      rate_per_kg: vegetable.price,
      display_order: displayOrder,
    })
    if (error) {
      console.error('[Vendor] Add vegetable insert error', error.message)
      setPersistenceError(error.message)
      throw error
    }

    try {
      await refreshVendorSession()
    } catch (error) {
      const refreshError = new Error(error instanceof Error ? error.message : 'Unable to refresh vendor basket data.')
      setPersistenceError(refreshError.message)
      throw refreshError
    }
  }
  const finishBill = () => {
    setScreen('main')
    setTab('live')
  }
  const selectedTemplate = baskets.find((basket) => basket.id === selectedBasketId)!
  const selectedStoredBasket = displaySession
    ? persistedBaskets.find(({ color, session_id }) => color === selectedBasketId && session_id === displaySession.session_id)
    : undefined
  const selectedVendorItems = displaySession
    ? toVendorItems(persistedItems.filter(({ basket_id }) => basket_id === selectedStoredBasket?.id))
    : getInitialVendorItems(selectedBasketId)
  const selectedBasket: BasketView = displaySession && selectedStoredBasket
    ? {
      ...selectedTemplate,
      state: selectedVendorItems.length ? 'active' : 'waiting',
      items: selectedVendorItems.length,
      weight: selectedVendorItems.reduce((total, item) => total + Number(item.weight), 0).toFixed(1),
      amount: Number(selectedStoredBasket.running_total),
      vegIds: selectedVendorItems.flatMap(({ vegId }) => vegId ? [vegId] : []),
    }
    : selectedTemplate
  const showNav = screen === 'main' && appMode === 'vendor'
  return <div className="app-shell">
    {screen === 'splash' && <SplashScreen t={t} onDone={() => setScreen('language')}/>}
    {screen === 'intro' && <IntroScreen t={t} onDone={() => setScreen('login')}/>}
    {(['language', 'login', 'otp', 'setup'] as Screen[]).includes(screen) && <Onboarding screen={screen} setScreen={setScreen} language={language} setLanguage={setLanguage} t={t} openVoice={openVoice} onSkipForNow={skipOnboardingToVendor}/>}
    {screen === 'main' && appMode === 'vendor' && <main className="main-with-nav">
      {tab === 'live' && <LiveScreen t={t} language={language} openDetail={(basketId) => { setSelectedBasketId(basketId); setScreen('detail') }} createDisplaySession={createDisplaySession} isCreatingDisplaySession={isCreatingDisplaySession} displaySession={displaySession} displaySessionError={displaySessionError} persistedBaskets={persistedBaskets} persistedItems={persistedItems} persistenceError={persistenceError}/>}
      {tab === 'billing' && <BillingScreen t={t}/>}
      {tab === 'stock' && <StockScreen t={t} language={language}/>}
      {tab === 'baskets' && <BasketsScreen t={t} language={language} openPair={() => setScreen('pair')}/>}
      {tab === 'settings' && <SettingsScreen t={t} theme={theme} setTheme={setTheme} voiceReplies={voiceReplies} setVoiceReplies={setVoiceReplies} navigate={setScreen}/>}
    </main>}
    {screen === 'main' && appMode === 'display' && <DisplayScreen/>}
    {screen === 'detail' && <DetailScreen t={t} language={language} basket={selectedBasket} items={selectedVendorItems} goBack={() => setScreen('main')} goBill={() => setScreen('summary')} onHelp={() => setAssistantOpen(true)} openVoice={openVoice} onRemoveItem={displaySession ? removeVendorItem : undefined} onRestoreItem={displaySession ? restoreVendorItem : undefined} onAddItem={addVendorItem} onCreateSession={createDisplaySession} isCreatingSession={isCreatingDisplaySession} activeSessionId={displaySession?.session_id ?? null} selectedBasketDatabaseId={selectedStoredBasket?.id ?? null} sessionError={displaySessionError} persistenceError={persistenceError}/>}
    {screen === 'summary' && <SummaryScreen t={t} language={language} basket={selectedBasket} items={selectedVendorItems} goBack={() => setScreen('detail')} goReceipt={(method) => { setPayment(method); setScreen('receipt') }} onHelp={() => setAssistantOpen(true)}/>}
    {screen === 'receipt' && <ReceiptScreen t={t} language={language} basket={selectedBasket} items={selectedVendorItems} payment={payment} finish={finishBill} onHelp={() => setAssistantOpen(true)}/>}
    {screen === 'pair' && <PairScreen t={t} language={language} goBack={() => setScreen('main')} finish={() => setScreen('main')} onHelp={() => setAssistantOpen(true)}/>}
    {screen === 'prices' && <PricesScreen t={t} language={language} goBack={() => setScreen('main')} onHelp={() => setAssistantOpen(true)} openVoice={openVoice}/>}
    {screen === 'languages' && <LanguageScreen t={t} language={language} setLanguage={setLanguage} goBack={() => setScreen('main')} onHelp={() => setAssistantOpen(true)}/>}
    {screen === 'profile' && <ProfileScreen t={t} goBack={() => setScreen('main')} onHelp={() => setAssistantOpen(true)} openVoice={openVoice}/>}
    {screen === 'main' && <nav className="mode-switch" aria-label="Choose screen">
      <button type="button" className={appMode === 'vendor' ? 'active' : ''} aria-pressed={appMode === 'vendor'} onClick={() => setAppMode('vendor')}>Vendor</button>
      <button type="button" className={appMode === 'display' ? 'active' : ''} aria-pressed={appMode === 'display'} onClick={() => setAppMode('display')}>Display</button>
    </nav>}
    {showNav && <FloatingNav tab={tab} setTab={setTab} t={t} onAsk={() => setAssistantOpen(true)}/>}
    {assistantOpen && <AssistantSheet t={t} tab={tab} introduced={assistantIntroduced} setIntroduced={setAssistantIntroduced} onClose={() => setAssistantOpen(false)} onNavigate={setScreen}/>}
    {voice && <VoiceOverlay t={t} kind={voice.kind} onClose={() => setVoice(null)} onConfirm={(value) => { voice.setter(value); setVoice(null) }}/>}
  </div>
}
