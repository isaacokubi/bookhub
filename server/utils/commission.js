const PLATFORM_FEE = 0.05;

export const calculateCommission = (amount) => {
  const fee = amount * PLATFORM_FEE;

  const sellerAmount = amount - fee;

  return {
    fee,

    sellerAmount,
  };
};
