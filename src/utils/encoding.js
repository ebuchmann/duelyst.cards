const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const base = alphabet.length;

export const encode = (num) => {
  let encoded = '';
  while (num) {
    const remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
};

export const decode = (str) => {
  let decoded = 0;
  while (str) {
    const index = alphabet.indexOf(str[0]);
    const power = str.length - 1;
    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
};

// Verify the hash follows the format (1-3):deckSegment:(any numbers)
export const verifyHash = (hash) => {
  const reg = /^([1-3]:(general|mainboard|sideboard):\d+(,|$))+?$/g
  return reg.test(atob(hash))
};
