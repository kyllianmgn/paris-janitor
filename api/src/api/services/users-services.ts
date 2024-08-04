import {prisma} from "../../utils/prisma";
import bcrypt from "bcrypt";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    Landlord?: Role|null,
    Traveler?: Role|null,
    ServiceProvider?: Role|null,
}

interface Role{
    id: number,
    userId: number
}

export type UserWithoutPassword = Omit<User, "password">

export interface Admin {
    id: number,
    username: string,
    password: string
}

export type AdminWithoutPassword = Omit<Admin, "password">

export const findUserByEmail = async (email: string): Promise<User|null> => {
    return prisma.user.findFirst({
        where: {email: email},
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            Landlord: true,
            Traveler: true,
            ServiceProvider: true,
        }
    });
};

export const findAdminByUsername = async (username: string): Promise<Admin|null> => {
    return prisma.admin.findFirst({
        where: {username: username}
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

export const verifyAdminPassword = async (
    username: string,
    password: string
): Promise<AdminWithoutPassword | null> => {
    const admin = await findAdminByUsername(username);
    if (!admin) return null;

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return null;

    return admin;
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

export const findAdminById = async (
    id: number
): Promise<AdminWithoutPassword | null> => {
    return prisma.admin.findUnique({
        where: { id }
    });
};

export const getSafeUserById = async (id: number): Promise<UserWithoutPassword | null> => {
    return await findUserById(id);
};
