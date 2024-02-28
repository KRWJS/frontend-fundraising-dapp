// Render account address as 0x2a...796
export const shortAddress = (address: string) => {
  return `${address.slice(0, 3)}...${address.slice(-3)}`;
};
