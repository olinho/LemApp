var chars=[];
var chars2=[];
var keyss=[];
var isCapsOn = false;
var ctrlPressed = false;


var availableKeys = [
	';','\'','\=','\,',".",' ','[',']','\\', '{', '}', '|', ':', '\"', '<', '>', '+'
];

var availableKeyCodes = [
	48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
	65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
	173, 61, 219, 221, 220, 59, 222, 188, 190,	//codes of special characters without shift
	// 17, 18 //alt
];

var specialCharactersActiveWithShift = [
	'{', '}', '|', ':', '\"', '+'
];

var specialCharactersWithoutShift = [
	';','\'','\=',',','.','[',']', '\\'
];





function isItUnwrittenKeyCode(keyCode) {
	var unwrittenKeyCodes = [
			37,38,39,40,46,8,32,13,35,36,16 // arrows, delete, backspace, space, enter, end, home,ctrl,shift
		];
	if (keyCode !== undefined) {
		return (unwrittenKeyCodes.indexOf(keyCode) != -1);
	}
	else {
		return (unwrittenKeyCodes.indexOf(currentKeyCode) != -1);	
	}
}

// if we call function without args then this function will call itself with currentKeyCode arg
function isTheKeyCodeAvailable(keyCode) {
	if (keyCode !== undefined) {
		return (availableKeyCodes.indexOf(keyCode) != -1);
	}
	else {
		return isTheKeyCodeAvailable(currentKeyCode);
	}
}

// here we check if given key is available
function isTheKeyAvailable(character)
{
	var keyTester = document.getElementById('keyTester');
	// delete and dot(.) has the same charCode so firstly check if given character is dot
	if (character.charCodeAt(0) == 46){
		if (currentKeyCode == character.charCodeAt(0))
			return false;
		else
			return true;
	}

	if (character.charCodeAt(0) == 39){
		if (currentKeyCode == character.charCodeAt(0))
			return false;
		else
			return true;
	}
	if (availableKeys.indexOf(character) != -1) {
		return true;
	} 
	if (/[0-9A-Za-z]+/.test(character)){
		return true;
	}
	return false;
}

// set caps lock on/off after click on this key
function setCapsLock(e){ 
	var s = String.fromCharCode( e.which );

	if (s.charCodeAt(0) <= 46 && s.charCodeAt(0) != 20)
		isCapsOn = isCapsOn;
	else if (specialCharactersWithoutShift.indexOf(s)!=-1 && isCapsOn)
		isCapsOn = true;
  // else if ( specialCharactersWithoutShift.indexOf(s)==-1 && (s.toUpperCase() === s && !e.shiftKey) || (s.toLowerCase() === s && e.shiftKey) ) 
  // 	isCapsOn = true; 	   
	else 
		isCapsOn = false;
}


// chars is array in which each element contains:
// unicode char as parameter
// value having mapped elements - key:value
chars2['\u0430'] = {base: 'a'};
chars2['\u0431'] = {base: 'b'};
chars2['\u0432'] = {base: 'w'};
chars2['\u0433'] = {base: 'h'};
chars2['\u0491'] = {base: 'g'};
chars2['\u0434'] = {base: 'd'};
chars2['\u0435'] = {base: 'e'};
chars2['\u0436'] = {base: 'ż'};
chars2['\u0437'] = {base: 'z', extended: 'z', diextended: 'z'};
chars2['\u0438'] = {base: 'y'};
chars2['\u0439'] = {base: 'j'};
chars2['\u043A'] = {base: 'k'};
chars2['\u043B'] = {base: 'ł', extended: 'l', diextended: 'l'};
chars2['\u043C'] = {base: 'm'};
chars2['\u043D'] = {base: 'n', extended: 'ń', diextended: "ni"};
chars2['\u043E'] = {base: 'o'};
chars2['\u043F'] = {base: 'p'};
chars2['\u0440'] = {base: 'r'};
chars2['\u0441'] = {base: 's', extended: 'ś', diextended: 'si'};
chars2['\u0442'] = {base: 't'};
chars2['\u0443'] = {base: 'u'};
chars2['\u0444'] = {base: 'f'};
chars2['\u0445'] = {base: 'ch'};
chars2['\u0446'] = {base: 'c', extended: 'ć', diextended: 'ci'};
chars2['\u0447'] = {base: 'cz'};
chars2['\u0448'] = {base: 'sz'};
chars2['\u0449'] = {base: 'szcz'};
chars2['\u044B'] = {base: 'y'};
chars2['\u0454'] = {base: 'je', extended: 'e'};
chars2['\u044E'] = {base: 'ju', extended: 'u'};
chars2['\u044F'] = {base: 'ja', extended: 'a'};
chars2['\u044A'] = {other: 'tvyordy'};
chars2['\u044C'] = {other: 'myagkiy'};

