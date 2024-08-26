import { prisma } from "../../utils/prisma";
import { hashToken } from "../../utils/token";

export const addRefreshTokenToWhitelist = ({
  jti,
  refreshToken,
  userId,
}: any) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId: userId,
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
      userId: userId,
    },
    data: {
      revoked: true,
    },
  });
};

export const addAdminRefreshTokenToWhitelist = ({jti, refreshToken, adminId,}: any) => {
  return prisma.adminRefreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      adminId: adminId,
    },
  });
};

export const findAdminRefreshTokenById = (id: string) => {
  return prisma.adminRefreshToken.findUnique({
    where: {
      id,
    },
  });
};

export const deleteAdminRefreshToken = (id: string) => {
  return prisma.adminRefreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeAdminTokens = (adminId: number) => {
  return prisma.adminRefreshToken.updateMany({
    where: {
      adminId: adminId,
    },
    data: {
      revoked: true,
    },
  });
};
