import { User } from "@prisma/client";

export type InputUserRegistration = {
     username : string;
     name : string;
     password : string;
}

export type InputUserLogin = {
     username : string;
     password : string;
}

export type InputUserUpdate = {
     name : string;
     password : string;
}

export type UserOperationOutcome = {
     username : string;
     name : string;
     token? : string;
}

export function convertToUserResponseOutcome(userPayload : User) : UserOperationOutcome {
     return { username: userPayload.username, name: userPayload.name };
}