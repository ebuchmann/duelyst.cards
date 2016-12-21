/**
 * Generates a unique api key and returns it
 */

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateApiKey = () => {
  let token = '';

  do {
    const rand = Math.floor(Math.random() * alphabet.length)
    token = token + alphabet.charAt(rand);
  } while (token.length < 15)

  return `api_${Date.now()}_${token}`;
}