/************************************************
**
**  Marketo Better Validation 2.0
**
**  This script requires jQuery,
**  because some API callbacks return a jQuery object
*************************************************/

/*
** Initialization & debugging
************************************************/
var MBV = {};
MBV.Debugging = true;

if(window.location.hash && window.location.hash.length && window.location.hash.indexOf("#debug") > -1) MBV.Debugging = true;

MBV.form;

// MBV Entry point
MBV.Init = function() {
  // if jQuery is loaded properly, this function gets overwritten later in the script
  MBV.Debug("jQuery needs to be loaded before this script is ran");
};

MBV.Debug = function(message) {
  if(!MBV.Debugging) return;
  console.log(message);
};

// Translations
// These will override the Marketo defaults
MBV.Messages = {
  English : {
    required : "This field is required",
    selectRequired : "Please select a value for this field",
    emailInvalid : "Please enter a valid email address",
    telephoneInvalid : "Please, enter a valid phone number",
    pleaseWait : "Please wait",
    nameInvalid: "Please, enter a valid name",
    postalInvalid: "Please, enter a valid postal code",
    noFreeEmail: "Please, enter a valid business email (no free email addresses)",
    noVulgarity: "No vulgarity please",
    submit: "Submit",
    clear: "Clear"
  },
  French : {
    required : "Ce champ est requis",
    selectRequired : "SÃ©lectionnez une valeur pour ce champ",
    emailInvalid : "Entrez une adresse e-mail valide",
    telephoneInvalid : "Entrez un numÃ©ro de tÃ©lÃ©phone valide",
    pleaseWait : "Veuillez patienter",
    nameInvalid: "Entrez SVP un nom valide",
    postalInvalid: "Entrez SVP un code postal valide",
    noFreeEmail: "Entrez SVP un email professionnel",
    noVulgarity: "Pas de vulgaritÃ© SVP",
    submit: "Valider",
    clear: "Annuler"
  },
  German : {
    required : "Bitte fÃ¼llen Sie das Pflichtfeld aus",
    selectRequired : "Bitte wÃ¤hlen Sie einen Wert fÃ¼r dieses Feld aus",
    emailInvalid : "Bitte geben Sie eine gÃ¼ltige E-Mail-Adresse ein",
    telephoneInvalid : "Bitte geben Sie eine gÃ¼ltige Telefonnummer ein",
    pleaseWait : "Bitte warten",
    nameInvalid: "Bitte geben Sie einen gÃ¼ltigen Namen ein",
    postalInvalid: "Bitte geben Sie eine gÃ¼ltige PLZ ein",
    noFreeEmail: "Bitte geben Sie eine gÃ¼ltige GeschÃ¤fts-E-Mail-Adresse ein",
    noVulgarity: "Keine unsinnigen Angaben bitte",
    submit: "Absenden",
    clear: "Enterfernen"
  },
  Japanese : {
    required : "å…¥åŠ›ã‚’å¿…è¦ã¨ã™ã‚‹é …ç›®ã§ã™ã€‚",
    selectRequired : "é¸æŠžã‚’å¿…è¦ã¨ã™ã‚‹é …ç›®ã§ã™ã€‚",
    emailInvalid : "ç¢ºå®Ÿã«é€£çµ¡ã®ã¨ã‚Œã‚‹ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„ã€‚",
    telephoneInvalid : "é›»è©±ç•ªå·ã‚’å…¥åŠ›ã—ã¦ä¸‹ã•ã„ã€‚",
    pleaseWait : "ã—ã°ã‚‰ããŠå¾…ã¡ãã ã•ã„ã€‚",
    nameInvalid: "æ­£å¼ãªåå‰ã‚’å…¥åŠ›ã—ã¦ä¸‹ã•ã„ã€‚",
    postalInvalid: "æ­£ã—ã„éƒµä¾¿ç•ªå·ã‚’å…¥åŠ›ã—ã¦ä¸‹ã•ã„ã€‚",
    noFreeEmail: "æ­£ã—ã„ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã‚’å…¥åŠ›ã—ã¦ä¸‹ã•ã„ã€‚ï¼ˆYahooãªã©ã®ãƒ•ãƒªãƒ¼ãƒ¡ãƒ¼ãƒ«ã‚’ä½¿ç”¨ã—ã¦ã„ã‚‹å ´åˆç™»éŒ²ã§ããªã„å¯èƒ½æ€§ãŒã‚ã‚Šã¾ã™ã€‚ï¼‰",
    noVulgarity: "ä¸ä½œæ³•ãªè¨€èªžã‚’ä½¿ç”¨ã—ãªã„ã§ä¸‹ã•ã„ã€‚",
    submit: "ç”³è¾¼ã‚€",
    clear: "ãƒªã‚»ãƒƒãƒˆ"
  }
};

