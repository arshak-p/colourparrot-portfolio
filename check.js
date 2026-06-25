const fs=require('fs'); 
const files=fs.readdirSync('public/branding'); 
files.filter(f=>f.endsWith('.webp')).forEach(f=>{ 
  const b=fs.readFileSync('public/branding/'+f); 
  const type=b.slice(16,20).toString(); 
  let w=0,h=0; 
  if(type==='VP8 '){w=b.readUInt16LE(26);h=b.readUInt16LE(28);} 
  else if(type==='VP8L'){const v=b.readUInt32LE(21);w=(v&0x3FFF)+1;h=((v>>14)&0x3FFF)+1;} 
  else if(type==='VP8X'){w=(b.readUIntLE(24,3))+1;h=(b.readUIntLE(27,3))+1;} 
  console.log(f.padEnd(35), type, w+'x'+h); 
});
