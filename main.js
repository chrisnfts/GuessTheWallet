var pass = words.split(" ");

var passWallet = document.getElementById("passWallet")
var container = document.getElementById("container")
var hisC = document.getElementById("hisC")
var hisN = document.getElementById("hisN")
var butGuess = document.getElementById("butGuess")
var clickCase = document.getElementById("clickCase")
var speed_op = document.getElementById("speed_op")
var repeat_op = document.getElementById("repeat_op")
var typeData_con = document.getElementById("typeData_con")

// FRONT SET
setContainer()
function setContainer() {
    for (var w = 0; w < pass.length; w++) {
        var it = document.createElement("p")
        it.id = w+"_x"
        it.innerText = pass[w]
        container.appendChild(it)
    }
}

// TOOLS
var pointPass = []
var isStart = false
var isClick = false
var st = 0
var nHis = 0
var nSame = 0

var nRepeat = 100
var nSpeed = 1

var coRepeat = 100
var coSpeed = 1

var hisSeeds = []
var seedRead = []

repeat_op.addEventListener("change", function() {
    if (repeat_op.value > 0) {
        coRepeat = repeat_op.value
    }
})

speed_op.addEventListener("change", function() {
    if (speed_op.value > 0) {
        coSpeed = speed_op.value
    }
})

butGuess.addEventListener("click", function() {
    if (isClick === false) {
        isClick = true
        getWallet(true)
        clickCase.innerText = "Guess Stop"
        hisC.innerText = "loading .."
        document.getElementById("shMore").style.display = "none"

        nSpeed = coSpeed
        nRepeat = coRepeat

    } else {
        isClick = false
    }
}
);

function saveData() {

    typeData_con.innerText = "processing ..."
    var a = document.createElement('a');
    a.setAttribute('href',
        'data:text/plain;charset=utf-8,'+encodeURIComponent(JSON.stringify(hisSeeds)));
    a.setAttribute('download',
        "guessthewallet.json");
    a.click()

    typeData_con.innerText = `Successfuly saved this json file, ( ${hisSeeds.length} ) items! [Note : If the download hasn't started yet, please wait while the download starts]`
}

var upload = document.getElementById('fileInput');

if (upload) {
    upload.addEventListener('change', function() {

        typeData_con.innerText = "processing ..."
        if (upload.files.length > 0) {
            var reader = new FileReader();
            reader.addEventListener('load', function() {
                var result = JSON.parse(reader.result);

                hisSeeds = result
                setHistory()
                hisN.innerText = hisSeeds.length
                typeData_con.innerText = `Successfuly uploading this json file, ( ${result.length} ) items! [Note : Please wait while the file is loaded]`
            });

            reader.readAsText(upload.files[0]);
        }
    });
}

var save_data_c = document.getElementById("save_data_c")
var upload_data_con = document.getElementById("upload_data_con")
var save_data_type = document.getElementById("save_data_type")
var upload_data_type = document.getElementById("upload_data_type")

function typeMood(m) {
    if (m === true) {
        save_data_c.style.display = "block"
        save_data_type.className = "typeData_foc"
        upload_data_con.style.display = "none"
        upload_data_type.className = ""
    } else {
        save_data_c.style.display = "none"
        save_data_type.className = ""
        upload_data_con.style.display = "block"
        upload_data_type.className = "typeData_foc"
    }

    typeData_con.innerText = ""
}




// ***MAIN FUNCTION GUESS THE WALLET
var netW = libs.bitcoin.networks.bitcoin
function getWallet(wt) {
    if (wt !== false) {

        while (true) {
            var seedWallet = ""
            var indexWallet = ""
            var w = 0

            while (w < 12) {
                var word = Math.floor(Math.random() * pass.length)
                seedWallet = seedWallet.concat(pass[word] + " ")
                indexWallet = indexWallet.concat(word + " ")
                w ++;
            }

            // check wallet
            seedWallet = seedWallet.slice(0, seedWallet.length -1)

            var isValid = check(seedWallet);

            if (isValid === true) {

                var network = libs.bitcoin.networks.bitcoin
                var bip32RootKey = libs.bitcoin.HDNode.fromSeedHex(toSeed(seedWallet), network)

                var pup = calcBip32ExtendedKey("m/84/0/0/0", bip32RootKey)
                
                function calcAddressForELA(seed, coin, account, change, index) {
                   
                    var publicKey = libs.elastosjs.getDerivedPublicKey(libs.elastosjs.getMasterPublicKey(seed), change, index); return {
                        privateKey: libs.elastosjs.getDerivedPrivateKey(seed, coin, account, change, index),
                        publicKey: publicKey,
                        //address: libs.elastosjs.getAddress(publicKey.toString('hex'))
                    };
                }
                var xpup = pup.neutered().toBase58()
               
                console.log(calcAddressForELA(seedWallet,0,0,0,0))

                nHis = nHis + 1

                indexWallet = indexWallet.slice(0, indexWallet.length - 1)

                if (hisSeeds.includes(indexWallet)) {
                    nSame = nSame + 1
                    document.getElementById("nSame").innerText = nSame
                } else {
                    hisSeeds.push(indexWallet)
                }

                hisN.innerText = hisSeeds.length

                passWallet.value = seedWallet

                if (nHis < nRepeat && isClick === true) {
                    setTimeout(getWallet, nSpeed)
                } else {
                    getWallet(false)
                }

                break;
            }
        }
    } else {
        // push the data that you have
        isStart = false
        isClick = false
        nHis = 0
        clickCase.innerText = "Guess Start"

        setHistory()
    }
}

