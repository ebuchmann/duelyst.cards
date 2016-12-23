/*
  Remaps card IDs to the base. Numbers over a million are either skins or prismatics
  1000501 -> 501
*/

export const mapId = (cardId) => {
  let card = cardId;
  if (Number(cardId) > 1000000) {
    const start = cardId.match(/(^[1-9]0+)/)[1];
    card = cardId.substr(start.length);
  }

  return Number(card);
}

/*
  Remaps certain general ids, such as special skins back to their base ID
*/
export const remapGenerals = (generalId) => {
  const id = Number(generalId);
  if ([1, 1000001, 2000001, 3000001, 4000001, 5000001].includes(id)) return 1; // Argeon
  if ([23, 1000023, 2000023, 3000023].includes(id)) return 23; // Zir'an
  if ([101, 1000101, 2000101, 3000101, 4000101, 5000101].includes(id)) return 101; // Kaleos
  if ([123, 1000123, 2000123, 3000123].includes(id)) return 123; // Reva
  if ([201, 1000201, 2000201, 3000201].includes(id)) return 201; // Xirix
  if ([223, 1000223, 2000223, 3000223].includes(id)) return 223; // Sajj
  if ([301, 1000301, 2000301, 3000301].includes(id)) return 301; // Lilthe
  if ([323, 1000323, 2000323, 3000323].includes(id)) return 323; // Cassyva
  if ([401, 1000401, 2000401, 3000401].includes(id)) return 401; // Vaath
  if ([418, 1000418, 2000418, 3000418].includes(id)) return 418; // Starhorn
  if ([501, 1000501, 2000501, 3000501].includes(id)) return 501; // Faie
  if ([527, 1000527, 2000527, 3000527].includes(id)) return 527; // Kara

  return id;
}

export const cleanMatch = (match) => {
  const newMatch = Object.assign({}, match);
  newMatch.opponentGeneralId = remapGenerals(newMatch.opponentGeneralId);

  return newMatch;
}