chars2['\u0410'] = { base: 'A'};
chars2['\u0411'] = { base: 'B'};
chars2['\u0412'] = { base: 'W'};
chars2['\u0413'] = { base: 'H'};
chars2['\u0414'] = { base: 'D'};
chars2['\u0415'] = { base: 'E'};
chars2['\u0416'] = { base: 'Ż'};
chars2['\u0417'] = { base: 'Z', extended: 'Z', diextended: 'Zi'};
chars2['\u0418'] = { base: 'Y'};
chars2['\u0419'] = { base: 'J'};
chars2['\u041A'] = { base: 'K'};
chars2['\u041B'] = { base: 'Ł', extended: 'L', diextended: 'L'};
chars2['\u041C'] = { base: 'M'};
chars2['\u041D'] = { base: 'N', extended: 'Ń', diextended: "Ni"};
chars2['\u041E'] = { base: 'O'};
chars2['\u041F'] = { base: 'P'};
chars2['\u0420'] = { base: 'R'};
chars2['\u0421'] = { base: 'S', extended: 'Ś', diextended: "Si"};
chars2['\u0422'] = { base: 'T'};
chars2['\u0423'] = { base: 'U'};
chars2['\u0424'] = { base: 'F'};
chars2['\u0425'] = { base: 'Ch'};
chars2['\u0426'] = { base: 'C', extended: 'Ć', diextended: "Ci"};
chars2['\u0427'] = { base: 'Cz'};
chars2['\u0428'] = { base: 'Sz'};
chars2['\u0429'] = { base: 'Szcz'};
chars2['\u042B'] = { base: 'Y'};
chars2['\u0404'] = { base: 'Je', extended: 'e'};
chars2['\u042E'] = { base: 'Ju', extended: 'u'};
chars2['\u042F'] = { base: 'Ja', extended: 'a'};
chars2['\u042A'] = { other: 'Tvyordy'};
chars2['\u042C'] = { other: 'Myagkiy'};
chars2[' '] = { base: ' '};
chars2['»'] = {base: '»'};
chars2['«'] = {base: '«'};


