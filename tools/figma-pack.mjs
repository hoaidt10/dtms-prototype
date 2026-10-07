// Đóng gói dữ liệu capture vào một PNG xám 8-bit, deflate kiểu "stored" (không nén) để plugin Figma giải được không cần zlib.
// Ảnh tải lên bằng MCP upload_assets (tô vào một hình chữ nhật), plugin đọc lại byte gốc qua getImageByHash().getBytesAsync().
//   node figma-pack.mjs <cap> <out.png>   → ghi PNG + in kích thước
// Nội dung: JSON chỉ ký tự ASCII (ký tự khác viết \uXXXX), 4 byte đầu = độ dài (big-endian).
import { readFileSync, writeFileSync } from 'node:fs';
import { crc32 } from 'node:zlib';

const W = 4096;

export function encodePng(text) {
  const ascii = text.replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  const body = Buffer.alloc(4 + ascii.length);
  body.writeUInt32BE(ascii.length, 0);
  body.write(ascii, 4, 'latin1');
  const rows = Math.ceil(body.length / W);
  const raw = Buffer.alloc(rows * (W + 1));
  for (let r = 0; r < rows; r++) body.copy(raw, r * (W + 1) + 1, r * W, Math.min(body.length, (r + 1) * W));
  // zlib: header 78 01, các khối stored ≤ 65535, adler32
  const parts = [Buffer.from([0x78, 0x01])];
  for (let i = 0; i < raw.length; i += 65535) {
    const n = Math.min(65535, raw.length - i), h = Buffer.alloc(5);
    h[0] = i + n >= raw.length ? 1 : 0; h.writeUInt16LE(n, 1); h.writeUInt16LE(~n & 0xffff, 3);
    parts.push(h, raw.subarray(i, i + n));
  }
  let a = 1, b = 0;
  for (const x of raw) { a = (a + x) % 65521; b = (b + a) % 65521; }
  const ad = Buffer.alloc(4); ad.writeUInt32BE(((b << 16) | a) >>> 0);
  parts.push(ad);
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(rows, 4); ihdr[8] = 8; ihdr[9] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', Buffer.concat(parts)), chunk('IEND', Buffer.alloc(0))]);
}

/* Bộ giải chạy trong plugin Figma (chuỗi mã, không dùng Buffer/TextDecoder). bytes: Uint8Array của PNG. */
export const DECODE = `function unpack(B){let p=8;const idat=[];let w=0;
while(p<B.length){const n=(B[p]<<24|B[p+1]<<16|B[p+2]<<8|B[p+3])>>>0;const t=String.fromCharCode(B[p+4],B[p+5],B[p+6],B[p+7]);
if(t==='IHDR')w=(B[p+8]<<24|B[p+9]<<16|B[p+10]<<8|B[p+11])>>>0;if(t==='IDAT')idat.push(B.subarray(p+8,p+8+n));p+=12+n;}
let tot=0;for(const c of idat)tot+=c.length;const Z=new Uint8Array(tot);let o=0;for(const c of idat){Z.set(c,o);o+=c.length;}
const raw=[];let q=2,rl=0;for(;;){const fin=Z[q]&1;const n=Z[q+1]|Z[q+2]<<8;raw.push(Z.subarray(q+5,q+5+n));rl+=n;q+=5+n;if(fin)break;}
const R=new Uint8Array(rl);o=0;for(const c of raw){R.set(c,o);o+=c.length;}
const rows=rl/(w+1);const body=new Uint8Array(rows*w);for(let r=0;r<rows;r++)body.set(R.subarray(r*(w+1)+1,(r+1)*(w+1)),r*w);
const len=(body[0]<<24|body[1]<<16|body[2]<<8|body[3])>>>0;let s='';for(let i=4;i<4+len;i+=8192)s+=String.fromCharCode.apply(null,body.subarray(i,Math.min(4+len,i+8192)));
return s;}`;

if (process.argv[1] && process.argv[1].endsWith('figma-pack.mjs') && process.argv[3]) {
  const txt = readFileSync(process.argv[2], 'utf8');
  const png = encodePng(txt);
  writeFileSync(process.argv[3], png);
  const unpack = new Function(DECODE + ';return unpack;')();
  const back = JSON.parse(unpack(new Uint8Array(png)));
  console.log('png', png.length, 'bytes; roundtrip', JSON.stringify(back) === JSON.stringify(JSON.parse(txt)));
}
