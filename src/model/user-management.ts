import { User } from "@prisma/client";

// Representasi hasil operasi terkait alamat
export type UserOperationOutcome = {
     username : string;
     name : string;
     token? : string;
}

// Request untuk registrasi user
export type UserRegistrationRequest = {
     username : string;
     name : string;
     password : string;
}

// Request untuk login user
export type UserLoginRequest = {
     username : string;
     password : string;
}

// Request untuk update user
export type UserUpdateRequest = {
     name : string;
     password : string;
}

// Konversi user menjadi hasil operasi user
export function convertToUserResponseOutcome(userPayload : User) : UserOperationOutcome {
     return { username: userPayload.username, name: userPayload.name };
}