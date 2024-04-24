import supertest, { Response } from "supertest";
import { web } from '../src/app/web';
import { TestUtil } from "./util/test-util";

describe("Test registration operation -> POST : /api/users/register", () : void => {

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteUser();
     });

     it("should to be able a new user register", async () : Promise<void> => {
          const response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);
          
          expect(response.statusCode).toBe(200);
          expect(response.body.data.username).toBe("testt");
          expect(response.body.data.name).toBe("testt");
     });

     it("should reject if data is invalid", async () : Promise<void> => {
          const response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "",
                    name: "",
                    password: ""
               });

          console.info(response.body);
          
          expect(response.statusCode).toBe(400);
          expect(response.body.errors).toHaveLength(4);
          expect(response.body.errors[0]).toBeDefined();
          expect(response.body.errors[1]).toBeDefined();
          expect(response.body.errors[2]).toBeDefined();
          expect(response.body.errors[3]).toBeDefined();
     });

     it("should reject if user is already exitst", async () : Promise<void> => {
          let response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);
          
          expect(response.statusCode).toBe(200);
          expect(response.body.data.username).toBe("testt");
          expect(response.body.data.name).toBe("testt");

          response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);

          expect(response.statusCode).toBe(401);
          expect(response.body.errors).toBe("User already exists");
     });
     
});

describe("Test login operation -> POST : /api/users/login", () : void => {

     beforeEach(async function createUserBeforeTest() : Promise<void> {
          await TestUtil.createUser();
     });

     afterEach(async function removeUserAfterTest() : Promise<void> {
          await TestUtil.deleteUser();
     });

     it("should to be able user login", async () : Promise<void> => {
          const response : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(response.body);
          console.info(response.headers);
          console.info(response.headers["set-cookie"][0]);

          expect(response.statusCode).toBe(200);
          expect(response.headers["set-cookie"][0]).toBeDefined();

          expect(response.body.data.username).toBe("testt");
          expect(response.body.data.name).toBe("testt");
     });

     it("should reject if data is invalid", async () : Promise<void> => {
          const response : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "",
                    password: ""
               });

          console.info(response.body);
          console.info(response.headers);
          console.info(response.headers["set-cookie"]);
          
          expect(response.statusCode).toBe(400);
          expect(response.headers["set-cookie"]).toBeUndefined();
          
          expect(response.body.errors).toHaveLength(3);
          expect(response.body.errors[0]).toBeDefined();
          expect(response.body.errors[1]).toBeDefined();
          expect(response.body.errors[2]).toBeDefined();
     });

     it("should reject if data is wrong", async () : Promise<void> => {
          const response : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testSalah",
                    password: "testSalah"
               });

          console.info(response.body);
          
          expect(response.statusCode).toBe(401);
          expect(response.body.errors).toBe("Username or password is wrong");
     });

});

describe("Test get operastion -> GET : /api/users/me", () : void => {
     
     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteUser();
     });

     it("should to be able get user", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers["set-cookie"][0]);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          const getTokenFromCookies = login.headers["set-cookie"][0];

          console.info(getTokenFromCookies);

          let get : Response = await supertest(web)
               .get("/api/users/me")
               .set("Cookie", `${getTokenFromCookies}`);

          console.info(get.body);
          
          expect(get.statusCode).toBe(200);
          expect(get.body.data.username).toBe("testt");
          expect(get.body.data.name).toBe("testt");
     });

     it("should Unauthorized if token is invalid", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          const getTokenFromCookies = login.headers["set-cookie"][0];

          let get : Response = await supertest(web)
               .get("/api/users/me")
               .set("Cookie", `salah`);
          
          expect(get.statusCode).toBe(400);
          expect(get.body.errors).toBeDefined();
     });

});

describe("Test update operation -> PATH /api/users/update", () : void => {

     beforeEach(async () => {
          await TestUtil.createUser();
     });

     afterEach(async () => {
          await TestUtil.deleteUser();
     });

     it("should to be able update user data name", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          let getTokenFromCookies = login.headers["set-cookie"][0];

          let update : Response = await supertest(web)
               .patch("/api/users/update")
               .set("Cookie", `${getTokenFromCookies}`)
               .send({
                    name: "testlagi",
               });
          
          console.info(update.body);
          
          expect(update.statusCode).toBe(200);
          expect(update.body.data.username).toBe("testt");
          expect(update.body.data.name).toBe("testlagi");
     });

     it("should to be able update user data password", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          let getTokenFromCookies = login.headers["set-cookie"][0];

          let update : Response = await supertest(web)
               .patch("/api/users/update")
               .set("Cookie", `${getTokenFromCookies}`)
               .send({
                    password: "TestLagi",
               });
          
          console.info(update.body);
          
          expect(update.statusCode).toBe(200);
          expect(update.body.data.username).toBe("testt");
          expect(update.body.data.name).toBe("testt");
     });

     it("should reject if data is invalid", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          let getTokenFromCookies = login.headers["set-cookie"][0];

          let update : Response = await supertest(web)
               .patch("/api/users/update")
               .set("Cookie", `${getTokenFromCookies}`)
               .send({
                    username: "",
                    password: "",
               });
          
          console.info(update.body);
          
          expect(update.statusCode).toBe(400);
          expect(update.body.errors).toBeDefined();
     });

     it("should reject if token is invalid", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          let getTokenFromCookies = login.headers["set-cookie"][0];

          let update : Response = await supertest(web)
               .patch("/api/users/update")
               .set("Cookie", `salah`)
               .send({
                    username: "testlagi",
                    password: "TestLagi",
               });
          
          console.info(update.body);
          
          expect(update.statusCode).toBe(400);
          expect(update.body.errors).toBeDefined();
     });

});

describe("Test logout operation -> DELETE /api/users/logout", () : void => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteUser();
     });

     it("should to be able to user logout", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          const getTokenFromCookies = login.header["set-cookie"][0];

          let logout : Response = await supertest(web)
               .delete("/api/users/logout")
               .set("Cookie", `${getTokenFromCookies}`);

          console.info(logout.header["set-cookie"]);

          expect(logout.statusCode).toBe(200);
          expect(logout.headers["set-cookie"]).toBeDefined();
          expect(logout.body.data).toBe("OK");
     });

     it("should reject if token is invalid", async () : Promise<void> => {
          let login : Response = await supertest(web)
               .post("/api/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          console.info(login.body);
          console.info(login.headers);
          
          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");
          expect(login.header["set-cookie"][0]).toBeDefined();

          const getTokenFromCookies = login.header["set-cookie"][0];

          let logout : Response = await supertest(web)
               .delete("/api/users/logout")
               .set("Cookie", `salah`);

          console.info(logout.header["set-cookie"]);

          expect(logout.statusCode).toBe(400);
          expect(logout.headers["set-cookie"]).toBeUndefined();
          expect(logout.body.errors).toBeDefined();
     });

});