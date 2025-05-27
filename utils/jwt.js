import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      userName: user.userName,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EXPIRES_IN,
    }
  );

  return token;
};

export const verifyJwt = (token) => {
  if (!token) {
    throw new Error("Access is denied");
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return verified;
};
