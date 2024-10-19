import { TimeTracking } from "./base";

export type User = {
    id: number,
    firstName: string | null,
    lastName: string | null,
    fullName: string | null,
    profilePicture: string | null,
    userName: string | null,
    phoneNumber: string | null,
    email: string | null,
} & TimeTracking

export type UserCreationPayload = Omit<User, 'id' | keyof TimeTracking>;

export type UserUpdatePayload = Partial<User>;