chars['a cyr'] = { lower: '\u0430', upper: '\u0410' };
chars['b cyr'] = { lower: '\u0431', upper: '\u0411' };
chars['v cyr'] = { lower: '\u0432', upper: '\u0412' };
chars['h cyr'] = { lower: '\u0433', upper: '\u0413' };
chars['g cyr'] = { lower: '\u0491', upper: '\u0490' };
chars['d cyr'] = { lower: '\u0434', upper: '\u0414' };
chars['e cyr'] = { lower: '\u0435', upper: '\u0415' };
chars['yo cyr'] = { lower: '\u0451', upper: '\u0401' };
chars['zh cyr'] = { lower: '\u0436', upper: '\u0416' };
chars['z cyr'] = { lower: '\u0437', upper: '\u0417' };
chars['y cyr'] = { lower: '\u0438', upper: '\u0418' };
chars['i cyr'] = { lower: '\u0456', upper: '\u0406' };
chars['j cyr'] = { lower: '\u0439', upper: '\u0419' };
chars['k cyr'] = { lower: '\u043A', upper: '\u041A' };
chars['l cyr'] = { lower: '\u043B', upper: '\u041B' };
chars['m cyr'] = { lower: '\u043C', upper: '\u041C' };
chars['n cyr'] = { lower: '\u043D', upper: '\u041D' };
chars['o cyr'] = { lower: '\u043E', upper: '\u041E' };
chars['p cyr'] = { lower: '\u043F', upper: '\u041F' };
chars['r cyr'] = { lower: '\u0440', upper: '\u0420' };
chars['s cyr'] = { lower: '\u0441', upper: '\u0421' };
chars['t cyr'] = { lower: '\u0442', upper: '\u0422' };
chars['u cyr'] = { lower: '\u0443', upper: '\u0423' };
chars['f cyr'] = { lower: '\u0444', upper: '\u0424' };
chars['ch cyr'] = { lower: '\u0445', upper: '\u0425' };
chars['c cyr'] = { lower: '\u0446', upper: '\u0426' };
chars['cz cyr'] = { lower: '\u0447', upper: '\u0427' };
chars['sh cyr'] = { lower: '\u0448', upper: '\u0428' };
chars['shch cyr'] = { lower: '\u0449', upper: '\u0429' };
chars['tvyordy znak cyr'] = { lower: '\u044A', upper: '\u042A' };
chars['yy cyr'] = { lower: '\u044B', upper: '\u042B' };
chars['myagkiy znak cyr'] = { lower: '\u044C', upper: '\u042C' };
chars['ye cyr'] = { lower: '\u0454', upper: '\u0404' };
chars['yu cyr'] = { lower: '\u044E', upper: '\u042E' };
chars['ya cyr'] = { lower: '\u044F', upper: '\u042F' };
chars['<<'] = { lower: '\u00AB' };
chars['>>'] = { lower: '\u00BB' };
chars['dash'] = { lower: '-' };
chars['endash'] = { lower: '\u2013' };
chars['emdash'] = { lower: '\u2014' };
chars['straight quote'] = { lower: '"' };
chars['low quote'] = { lower: '\u201E' };
chars['high inverted quote'] = { lower: '\u201C' };
chars['high quote'] = { lower: '\u201D' };
chars['apostrophe'] = { lower: '\u2019' };
chars['straight apostrophe'] = { lower: '\'' };
chars['comma-semicolon'] = { lower: ',', upper: ';' };
chars['period-colon'] = { lower: ':', upper: ':' };
chars[';'] = { lower: ';', upper: ';' };
chars[':'] = { lower: ':', upper: ':' };
chars['numero sign'] = { lower: '\u2116' };
chars['euro'] = { lower: '\u20AC' };
chars['@'] = { lower: '@' };
chars['+'] = { lower: '+' };
chars['='] = { lower: '=' };
chars['combining acute accent'] = { lower: '\u0301', combChars: 1 };
chars['1'] = { lower: '1' };
chars['2'] = { lower: '2' };
chars['3'] = { lower: '3' };
chars['4'] = { lower: '4' };
chars['5'] = { lower: '5' };
chars['6'] = { lower: '6' };
chars['7'] = { lower: '7' };
chars['8'] = { lower: '8' };
chars['9'] = { lower: '9' };
chars['0'] = { lower: '0' };
chars['backslash'] = { lower: '\\' };
chars['comma'] = { lower: ',', upper: ',' };
chars['dot'] = { lower: '.', upper: '.' };
chars['space'] = { lower: '&nbsp', upper: '&nbsp' };
chars['opening arrows'] = { lower: '«' };
chars['closing arrows'] = { lower: '»' };

// return param of 'keyss' assigned to param of 'chars', for example 
// 'W' is connected with 'sh cyr', because
// keyss['W'] = [ chars['sh cyr'], chars['shch cyr'] ];
function keyssFromChars(charsParam) {
	var key = Object.keys(keyss).filter(function(key) {return keyss[key].indexOf(chars[charsParam]) != -1})[0];
	return key;
}

keyss['Q'] = [ chars['ya cyr'] ];
keyss['W'] = [ chars['sh cyr'], chars['shch cyr'] ];
keyss['E'] = [ chars['e cyr'] ];
keyss['R'] = [ chars['r cyr'] ];
keyss['T'] = [ chars['t cyr'] ];
keyss['Y'] = [ chars['yy cyr'] ];
keyss['U'] = [ chars['u cyr'] ];
keyss['I'] = [ chars['y cyr'], chars['i cyr'] ];
keyss['O'] = [ chars['o cyr'] ];
keyss['P'] = [ chars['p cyr'] ];
keyss['['] = [ chars['yu cyr'] ];
keyss['\\'] = [ chars['backslash'] ];
keyss[']'] = [ chars['ye cyr'] ];
keyss['\u005C'] = [ chars['backslash'] ];
keyss['A'] = [ chars['a cyr'] ];
keyss['S'] = [ chars['s cyr'] ];
keyss['D'] = [ chars['d cyr'] ];
keyss['F'] = [ chars['f cyr'] ];
keyss['G'] = [ chars['h cyr'], chars['g cyr'] ];
keyss['H'] = [ chars['ch cyr'] ];
keyss['J'] = [ chars['j cyr'] ];
keyss['K'] = [ chars['k cyr'] ];
keyss['L'] = [ chars['l cyr'] ];
keyss[';'] = [ chars['cz cyr'] ];
keyss['\''] = [ chars['myagkiy znak cyr'] ];
keyss['Z'] = [ chars['z cyr'] ];
keyss['X'] = [ chars['zh cyr'] ];
keyss['C'] = [ chars['c cyr'] ];
keyss['V'] = [ chars['v cyr'] ];
keyss['B'] = [ chars['b cyr'] ];
keyss['N'] = [ chars['n cyr'] ];
keyss['M'] = [ chars['m cyr'] ];
keyss[','] = [ chars['comma'] ];
keyss['.'] = [ chars['dot'] ];

