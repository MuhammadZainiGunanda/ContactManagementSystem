import supertest, { Response } from "supertest";
import { TestUtil } from "./util/test-util";
import { web } from '../src/app/web';

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