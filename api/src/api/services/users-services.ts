import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";

export const findUserByEmail = async (
  email: string
): Promise<User> => {
  return prisma.users.findFirst({
    where: { email },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });
};

export const getSafeUserByEmail = async (
  email: string
): Promise<SafeUser | null> => {
  const user = await findUserByEmail(email);
  return user ? transformUserToSafeUser(user) : null;
};

export const verifyUserPassword = async (
  email: string,
  password: string
): Promise<SafeUser | null> => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;

  return transformUserToSafeUser(user);
};

export const createUserByEmailAndPassword = (user: any) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.users.create({
    data: user,
  });
};

export const findUserById = async (
  id: number
): Promise<UserWithMemberships | null> => {
  return prisma.users.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });
};

export const getSafeUserById = async (id: number): Promise<SafeUser | null> => {
  const user = await findUserById(id);
  return user ? transformUserToSafeUser(user) : null;
};