// if(typeof jQuery == 'undefined') {
//   MBV.Debug('jQuery not Loaded');
// } else {
//   MBV.Debug('jQuery loaded');
// }

/*
** Input types
** This defines what tests each type must pass
************************************************/

MBV.Types = {
  name: {
    minimumLength: {length: 2, message: 'nameInvalid'},
    afterLowerCase: {
      tests: {
        // Must have a vowel
        //matchPattern: {pattern: '[aeiouy]', message: 'nameInvalid'},
        // Key red flags
        noMatchPattern: {
          message: 'nameInvalid',
          pattern: 'test|ddd|sss|fff|sfdgh|sdfg|asdf|assdf|asddf|kjlj|ljds|asssd|lkjasd|lkasd|alksdd|mickeymouse|cucu\.com|azerty|qwerty|blabla|bobleponge|biloute|toto|bobsainclair|dontspamme|dontcallme|blabla|enfoire|trucbidule|danstoncul|trololo|@non\.fr|@noname\.fr|@nocompany\.com|@nomail\.com|@noreply\.com|rienafoutre|taratata|toto'
        },
        noMatchPattern: {
          message: 'noVulgarity',
          pattern: 'fuck|([^aeiou]|^)shit|bitch|damnit|goddamn|dammit|bastard|cocksuck|dumbass|pussy|whore|asshole|asshat|asslick|assmonkey|assmunch|asspirate|balllick|ballsack|boobs[^et]|boobies|booby|clitoris|dickhead|faggot|handjob|homosexual|horny([^aeiou]|$)|jackoff|masterbat|masturbat|niggah|nigger|([^aeiou]|^)penis|pissoff|poop([^aeious]|$)|pooper|retard|testicle|titty|titties|vagina'
        },
        noRepeatingPatterns: [
          // abcabcabc
          {length:3, count:3, message: 'nameInvalid'},
          // dededede
          {length:2, count:4, message: 'nameInvalid'}
        ]
      }
    }
  },
  phone: {
    minimumDigits: {length: 5, message: 'phoneInvalid'},
    onlyPhoneFormattingChars: {message: 'phoneInvalid'},
    afterRemovingNonNumbers: {
      tests: {
        noConsecutiveNumbers: {length: 5, message: 'phoneInvalid'},
        noMatchPattern: [
          {pattern: '12345', message: 'phoneInvalid'},
          {pattern: '121212', message: 'phoneInvalid'},
          {pattern: '232323', message: 'phoneInvalid'},
          {pattern: '343434', message: 'phoneInvalid'},
          {pattern: '454545', message: 'phoneInvalid'},
          {pattern: '565656', message: 'phoneInvalid'},
          {pattern: '676767', message: 'phoneInvalid'},
          {pattern: '787878', message: 'phoneInvalid'},
          {pattern: '898989', message: 'phoneInvalid'}
        ]
      }
    }
  },
  email: {
    mustEndInTLD: {message: 'emailInvalid'},
    // Must have a @
    matchPattern: {pattern: '@', message: 'emailInvalid'},
    afterLowerCase: {
      tests: {
        // Must have a vowel before the @
        //matchPattern: {pattern: '[aeiouy].*@', message: 'emailInvalid'},
        // No free emails (uncomment to activate)
        domainNotIn: {
          message: 'noYopMail',
          domains: ["yopmail", "informatica", "syncsort", "pentaho", "oracle", "mulesoft", "adeptia", "altova", "intelcom", "jitterbit", "pervasive", "progress", "redhat", "sap", "sas-automotive", "sas-com", "sas-tartarin", "sas", "SAS2THEMAX", "SASA", "sasaki", "SASCHA", "sascl", "sasco", "sasdesign", "sashco", "sashuk", "sasiadeks", "SASINC", "sasint", "sasit", "sassafety", "softwareag", "snaplogic", "tibco"]
        },
        // Key red flags
        noMatchPattern: {
          message: 'emailInvalid',
          pattern: 'test|ddd|sss|fff|sfdgh|sdfg|asdf|assdf|asddf|kjlj|ljds|asssd|lkjasd|lkasd|alksdd|mickeymouse|fuck|shit|cucu\.com|azerty|qwerty|blabla|bobleponge|biloute|toto|bobsainclair|dontspamme|dontcallme|blabla|enfoire|trucbidule|danstoncul|trololo|@non\.fr|@noname\.fr|@nocompany\.com|@nomail\.com|@noreply\.com|rienafoutre|taratata|toto'
        },
        noMatchPattern: {
          message: 'noVulgarity',
          pattern: 'fuck|([^aeiou]|^)shit|bitch|damnit|goddamn|dammit|bastard|cocksuck|dumbass|pussy|whore|asshole|asshat|asslick|assmonkey|assmunch|asspirate|balllick|ballsack|boobs[^et]|boobies|booby|clitoris|dickhead|faggot|handjob|homosexual|horny[^aeiou]|jackoff|masterbat|masturbat|niggah|nigger|([^aeiou]|^)penis|pissoff|poop[^aeious]|pooper|retard|testicle|titty|titties|vagina'
        },
        noRepeatingPatterns: [
          // abcabcabc
          {length:3, count:3, message: 'emailInvalid'},
          // dededede
          {length:2, count:4, message: 'emailInvalid'}
        ],
        // pig@pig.com
        userMustNotMatchDomain: {message: 'emailInvalid'}
      }
    },
    //webServiceIsEmailInfo: {message: 'emailInvalid'}
  },
  postalCode: {
    exceptForNewYork: {
      tests: {
        noMatchPattern: [
          {pattern: '12345', message: 'postalInvalid'}
        ]
      }
    },
    minimumLength: {message: 'postalInvalid', length: 3},
    //webServiceYahooPostalCode: {message: 'postalInvalid'}
    countrySpecificRegex: {message: 'postalInvalid'}
    //webServiceGooglePostalCode: {message: 'postalInvalid'}
  },
  company: {
    minimumLength: {message: 'companyInvalid', length: 1},
    mustHaveAlpha: {message: 'companyInvalid'},
  }
};

