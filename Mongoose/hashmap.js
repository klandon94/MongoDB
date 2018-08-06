var hashMap = [];
hashMap.length = 30;

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i=0; i<this.length; i++){
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash) + char; // bitwise operators are used to manipulate the string in binary
        hash &= hash;
    }
    return hash;
}

function mod(input, div){
    return (input % div + div) % div;
}

Array.prototype.insertHash = function(key, value){
    let code = key.hashCode();
    let index = mod(code, this.length);
    if (this[index]){
        let i = 0;
        while (this[index][i]) i++;
        this[index][i] = [key,value];
    }
    else this[index] = [[key,value]];
}

Array.prototype.searchHash = function(key){
    let code = key.hashCode();
    let index = mod(code, this.length);
    if (this[index]) return this[index][0].toString().split(",")[1];
    return null;
}

hashMap.insertHash("role", "pet");
hashMap.insertHash("creator", "Hanna-Barbera");
hashMap.insertHash("type", "dinosaur");
hashMap.insertHash("owner", "Fred Flinstone");
hashMap.insertHash("species", "Snorkasaurus");
console.log(hashMap.searchHash("owner"));