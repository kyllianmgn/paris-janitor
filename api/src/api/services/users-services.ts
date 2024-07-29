import {prisma} from "../../utils/prisma";
import bcrypt from "bcrypt";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export type UserWithoutPassword = Omit<User, "password">

export const findUserByEmail = async (email: string): Promise<User|null> => {
    return prisma.user.findFirst({
        where: {email: email}
    });
};

export const getSafeUserByEmail = async (
  email: string
): Promise<UserWithoutPassword | null> => {
    return await findUserByEmail(email);
};

export const verifyUserPassword = async (
  email: string,
  password: string
): Promise<UserWithoutPassword | null> => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;

  return user;
};

export const createUserByEmailAndPassword = (user: any) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  });
};

export const findUserById = async (
  id: number
): Promise<UserWithoutPassword | null> => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const getSafeUserById = async (id: number): Promise<UserWithoutPassword | null> => {
    return await findUserById(id);
};