/*
** Tests
** @param any value This is the value of the form element
** @param object params (Validator object is automatically passed in as a parameter)
** @return bool|string Return true on success, false or error message on failure
************************************************/

MBV.Tests = {
  // Must have a certain amount of characters
  minimumLength: function(value, params) {
    if(typeof params != "object") params = {};
    if(!params['length']) params['length'] = 4;
    if(value.length < params['length']) return params.message ? params.message : false;
    return true;
  },
  // Must have a certain amount of numbers
  minimumDigits: function(value, params) {
    if(typeof params != "object") params = {};
    if(!params['length']) params['length'] = 10;
    var matches = value.match(/\d/g);
    if(matches && matches.length >= params['length']) return true;
    return params.message ? params.message : false;
  },
  // Must have at least one alphabet
  mustHaveAlpha: function(value, params) {
    if(typeof params != "object") params = {};
    params.pattern = '\d*[a-zA-Z][a-zA-Z0-9]*';
    return MBV.Tests.matchPattern(value, params);
  },
  // Must match a regular expression pattern
  // @param string pattern Regular expression pattern (required)
  matchPattern: function(value, params) {
    var pattern = new RegExp(params.pattern);
    if(pattern.test(value)) return true;
    return params.message ? params.message : false;
  },

  // Must not match a regular expression pattern
  // @param string pattern Regular expression pattern (required)
  noMatchPattern: function(value, params) {
    var pattern = new RegExp(params.pattern);
    if(!pattern.test(value)) return true;
    return params.message ? params.message : false;
  },

  // Searches for a consecutive repeating pattern
  // @param string pattern The pattern to search for (required)
  // @param int count (required)
  noConsecutiveRepeatingPattern: function(value, params) {
    var pattern = params.pattern;
    for(var i=1; i < params.count; i++)
      pattern = pattern + params.pattern;
    params.pattern = pattern;
    return MBV.Tests.noMatchPattern(value, params);
  },

  // @param length
  // @param count
  // fn('exampleabcabcabcabc', 3, 4) -> true
  // fn('exampleabcdabcdabcd', 4, 3) -> true
  // fn('exampleabcabcabcabc', 4, 3) -> false
  noRepeatingPatterns: function(value, params) {
    var i = 0;
    while(i < value.length - (params.length * params.count) - 1)
    {
      params.pattern = value.substr(i, params.length);
      var result = MBV.Tests.noConsecutiveRepeatingPattern(value, params);
      if(result !== true)
        return result;
      i++;
    }
    return true;
  },

  // Searches for 00000,11111,22222, etc
  // @param int length (default is 5)
  noConsecutiveNumbers: function(value, params) {
    if(typeof params != "object") params = {};
    if(!params['length']) params['length'] = 5;
    params.count = params['length'];

    for(var i=0; i<=9; i++)
    {
      params.pattern = i.toString();
      var result = MBV.Tests.noConsecutiveRepeatingPattern(value, params);
      if(result !== true)
        return result;
    }

    return true;
  },

  // Must have only numbers, and phone formatting chars ().+- and spaces
  onlyPhoneFormattingChars: function(value, params) {
    if(typeof params != "object") params = {};
    params.pattern = '^[0-9\(\)\.+ -]+$';
    return MBV.Tests.matchPattern(value, params);
  },

  mustEndInTLD: function(value, params) {
    //source: http://data.iana.org/TLD/tlds-alpha-by-domain.txt
    //# Version 2012061800, Last Updated Mon Jun 18 07:07:01 2012 UTC
    var tlds = ["AC","AD","AE","AERO","AF","AG","AI","AL","AM","AN","AO","AQ","AR","ARPA","AS","ASIA","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BIZ","BJ","BM","BN","BO","BR","BS","BT","BV","BW","BY","BZ","CA","CAT","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","COM","COOP","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EDU","EE","EG","ER","ES","ET","EU","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GOV","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","INFO","INT","IO","IQ","IR","IS","IT","JE","JM","JO","JOBS","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MIL","MK","ML","MM","MN","MO","MOBI","MP","MQ","MR","MS","MT","MU","MUSEUM","MV","MW","MX","MY","MZ","NA","NAME","NC","NE","NET","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","ORG","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PRO","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","ST","SU","SV","SX","SY","SZ","TC","TD","TEL","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TP","TR","TRAVEL","TT","TV","TW","TZ","UA","UG","UK","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","XN--0ZWM56D","XN--11B5BS3A9AJ6G","XN--3E0B707E","XN--45BRJ9C","XN--80AKHBYKNJ4F","XN--80AO21A","XN--90A3AC","XN--9T4B11YI5A","XN--CLCHC0EA0B2G2A9GCD","XN--DEBA0AD","XN--FIQS8S","XN--FIQZ9S","XN--FPCRJ9C3D","XN--FZC2C9E2C","XN--G6W251D","XN--GECRJ9C","XN--H2BRJ9C","XN--HGBK6AJ7F53BBA","XN--HLCJ6AYA9ESC7A","XN--J6W193G","XN--JXALPDLP","XN--KGBECHTV","XN--KPRW13D","XN--KPRY57D","XN--LGBBAT1AD8J","XN--MGBAAM7A8H","XN--MGBAYH7GPA","XN--MGBBH1A71E","XN--MGBC0A9AZCG","XN--MGBERP4A5D4AR","XN--O3CW4H","XN--OGBPF8FL","XN--P1AI","XN--PGBS0DH","XN--S9BRJ9C","XN--WGBH1C","XN--WGBL6A","XN--XKC2AL3HYE2A","XN--XKC2DL3A5EE0H","XN--YFRO4I67O","XN--YGBI2AMMX","XN--ZCKZAH","XXX","YE","YT","ZA","ZM","ZW"];
    var tldregex = /[@\.]([^\.]+)$/;
    var matches = tldregex.exec(value);
    if(matches === null || !matches.length || typeof matches[1] !== "string") return params.message ? params.message : false;
    var tld = matches[1].toUpperCase();
    if($.inArray(tld, tlds) > -1) return true;
    return params.message ? params.message : false;
  },

  userMustNotMatchDomain: function(value, params) {
    var pieces = value.split('@');
    if(pieces.length < 2) return true; // some other test will pick that up
    var domainpieces = pieces[1].split('.');
    if(!domainpieces.length) return true; // some other test will pick that up
    if(pieces[0] != domainpieces[0])
      return true;
    return params.message ? params.message : false;
  },

  // @param domains
  domainNotIn: function(value, params) {
    if(typeof params.domains === 'undefined') {
      MBV.Debug("Warning: 'domains' parameter was not passed to test 'domainNotIn'");
      return true;
    }
    var regex = '@((.+\.)?)*'+params.domains.join('|')+'\.';
    params.pattern = regex;
    return MBV.Tests.noMatchPattern(value, params);
  },

  // This isn't really a test, more of a filter
  // @param object tests A list of tests to run
  afterRemovingNonNumbers: function(value, params) {
    value = value.replace(/[^0-9]/g, "");
    for(testname in params.tests)
    {
      var result = params.validator.test(testname, value, params.tests[testname]);
      if(result !== true) return result;
    }
    return true;
  },

  // This isn't really a test, more of a filter
  // @param object tests A list of tests to run
  afterLowerCase: function(value, params) {
    value = value.toLowerCase();
    for(testname in params.tests)
    {
      var result = params.validator.test(testname, value, params.tests[testname]);
      if(result !== true) return result;
    }
    return true;
  },

  // This isn't really a test, more of a filter
  // @param object tests A list of tests to run
  // This will only run these tests if State can be found and it's not New York
  // 12345 is a valid zip code for New York
  // @todo Make this a more generic function maybe?
  exceptForNewYork: function(value, params) {
    if(!params.validator) return true;
    var state = params.validator.getState();
    if(!state || !state.length) return true;
    state = state.toLowerCase();
    if(state === "new york" || state == "newyork" || state == "ny") return true;

    for(testname in params.tests)
    {
      var result = params.validator.test(testname, value, params.tests[testname]);
      if(result !== true) return result;
    }
    return true;
  },

  countrySpecificRegex: function(value, params) {
    var country = params.validator.getCountry();
    if(!country) return true;
    country = country.toLowerCase();
    value = $.trim(value);
    if(country === "us" || country === "united states") {
      var regexp = /^\d{5}([ \-]\d{4})?$/;
      if(value.search(regexp)==-1) return false;
    } else if(country === "de" || country === "germany") {
      var regexp = /^\d{5}$/;
      if(value.search(regexp)==-1) return false;
    } else if(country === "fr" || country === "france") {
      var regexp = /^\d{2}[ ]?\d{3}$/;
      if(value.search(regexp)==-1) return false;
    } else if(country === "be" || country === "belgium") {
      var regexp = /^\d{4}$/;
      if(value.search(regexp)==-1) return false;
    } else if(country === "uk" || country === "united kingdom") {
      if(checkUKPostCode(value) === false) return false;
    }
    return true;
  }
};


