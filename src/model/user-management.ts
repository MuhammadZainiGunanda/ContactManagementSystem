import { User } from "@prisma/client";

// Tipe data untuk input proses registrasi
export type InputUserRegistration = {
     username : string;
     name : string;
     password : string;
}

// Tipe data untuk input proses login user
export type InputUserLogin = {
     username : string;
     password : string;
}

// Tipe data untuk input proses update user
export type InputUserUpdate = {
     name : string;
     password : string;
}

// Tipe data untuk proses terkait
export type UserOperationOutcome = {
     username : string;
     name : string;
     token? : string;
}

// Method untuk konveri payload user dari Prisma
export function convertToUserResponseOutcome(userPayload : User) : UserOperationOutcome {
     return { username: userPayload.username, name: userPayload.name };
}