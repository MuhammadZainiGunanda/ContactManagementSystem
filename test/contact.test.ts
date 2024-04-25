import supertest, { Response } from "supertest";
import { TestUtil } from "./util/test-util";
import { web } from '../src/app/web';
import { Contact } from "@prisma/client";

describe("Test create operation -> POST /api/contacts/", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can a new create contact", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const create : Response = await supertest(web)
               .post("/api/contacts")
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    first_name: "testt",
                    last_name: "testt",
                    email: "test@gmail.com",
                    phone: "0897436582"
               });
          
          console.info(create.body);

          expect(create.body.data.id).toBeDefined();
          expect(create.body.data.first_name).toBe("testt");
          expect(create.body.data.last_name).toBe("testt");
          expect(create.body.data.email).toBe("test@gmail.com");
          expect(create.body.data.phone).toBe("0897436582");
     });

     it("should reject if data is invalid", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const create : Response = await supertest(web)
               .post("/api/contacts")
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: ""
               });
          
          console.info(create.body);

          expect(create.statusCode).toBe(400);
          expect(create.body.errors).toBeDefined();
     });

     it("should reject if token is wronggg", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const create : Response = await supertest(web)
               .post("/api/contacts")
               .set("Cookie", `salah`)
               .send({
                    first_name: "testt",
                    last_name: "testt",
                    email: "test@gmail.com",
                    phone: "0897436582"
               });

          console.info(create.body);

          expect(create.statusCode).toBe(400);
          expect(create.body.errors).toBeDefined();
     });

});

describe("Test get contact operation -> GET /api/contacts/:contactId", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can to get contact", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();

          let get : Response = await supertest(web)
               .get(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `${getTokenFromCookie}`);
               
          expect(get.statusCode).toBe(200);
          expect(get.body.data.id).toBe(Number(`${getContact?.id}`));
          expect(get.body.data.first_name).toBe(`${getContact?.first_name}`);
          expect(get.body.data.last_name).toBe(`${getContact?.last_name}`);
          expect(get.body.data.email).toBe(`${getContact?.email}`);
          expect(get.body.data.phone).toBe(`${getContact?.phone}`);
     });

     it("should reject if contact id is not found", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie : string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();
          
          if (getContact) {
               let get : Response = await supertest(web)
                    .get(`/api/contacts/${getContact?.id + 1}`)
                    .set("Cookie", `${getTokenFromCookie}`)

               console.info(get.body.errors);

               expect(get.statusCode).toBe(404);
               expect(get.body.errors).toBe("Contact not found");
          }
     });

     it("should reject if invalid token", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });
          
          const getTokenFromCookie : string = login.headers["set-cookie"][0];

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();

          let get : Response = await supertest(web)
               .get(`/api/contacts/${getContact?.id}`)
               .set("Cookie", "salah")

          expect(get.statusCode).toBe(400);
          expect(get.body.errors).toBeDefined();
     });

});