/*
** Core code
************************************************/

MBV.Validator = function() {
  var self = this;

  self.tests = MBV.Tests;
  self.tryAgainTimeout = false;

  // set noresubmit to true to disable the default behavior
  // of resubmitting the form when web service completes or times out
  self.validate = function(type, value, noresubmit) {

    if (!value) return false;
    console.log(value);
    if(typeof MBV.Types[type] == 'undefined') {
      MBV.Debug("Type '"+type+"' is undefined");
      return true;
    }
    var tests = MBV.Types[type];
    console.log(tests);
    for(testname in tests)
    {
      var result = self.test(testname, value, tests[testname], noresubmit);
      if(result !== true) return result;
    }

    return true;
  };

  self.test = function(testname, value, params, noresubmit) {
    if(typeof params == "object" && Object.prototype.toString.call(params) == "[object Array]") {
      // We're running several of the same test
      var paramslist = params;
      var result = true;
      $.each(paramslist, function(i,params) {
        if(result !== true) return;
        params.noresubmit = noresubmit;
        result = self.test(testname, value, params);
      });
      return result;
    } else {
      // We're running just one test (normal behavior)
      if(typeof params !== "object") params = {};
      params.validator = self;
      params.noresubmit = noresubmit;

      if(typeof MBV.Tests[testname] == 'undefined')
      {
        MBV.Debug("Test '"+testname+"' does not exist");
        return true;
      }
      return MBV.Tests[testname](value.toString(), params);
    }
  };

  self.tryAgainLater = function() {
    if(!self.form) return;
    if(self.tryAgainTimeout) clearTimeout(self.tryAgainTimeout);
    self.tryAgainTimeout = setTimeout(function() {
      self.submitForm();
    }, (MBV.Settings.maxWebserviceDelay + 20));
  };

  self.getCountry = function() {
    var el = $(self.form).find('select[name="Country"],input[name="Country"]');
    if(!el.length) return false;
    return el.val();
  };

  self.getState = function() {
    var el = $(self.form).find('select[name="State"],input[name="State"],select[name="state"],input[name="state"]');
    if(!el.length) return false;
    return el.val();
  };

  // this function doesn't work with marketo forms, must override
  self.submitForm = function() {
    if(!self.form) return;
    $(self.form).submit();
  };

};

