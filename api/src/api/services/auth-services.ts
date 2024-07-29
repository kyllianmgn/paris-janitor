import { prisma } from "../../utils/prisma";
import { hashToken } from "../../utils/token";

interface Members {
  id: number;
  memberShipType: string;
  status: string;
  organization: {
    id: number;
    name: string;
  };
  isAdmin: boolean;
}

export const addRefreshTokenToWhitelist = ({
  jti,
  refreshToken,
  userId,
}: any) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashed_token: hashToken(refreshToken),
      user_id: userId,
    },
  });
};

export const findRefreshTokenById = (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

export const findMembersByUserId = (userId: number) => {
  return prisma.members.findMany({
    where: { userId: userId },
    include: { organization: true },
  });
};

export const deleteRefreshToken = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: number) => {
  return prisma.refreshToken.updateMany({
    where: {
      user_id: userId,
    },
    data: {
      revoked: true,
    },
  });
};
