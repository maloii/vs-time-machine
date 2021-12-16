export const crc8 = (data: string | Buffer): number => {
  if (!Buffer.isBuffer(data)) data = Buffer.from(data);
  let crc = 0;

  // @ts-ignore
  for (let b of data) {
    for (let j = 0; j < 8; j++) {
      const mix = (crc ^ b) & 0x01;
      crc >>= 1;
      if (mix === 1) crc ^= 0x8c;
      b >>= 1;
    }
    crc &= 0xff;
  }

  return crc & 0xff;
};
