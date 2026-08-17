const crypto=require("crypto");
const fs=require("fs");

const algorithm="aes-256-gcm";

const key=crypto
.createHash("sha256")
.update(process.env.ENCRYPTION_KEY)
.digest();

function encryptFile(input,output){

const iv=crypto.randomBytes(16);

const cipher=crypto.createCipheriv(
algorithm,
key,
iv
);

const inputStream=fs.createReadStream(input);

const outputStream=fs.createWriteStream(output);

outputStream.write(iv);

inputStream
.pipe(cipher)
.pipe(outputStream);

return new Promise((resolve)=>{

outputStream.on("finish",()=>{

const tag=cipher.getAuthTag();

fs.appendFileSync(output,tag);

resolve();

});

});

}

module.exports={encryptFile};