keyss['Ctrl+E'] = [ chars['e cyr'], chars['yo cyr'] ];
keyss['Ctrl+Z'] = [ chars['zh cyr'] ];
keyss['Ctrl+O'] = [ chars['yo cyr'] ];
keyss['Ctrl+U'] = [ chars['yu cyr'] ];
keyss['Ctrl+W'] = [ chars['ye cyr'] ];
keyss['Ctrl+B'] = [ chars['myagkiy znak cyr'], chars['tvyordy znak cyr'] ];

keyss['`~'] = [ chars['yo cyr'] ];
keyss['-'] = [ chars['dash'], chars['endash'], chars['emdash'] ];
keyss['='] = [ chars['tvyordy znak cyr'] ];
keyss['Ctrl+N'] = [ chars['endash'] ];
keyss['Ctrl+M'] = [ chars['emdash'] ];
keyss['Ctrl+/?'] = keyss['Ctrl+1'] = [ chars['combining acute accent'] ];

keyss['Ctrl+\'"'] = [ chars['apostrophe'] ];
keyss['Ctrl+Shift+\'"'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['Ctrl+,<'] = [ chars['low quote'] ];
keyss['Ctrl+.>'] = [ chars['high inverted quote'] ];
keyss['Ctrl+Shift+,<'] = [ chars['<<'] ];
keyss['Ctrl+Shift+.>'] = [ chars['>>'] ];                
keyss['Ctrl+2'] = [ chars['@'] ];
keyss['Ctrl+3'] = [ chars['numero sign'] ];
keyss['Ctrl+4'] = [ chars['apostrophe'] ];
keyss['Ctrl+5'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['Ctrl+6'] = [ chars['endash'], chars['emdash'] ];
keyss['Ctrl+Shift+=+'] = keyss['Ctrl+9'] = [ chars['+'] ];
keyss['Ctrl+=+'] = keyss['Ctrl+0'] = [ chars['='] ];
keyss['Ctrl+-_'] = [ chars['endash'], chars['emdash'] ];
// keyss['\''] = [ chars['apostrophe'], chars['straight apostrophe'] ];
// keyss['"'] = [ chars['high inverted quote'], chars['high quote'], chars['straight quote'] ];
keyss['"'] = [ chars['myagkiy znak cyr'] ]; 
keyss['{'] = [ chars['yu cyr'] , chars['opening arrows'] ]; 
keyss['}'] = [ chars['ye cyr'] , chars['closing arrows'] ];  
keyss['|'] = [ chars['\\ cyr'] ];  
keyss[':'] = [ chars['cz cyr'] ];  
keyss['+'] = [ chars['tvyordy znak cyr'] ];  
keyss['<'] = [ chars['comma'] ];
keyss['>'] = [ chars['dot'] ];
keyss['Ctrl+Shift+4'] = [ chars['euro'] ];
keyss[' '] = [ chars['space'] ];

// samogłoski
var vowelSpecialCyrillicChars = [
	chars['a cyr'].lower, chars['a cyr'].upper,
	chars['e cyr'].lower, chars['e cyr'].upper,
	chars['o cyr'].lower, chars['o cyr'].upper,
	chars['u cyr'].lower, chars['u cyr'].upper,
];

// letters which we can soften
var softCyrillicChars = [
	chars['c cyr'].lower, chars['c cyr'].upper,
	chars['n cyr'].lower, chars['n cyr'].upper,
	chars['s cyr'].lower, chars['s cyr'].upper,
	chars['z cyr'].lower, chars['z cyr'].upper,
	chars['l cyr'].lower, chars['l cyr'].upper,
];

// letters builds of 2 chars
var doubleCyrillicChars = [
	chars['ya cyr'].lower, chars['ya cyr'].upper,
	chars['yu cyr'].lower, chars['yu cyr'].upper,
	chars['ye cyr'].lower, chars['ye cyr'].upper,
];

// letters which can soft 'ł' to 'l'
// i, e, и
var softingCyrillicChars = [
	chars['y cyr'].lower, chars['y cyr'].upper, 
	chars['i cyr'].lower, chars['i cyr'].upper, 
	chars['e cyr'].lower, chars['e cyr'].upper, 
];

function isKeyssAvailable(el) {
	return (Object.keys(keyss).indexOf(el.toUpperCase()) != -1);
}