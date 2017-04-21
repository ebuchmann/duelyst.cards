import { verifyHash } from '../../src/utils/encoding';

describe('verifyHash', () => {
  test('verifies a correct hash', () => {
    const correctHash = 'MTpnZW5lcmFsOjUwMSwxOm1haW5ib2FyZDoyMDEzOSwzOm1haW5ib2FyZDoyMDE1MCwyOm1haW5ib2FyZDoyMDE0NCwyOm1haW5ib2FyZDozMDAzMSwzOm1haW5ib2FyZDoyMDIxNCwzOnNpZGVib2FyZDoyMDEzOQ=='
    expect(verifyHash(correctHash)).toBeTruthy();
  });
});
