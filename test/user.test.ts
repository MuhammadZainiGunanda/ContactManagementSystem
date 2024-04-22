import supertest, { Response } from "supertest";
import { web } from '../src/app/web';
import { TestUtil } from "./util/test-util";

describe("Test registration operastion -> POST : /api/users/register", function () {

     afterEach(async function removeUserAfterTest() : Promise<void> {
          await TestUtil.deleteUser();
     });

     it("should to be able a new user register", async function() {
          const response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);

          expect(response.body.data.username).toBe("testt");
          expect(response.body.data.name).toBe("testt");
     });

     it("should reject if data is invalid", async function () {
          const response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "",
                    name: "",
                    password: ""
               });

          console.info(response.body);

          expect(response.body.errors).toHaveLength(4);
          expect(response.body.errors[0]).toBeDefined();
          expect(response.body.errors[1]).toBeDefined();
          expect(response.body.errors[2]).toBeDefined();
          expect(response.body.errors[3]).toBeDefined();
     });

     it("should reject if user is already exitst", async function () {
          let response : Response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);
          
          expect(response.body.data).toBeDefined();

          response = await supertest(web)
               .post("/api/users/register")
               .send({
                    username: "testt",
                    name: "testt",
                    password: "Testt"
               });

          console.info(response.body);

          expect(response.body.errors).toBeDefined();
     });
     
});