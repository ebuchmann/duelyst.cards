/*
  Remaps certain card ids (skins) to the base card id:

  Saberspine tiger = 10012
    Snow skin = 2010012
*/

export const mapId = (cardId) => {
  const numericalId = Number(cardId);
  if (numericalId === 2010012) return 10012;

  return numericalId;
}

/*
  Remaps certain general ids, such as special skins back to their base ID
  Argeon -> 1, 1000001, 2000001, 3000001, 4000001, 5000001
  Zir'an -> 23, 1000023, 2000023, 3000023
  Kaleos -> 101, 1000101, 2000101, 3000101, 4000101, 5000101
  Reva -> 123, 1000123, 2000123, 3000123
  Xirix -> 201, 1000201, 2000201, 3000201
  Sajj -> 223, 1000223, 2000223, 3000223
  Lilthe -> 301, 1000301, 2000301, 3000301
  Cassyva -> 323, 1000323, 2000323, 3000323
  Vaath -> 401, 1000401, 2000401, 3000401
  Starhorn -> 418, 1000418, 2000418, 3000418
  Faie -> 501, 1000501, 2000501, 3000501
  Kara -> 527, 1000527, 2000527, 3000527
*/
export const remapGenerals = (generalId) => {
  const id = Number(generalId);
  if ([1, 1000001, 2000001, 3000001, 4000001, 5000001].includes(id)) return 1;
  if ([23, 1000023, 2000023, 3000023].includes(id)) return 23;
  if ([101, 1000101, 2000101, 3000101, 4000101, 5000101].includes(id)) return 101;
  if ([123, 1000123, 2000123, 3000123].includes(id)) return 123;
  if ([201, 1000201, 2000201, 3000201].includes(id)) return 201;
  if ([223, 1000223, 2000223, 3000223].includes(id)) return 223;
  if ([301, 1000301, 2000301, 3000301].includes(id)) return 301;
  if ([323, 1000323, 2000323, 3000323].includes(id)) return 323;
  if ([401, 1000401, 2000401, 3000401].includes(id)) return 401;
  if ([418, 1000418, 2000418, 3000418].includes(id)) return 418;
  if ([501, 1000501, 2000501, 3000501].includes(id)) return 501;
  if ([527, 1000527, 2000527, 3000527].includes(id)) return 527;

  return id;
}