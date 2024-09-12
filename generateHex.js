export const generateHex = () => {
  const chars = "0123456789abcdef";
  let hex = "#";
  for (let i = 0; i <= 5; i++) {
    hex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hex;
};