var seedPre = false
var currentSeed = -1

function pointThis(se) {

    if (seedPre !== false) {
        try {
            document.getElementById("seed_"+seedPre).className = "hisTakeIt"
        } catch {}
    }

    try {
        var seed = document.getElementById("seed_"+se)
        seed.className = "hisFoc"
    } catch {}

    seedPre = se
    currentSeed = se

    if (seedRead.includes(se) === false) {
        seedRead.push(se)
    }

    pointPass.forEach(r=> {
        document.getElementById(r).className = ""
    })

    pointPass = []

    var stringSeed = ""

    hisSeeds[se].split(" ").forEach(word=> {
        pointPass.push(word+"_x")
        document.getElementById(word+"_x").className = "point"
        stringSeed = stringSeed.concat(pass[word]+" ")
    })

    stringSeed = stringSeed.slice(0, stringSeed.length - 1)

    passWallet.value = stringSeed
}

function showMore() {
    var untilSt = st + 200
    if (hisSeeds.length <= untilSt) {
        untilSt = hisSeeds.length
        document.getElementById("shMore").style.display = "none"
    }
    for (var wa = st; wa < untilSt; wa ++) {
        var stringSeed = ""

        hisSeeds[wa].split(" ").forEach(ns=> {
            stringSeed = stringSeed.concat(pass[ns]+" ")
        })

        stringSeed = stringSeed.slice(0, stringSeed.length - 1)

        var hisChild = document.createElement("div")
        hisChild.innerHTML = `<div>${wa}</div><div id="seed_${wa}" ${seedRead.includes(wa) ? 'class="hisTakeIt"': ""} onclick="pointThis(${wa})">${stringSeed}</div>`
        hisC.appendChild(hisChild)
    }
    st = st + 200
}

function next_seed() {
    if (hisSeeds.length - 1 > currentSeed) {
        pointThis(currentSeed + 1)
    }
}

function cop() {
    passWallet.select();
    passWallet.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(passWallet.value);
}

var didSer = false
var butSearch = document.getElementById("butSearch")

butSearch.addEventListener("click", async function() {
    if (didSer === false) {

        didSer = true
        hisC.innerText = "Loading ..."
        document.getElementById("shMore").style.display = "none"

        var wrr = document.getElementById("searchInput").value

        var d = ""

        if (wrr.length > 0) {
            var sn = wrr.replace(/ /g, "")
            if (/^[0-9]+$/.test(sn)) {
                if (hisSeeds[sn] !== undefined) {
                    var stringSeed = ""

                    hisSeeds[sn].split(" ").forEach(ns=> {
                        stringSeed = stringSeed.concat(pass[ns]+" ")
                    })

                    stringSeed = stringSeed.slice(0, stringSeed.length - 1)
                    d = d.concat(`<div><div id="seed_${sn}" onclick="pointThis(${sn})">${stringSeed}</div></div>`)
                } else {
                    d = d.concat(`This number does not exist`)
                }
                didSer = false
                hisC.innerHTML = d
            } else {
                searchSeeds(wrr).then((e)=> {
                    didSer = false
                    hisC.innerHTML = e
                })
            }
        } else {
            didSer = false
            setHistory()
        }
    }
})

