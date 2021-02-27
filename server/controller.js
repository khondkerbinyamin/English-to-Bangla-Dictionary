var data = require('./E2Bdatabase.json');
const slot = 100000;
const prime = 999999999959;
const bigPrime = BigInt(prime);
var hashArray = new Array(slot)
var a = BigInt(1+Math.floor(Math.random()*(prime-1)));
var b = BigInt(Math.floor(Math.random()*(prime-1)));
var m = BigInt(slot);

function defineArray(){
    for(var i = 0; i < slot; i++){
        hashArray[i] = [];
    }
}


function wordToNum(word){
    var len = word.length;
    var number = 0n;
    for(var i=0; i<len; i++){
        number = (number*257n + BigInt(word.charCodeAt(i)+1)) % bigPrime;
    }
    return number;
}


function eraseDuplicate(){
    var unique = []
    var length = data.length
    var map = new Map();
    for(var i=0; i<length; i++){
        if(map.get(data[i]) == undefined){
            unique.push(data[i])
            map.set(data[i], 1);
        }
    }
    data = unique
}

const primaryHash = async() => {
    defineArray();
    eraseDuplicate();
    var length = data.length;
    for(var i = 0; i < length; i++){
        var num = wordToNum(data[i].en);
        var hash = ((a * num + b) % bigPrime ) % m
        // console.log(num);
        // console.log(hash);
        hashArray[hash].push(data[i]);
        
    }
    // for(var i = 0; i < hashArray.length; i++){
        
    //         console.log(hashArray[i]);
        
    // }

}

const secondaryHash = async() => {
    tempData = [];
    var count;
    for(var i = 0; i < hashArray.length; i++){
        if(hashArray[i].length == 0){
            continue;
        }
        
        tempData = [...hashArray[i]];
        
        var slot2 = hashArray[i].length * hashArray[i].length;
       // hashArray[i] = [];
        var m2 = BigInt(slot2);
        
        
        while(true){
            count = 0;
            hashArray[i] = [];
            //console.log("kisse");
            //console.log(tempData);
          
            var a2 = BigInt(1+Math.floor(Math.random()*(prime-1)));
            var b2 = BigInt(Math.floor(Math.random()*(prime-1)));
            for(var j = 0; j < tempData.length; j++){
            
                var num = wordToNum(tempData[j].en);
                // console.log(a2);
                // console.log(b2);
                // console.log(typeof(num));
                // console.log(m2);
                // console.log(typeof(bigPrime));
                var hash2 = ((a2 * num + b2) % bigPrime ) % (m2);
                
                // console.log(hash2);
                if(hashArray[i][hash2+3n] == undefined){
                    hashArray[i][hash2+3n] = tempData[j];
                   // console.log(hashArray[i][hash2+3n]);
                    count++
                }
                else{
                    //console.log(hashArray[i][hash2+3n]);
                    break;
                }
                
            }
           // console.log(count);
            //console.log(tempData.length);
            if(count == tempData.length){
                hashArray[i][0n] = a2;
                hashArray[i][1n] = b2;
                hashArray[i][2n] = m2;
                break;
            }
        }
        //console.log("while");
    }
    // for(var i = 0; i< hashArray.length; i++){
    //     for(var j = 0; j < 3; j++){
    //         if(hashArray[i][j] != undefined){
    //             console.log(i + " " + j + " "+ hashArray[i][j]);
    //         }
    //     }
    // }
}

const translate = async(req) => {
    var word = req.query.word.toLowerCase();
    var number = wordToNum(word);
    var hash = ((a * number + b) % bigPrime ) % m
    if(hashArray[hash].length == 0){
        return "Word not Found";
    }
    else{
        var a2 = hashArray[hash][0n];
        var b2 = hashArray[hash][1n];
        var m2 = hashArray[hash][2n];
        var hash2 = ((a2 * number + b2) % bigPrime ) % (m2);
        if(hashArray[hash][hash2+3n] == undefined){
            return "Word not Found";
        }
        else if(hashArray[hash][hash2+3n].en == word){
            return hashArray[hash][hash2+3n].bn;
        }
        else{
            return "Word not Found";
        }
    }
}

module.exports.translate = async(req,res) => {
    const result = await translate(req);
    res.send(result);
}

module.exports.primaryHash = async()=>{
    await primaryHash();
}

module.exports.secondaryHash = async()=>{
    await secondaryHash();
}

