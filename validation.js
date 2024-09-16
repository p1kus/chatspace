const validate = (data) => {
  let pattern = /^[A-Za-z0-9]{3,16}$/;
  let blacklist = ["Admin", "System", "Sys", "Mod", "Moderator"];
  let str = data;
  // receives a string
  const blacklistCheck = () => {
    return blacklist.findIndex(
      (item) => str.toLowerCase() === item.toLowerCase()
    );
  };
  // checks against the blacklisted names

  // if both okay, return true
  let patternCheck = pattern.test(str);
  // checks against the pattern
  blacklistCheck();
  if (patternCheck === true && blacklistCheck() === -1) {
    return true;
  } else {
    return false;
  }
  // if not, throw error,
};
// console.log(validate("admin"));
