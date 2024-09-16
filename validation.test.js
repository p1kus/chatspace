const validate = require("./validation");

const generateNames = (nameCount) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789ąńļźęóiĘŻ`=+_-)(*&^%#@!~   ;'[]/.,;<>?:{}|\"";
  let names = [];

  for (let i = 0; i <= nameCount; i++) {
    let name = "";
    let randomLength = Math.floor(Math.random() * (16 - 3 + 1) + 3);
    for (let j = 0; j <= randomLength; j++) {
      name += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    names.push(name);
  }
  return names;
};

test("Testing pattern validation with goodArray", () => {
  const goodArray = ["pssdd", "user", "me21", "proskater123"];

  goodArray.forEach((item) => {
    expect(validate(item)).toBe(true);
  });
});

test("Testing pattern validation with randomArray", () => {
  const randomArray = generateNames(24);

  randomArray.forEach((item) => {
    if (validate(item) === false) {
      expect(validate(item)).toBe(false);
    } else {
      throw new Error(`Validation passed on item ${item}`);
    }
  });
  // This test is supposed to find any weird validation passes,
  // if a random string gets validated, it throws an
  // error allowing you to take a look if the generated string
  // is actually correct (happens often) or if it's a validation error.
  // IT FAILS OFTEN BY DESIGN
});

test("Testing pattern validation with badArray", () => {
  const badArray = ["admin", "piku's", "m1", "  "];
  for (const item of badArray) {
    expect(validate(item)).toBe(false);
  }
});
