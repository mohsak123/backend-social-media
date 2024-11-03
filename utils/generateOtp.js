const generateOtp = async () => {
  try {
    return (otp = `${Math.floor(10000 + Math.random() * 90000)}`);
  } catch (error) {
    throw error;
  }
};

module.exports = generateOtp;