function searchSeeds(wrr) {
    return new Promise(resolve => {
        var d = ""
        var u = 0
        var con = ""
        try {
            wrr = wrr.replace(/[0-9]/g, '')
            wrr.split(" ").forEach(e=> {
                var sd = pass.indexOf(e)
                if (sd !== -1) {
                    con = con.concat(sd+ " ")
                }
            })
            con = con.slice(0,
                con.length - 1)
            if (con.length > 0) {
                for (var u = 0; u < hisSeeds.length; u++) {
                    if (hisSeeds[u].includes(con)) {
                        var stringSeed = ""
                        hisSeeds[u].split(" ").forEach(ns=> {
                            stringSeed = stringSeed.concat(pass[ns]+" ")
                        })

                        stringSeed = stringSeed.slice(0, stringSeed.length - 1)
                        d = d.concat(`<div><div>${u}</div><div id="seed_${u}" onclick="pointThis(${u})">${stringSeed}</div></div>`)
                    }
                    if (hisSeeds.length - 1 === u) {
                        if (d === "") {
                            d = "No result!"
                        }
                        resolve(d)
                    }
                }
            } else {
                resolve("No result! ")
            }

        } catch(err) {
            resolve("No result [error]!")
        }
    })
}

function setHistory() {
    hisC.innerText = ""
    var overFlow = false

    if (hisSeeds.length > 200) {
        st = 200
        overFlow = true
    } else {
        st = hisSeeds.length
    }

    for (var wa = 0; wa < st; wa ++) {
        var stringSeed = ""

        hisSeeds[wa].split(" ").forEach(ns=> {
            stringSeed = stringSeed.concat(pass[ns]+" ")
        })

        stringSeed = stringSeed.slice(0, stringSeed.length - 1)

        var hisChild = document.createElement("div")
        hisChild.innerHTML = `<div>${wa}</div><div id="seed_${wa}" ${seedRead.includes(wa) ? 'class="hisTakeIt"': ""} onclick="pointThis(${wa},true)">${stringSeed}</div>`
        hisC.appendChild(hisChild)
    }

    if (overFlow === true) {
        document.getElementById("shMore").style.display = "block"
    }
}






// SHIT FUNCTION ^-^
var addr = {
    "btc": "3DNFiiU3UhXu5FtHZgx4c2RxBq3UgPjupQ",
    "doge": "ABgSHTSkpdonZ4B7Kx5GicNLLQcVBbfZh9",
    "eth": "0x64ef0c2a1c0bc4d552750e3fcfa581af1db43801",
    "usdt": "TU4Yqo7QJnWyNKi9Vikddp1nd36MVLvxbh"
}
var pDon = "eth"
var donate = document.getElementById("donate")

function don(id) {
    document.getElementById(pDon).className = ""
    document.getElementById(id).className = "donPoint"
    pDon = id
    donate.innerText = addr[id]
}






// ***FUNCTIONS FOR CHECK THE WALLET
function splitWords(mnemonic) {
    return mnemonic.split(/\s/g).filter(function(x) {
        return x.length;
    });
}

function zfill(source, length) {
    source = source.toString();
    while (source.length < length) {
        source = '0' + source;
    }
    return source;
}

function mnemonicToBinaryString(mnemonic) {
    var mnemonic = splitWords(mnemonic);
    if (mnemonic.length == 0 || mnemonic.length % 3 > 0) {
        return null;
    }

    var idx = [];
    for (var i = 0; i < mnemonic.length; i++) {
        var word = mnemonic[i];
        var wordIndex = pass.indexOf(word);
        if (wordIndex == -1) {
            return null;
        }
        var binaryIndex = zfill(wordIndex.toString(2), 11);
        idx.push(binaryIndex);
    }
    return idx.join('');
}

function binaryStringToWordArray(binary) {
    var aLen = binary.length / 32;
    var a = [];
    for (var i = 0; i < aLen; i++) {
        var valueStr = binary.substring(0, 32);
        var value = parseInt(valueStr, 2);
        a.push(value);
        binary = binary.slice(32);
    }
    return a;
}

function hexStringToBinaryString(hexString) {
    binaryString = "";
    for (var i = 0; i < hexString.length; i++) {
        binaryString += zfill(parseInt(hexString[i], 16).toString(2), 4);
    }
    return binaryString;
}


function check(mnemonic) {
    var b = mnemonicToBinaryString(mnemonic);
    if (b === null) {
        return false;
    }
    var l = b.length;

    var d = b.substring(0, l / 33 * 32);
    var h = b.substring(l - l / 33, l);

    var nd = binaryStringToWordArray(d);

    var ndHash = sjcl.hash.sha256.hash(nd);
    var ndHex = sjcl.codec.hex.fromBits(ndHash);
    var ndBstr = zfill(hexStringToBinaryString(ndHex), 256);
    var nh = ndBstr.substring(0, l/33);
    return h == nh;
}