MBV.MarketoIntegration = function(form) {
  var self = this;
  self.Mkto = {}; // Contains hooked Mkto functions
  self.validator = new MBV.Validator();

  self.validateField = function(fieldElement) {
    var field = $(fieldElement);
    self.validator.form = field.parents('form')[0];
    self.validator.submitForm = function() {
      if(!self.validator.form) return;
      // formSubmit is a Marketo supplied function
      if(!formSubmit) {
        MBV.Debug("Error: Marketo seems to have removed the formSubmit function");
        return;
      }
      formSubmit(self.validator.form, true);
    };

    var type = self.determineType(field);
    var required = self.determineRequired(field);
    var value = field.val();

    if(required && type) {
      var result = self.validator.validate(type, value);
      if(typeof result == "string")
        return self.setError(fieldElement, result);
      if(!result)
        return self.setError(fieldElement, "This field is required");
      return true;
    }
    return MBV.Mkto.validateField(fieldElement);
  };

  self.setError = function(field, message) {
    console.log(message);
    if(field instanceof jQuery) field = field[0];

    message = self.getTranslatedMessage(message);

    form.showErrorMessage(message, field);
  };

  self.getTranslatedMessage = function(message, lang, no_default) {
    // if(message === "loadingImage") return MBV.Settings.loadingImage;

    if(!lang)
      lang = typeof mktFormLanguage !== 'undefined'  ? mktFormLanguage : 'English';

    messagesArray = MBV.Messages;

    if(typeof messagesArray[lang] !== 'undefined') {
      if(typeof messagesArray[lang][message] !== 'undefined')
        return messagesArray[lang][message];

      if(!no_default && typeof messagesArray[lang]['required'] !== 'undefined')
        return messagesArray[lang]['required'];
    }

    if(lang === "English") {
      if(no_default) return false;
      return MBV.Messages.English.required;
    }

    return self.getTranslatedMessage(message, "English", no_default);
  };

  self.determineRequired = function(field) {
    return field.is('.mktoRequired');
  };

  self.determineType = function(field) {
    if(field.is('.mktoPhoneField')) return 'phone';
    if(field.is('.mktoEmailField')) return 'email';
    if(field.attr('name')===('Company')) return 'company';
    if(field.attr('name')==='PostalCode') return 'postalCode';
    if(field.attr('name')==='FirstName' || field.attr('name')==='LastName' || field.attr('name')==='Company') return 'name';
    return false;
  };

  var attempts = 0;
  self.formSubmit = function(elt, auto) {
    if(!auto) attempts += 1;

    //if(!auto && attempts > 1) {
      //$.each(MBV.Services.GoogleMaps.addressStatus, function(key, value) {
        //accept 100% of all second submission attempts
        //MBV.Services.GoogleMaps.addressStatus[key] = true;
      //});
    //}

    return MBV.Mkto.formSubmit(elt);
  };

  self.init = function() {
      MBV.Mkto = {};
      MBV.Mkto.validateField;
      // Mkto.validateField = self.validateField;
      MBV.Mkto.formSubmit;
      window.formSubmit = self.formSubmit;

      var clearText = self.getTranslatedMessage('clear', false, true);
      var submitText = self.getTranslatedMessage('submit', false, true);
      if(clearText && $('#mktFrmReset').length)
        $('#mktFrmReset').val(clearText);
      if(submitText && $('#mktFrmSubmit').length)
        $('#mktFrmSubmit').val(submitText);
  };

  self.init();
};

MBV.Init = function() {
  $(document).ready(function() {
    MktoForms2.whenReady(function (form) {
      MBV.form = form;
      var controller = window._mbv = new MBV.MarketoIntegration(form);
      form.submitable(false);

      var formObj = form.getFormElem();

      formObj.find('input.mktoField').each(function(i,el) {
        el = $(el);
        if(!controller.determineRequired(el)) return;

        var type = controller.determineType(el);
        if(type === "email" || type === "postalCode") {

          var prevalidate = function() {
            controller.validator.validate(type, el.val(), true);
          };

          el.blur(prevalidate);
          if(type==="email") {
            if(el.val().length) prevalidate;
          }

          if(type==="postalCode") {
            var country = $(el.parents('form').get(0)).find('[name="country"],[name="Country"]');
            if (country.length) {
              country.blur(prevalidate);
              if(el.val().length && country.val().length)
                prevalidate();

              if(alternate)
                alternate.blur(prevalidate);
            }
          }
        }
      });
    });
  });
}();

