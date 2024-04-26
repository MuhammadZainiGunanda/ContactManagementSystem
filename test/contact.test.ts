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

describe("Test update contact operation -> PUT /api/contacts/:contactId", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can update data contact", async () => {
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

          let update : Response = await supertest(web)
               .put(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    first_name: "testLagi",
                    last_name: "testLagi",
                    email: "testlagi@gmail.com",
                    phone: "0879765477"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(200);
          expect(update.body.data.id).toBeDefined();
          expect(update.body.data.first_name).toBe("testLagi");
          expect(update.body.data.last_name).toBe("testLagi");
          expect(update.body.data.email).toBe("testlagi@gmail.com");
          expect(update.body.data.phone).toBe("0879765477");
     });

     it("should reject if data invalid", async () : Promise<void> => {
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

          let update : Response = await supertest(web)
               .put(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: ""
               });

          console.info(update.body);
          console.info(update.body.errors);

          expect(update.statusCode).toBe(400);
          expect(update.body.errors).toBeDefined();
     });

     it("should reject if token is wrong", async () : Promise<void> => {
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

          let update : Response = await supertest(web)
               .put(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `salah`)
               .send({
                    first_name: "testLagi",
                    last_name: "testLagi",
                    email: "testlagi@gmail.com",
                    phone: "0879765477"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(400);
          expect(update.body.errors).toBeDefined();
     });

});

describe("Test delete contact operation -> DELETE /api/contacts/:contactId", () => {

     beforeEach(async () => {
          await TestUtil.createUser();
          await TestUtil.createContact();
     });

     afterEach(async () => {
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should to be able to remove contact by id", async () => {
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

          let remove : Response = await supertest(web)
               .delete(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(remove.body);

          expect(remove.statusCode).toBe(200);
          expect(remove.body.data).toBe("Successfully");
     });

     it("should reject if token is invalid or wrong", async () => {
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

          let remove : Response = await supertest(web)
               .delete(`/api/contacts/${getContact?.id}`)
               .set("Cookie", `salah`);

          console.info(remove.body);

          expect(remove.statusCode).toBe(400);
          expect(remove.body.errors).toBe("Unauthorized");
     });

     it("should reject if id is invalid", async () => {
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

          if(getContact) {
               let remove : Response = await supertest(web)
                    .delete(`/api/contacts/${getContact?.id + 1}`)
                    .set("Cookie", `salah`);

               console.info(remove.body);

               expect(remove.statusCode).toBe(400);
               expect(remove.body.errors).toBe("Unauthorized");
          }
     });

});

describe("Test search contact operation -> GET /api/contact/search", () => {

     beforeEach(async () => {
          await TestUtil.createUser();
          await TestUtil.createContact();
     });

     afterEach(async () => {
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should be able to search contact", async () => {
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

          let search : Response = await supertest(web)
               .get("/api/contacts/search")
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(search.body);

          expect(search.statusCode).toBe(200);
          expect(search.body.data).toHaveLength(1);
          expect(search.body.paging.size).toBe(1);
          expect(search.body.paging.total_page).toBe(1);
          expect(search.body.paging.current_page).toBe(1);
     });

     it("should to be able search contact using name", async () => {
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

          let search : Response = await supertest(web)
               .get("/api/contacts/search")
               .query({ name: "es"})
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(search.body);

          expect(search.statusCode).toBe(200);
          expect(search.body.data).toHaveLength(1);
          expect(search.body.paging.size).toBe(1);
          expect(search.body.paging.total_page).toBe(1);
          expect(search.body.paging.current_page).toBe(1);
     });

     it("should to be able search contact using email", async () => {
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

          let search : Response = await supertest(web)
               .get("/api/contacts/search")
               .query({ email: ".com"})
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(search.body);

          expect(search.statusCode).toBe(200);
          expect(search.body.data).toHaveLength(1);
          expect(search.body.paging.size).toBe(1);
          expect(search.body.paging.total_page).toBe(1);
          expect(search.body.paging.current_page).toBe(1);
     });

     it("should to be able search contact using phone", async () => {
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

          let search : Response = await supertest(web)
               .get("/api/contacts/search")
               .query({ phone: "5"})
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(search.body);

          expect(search.statusCode).toBe(200);
          expect(search.body.data).toHaveLength(1);
          expect(search.body.paging.size).toBe(1);
          expect(search.body.paging.total_page).toBe(1);
          expect(search.body.paging.current_page).toBe(1);
     });

     it("should reject if contact does not exist", async () => {
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

          let search : Response = await supertest(web)
               .get("/api/contacts/search")
               .query({ name: "blank"})
               .set("Cookie", `${getTokenFromCookie}`);

          console.info(search.body);

          expect(search.statusCode).toBe(200);
          expect(search.body.data).toHaveLength(0);
          expect(search.body.paging.size).toBe(1);
          expect(search.body.paging.total_page).toBe(0);
          expect(search.body.paging.current_page).toBe(1);
     });

});