import supertest, { Response } from "supertest";
import { TestUtil } from "./util/test-util";
import { webApplication } from "../src/app/web";
import { Address, Contact } from "@prisma/client";

describe("Test create address operation -> POST /api/v1/contacts/:contactId/Address", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteAddress();
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should to be able a new address", async () : Promise<void> => {
          let login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie : string = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();

          const create : Response = await supertest(webApplication)
               .post(`/api/v1/contacts/${getContact?.id}/addresses`)
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    country: "Indonesia",
                    city: "Makasar",
                    province: "Jawa Barat",
                    street: "Jl. Sindang sana 7777",
                    postal_code: "52156"
               });

          console.info(create.body);
          
          expect(create.statusCode).toBe(200);
          expect(create.body.data.country).toBe("Indonesia");
          expect(create.body.data.city).toBe("Makasar");
          expect(create.body.data.province).toBe("Jawa Barat");
          expect(create.body.data.street).toBe("Jl. Sindang sana 7777");
          expect(create.body.data.postal_code).toBe("52156");
     });

     it("should reject if token is wrongggggg", async () : Promise<void> => {
          let login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie : string = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();

          const create : Response = await supertest(webApplication)
               .post(`/api/v1/contacts/${getContact?.id}/addresses`)
               .set("Cookie", `salah`)
               .send({
                    country: "Indonesia",
                    city: "Makasar",
                    province: "Jawa Barat",
                    street: "Jl. Sindang sana 7777",
                    postal_code: "52156"
               });

          console.info(create.body);

          expect(create.statusCode).toBe(400);
          expect(create.body.errors).toBe("Unauthorized");
     });

     it("should reject if id is invalid", async () : Promise<void> => {
          let login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          const getTokenFromCookie : string = login.headers["set-cookie"][0];

          console.info(getTokenFromCookie);

          expect(login.statusCode).toBe(200);
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const getContact : Contact | null = await TestUtil.getContact();

          if (getContact) {
               const create : Response = await supertest(webApplication)
               .post(`/api/v1/contacts/${getContact?.id + 1}/addresses`)
               .set("Cookie", `${getTokenFromCookie}`)
               .send({
                    country: "Indonesia",
                    city: "Makasar",
                    province: "Jawa Barat",
                    street: "Jl. Sindang sana 7777",
                    postal_code: "52156"
               });

               console.info(create.body);

               expect(create.statusCode).toBe(404);
               expect(create.body.errors).toBe("Contact not found");
          }
     });

});

describe("Test get address operation -> GET /api/v1/contacts/:contactId/addresses/:addressId", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
          
          const getContact = await TestUtil.getContact();
          await TestUtil.createAddress(getContact?.id!);
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteAddress();
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can get addresses", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          const get : Response = await supertest(webApplication)
               .get(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id}`)
               .set("Cookie", `${token}`);

          console.info(get.body);

          expect(get.statusCode).toBe(200);
          expect(get.body.data.id).toBeDefined();
          expect(get.body.data.country).toBe("Indonesia");
          expect(get.body.data.city).toBe("Semarang");
          expect(get.body.data.province).toBe("Jawa Barat");
          expect(get.body.data.street).toBe("Jl. Sindang sana 7777");
          expect(get.body.data.postal_code).toBe("52156");
     });

     it("should reject if id is invalid", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          if (getAddress) {
               const get : Response = await supertest(webApplication)
                    .get(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id + 1}`)
                    .set("Cookie", `${token}`);

               console.info(get.body);

               expect(get.statusCode).toBe(404);
               expect(get.body.errors).toBeDefined();
          }
     });
});

describe("Test update addresses operation -> PUT /api/v1/contacts/:contactId/address/addressId", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
          
          const getContact = await TestUtil.getContact();
          await TestUtil.createAddress(getContact?.id!);
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteAddress();
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can update address", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          const update : Response = await supertest(webApplication)
               .put(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id}`)
               .set("Cookie", `${token}`)
               .send({
                    country: "Rusia",
                    street: "Jl Sindang Sono 7777"
               });

          console.info(update.body);

          expect(update.statusCode).toBe(200);
          expect(update.body.data.id).toBeDefined();
          expect(update.body.data.country).toBe("Rusia");
          expect(update.body.data.city).toBe("Semarang");
          expect(update.body.data.province).toBe("Jawa Barat");
          expect(update.body.data.street).toBe("Jl Sindang Sono 7777");
          expect(update.body.data.postal_code).toBe("52156");
     });

     it("should reject if id is invalidd", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          if (getAddress) {
               const update : Response = await supertest(webApplication)
                    .put(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id + 1}`)
                    .set("Cookie", `${token}`)
                    .send({
                         country: "Rusia",
                         street: "Jl Sindang Sono 7777"
                    });

               console.info(update.body);

               expect(update.statusCode).toBe(404);
               expect(update.body.errors).toBeDefined();
          }
     });

     it("should reject if data is invalidd", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          const update : Response = await supertest(webApplication)
               .put(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id}`)
               .set("Cookie", `${token}`)
               .send({
                    country: "",
                    street: ""
               });

          console.info(update.body);

          expect(update.statusCode).toBe(400);
          expect(update.body.errors).toBeDefined();
     });

});

describe("Test remove address operation, DELETE /api/v1/contacts/:contactId/addresses/:addressId", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
          
          const getContact = await TestUtil.getContact();
          await TestUtil.createAddress(getContact?.id!);
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteAddress();
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can remove address", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          const remove: Response = await supertest(webApplication)
               .delete(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id}`)
               .set("Cookie", `${token}`)

          console.info(remove.body);

          expect(remove.statusCode).toBe(200);
          expect(remove.body.data).toBe("Successfully");
     });

     it("should reject if id is invaliddddd", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          if (getAddress) {
               const remove: Response = await supertest(webApplication)
                    .delete(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id + 1}`)
                    .set("Cookie", `${token}`)

               console.info(remove.body);

               expect(remove.statusCode).toBe(404);
               expect(remove.body.errors).toBeDefined();
          }
     });

     it("should reject if token is invaliddddd", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          if (getAddress) {
               const remove: Response = await supertest(webApplication)
                    .delete(`/api/v1/contacts/${getContact?.id}/addresses/${getAddress?.id}`)
                    .set("Cookie", `salah`)

               console.info(remove.body);

               expect(remove.statusCode).toBe(400);
               expect(remove.body.errors).toBeDefined();
          }
     });

});

describe("Test get list by contact id, GET /api/v1/contacts/:contactId/addresses", () => {

     beforeEach(async () : Promise<void> => {
          await TestUtil.createUser();
          await TestUtil.createContact();
          
          const getContact = await TestUtil.getContact();
          await TestUtil.createAddress(getContact?.id!);
     });

     afterEach(async () : Promise<void> => {
          await TestUtil.deleteAddress();
          await TestUtil.deleteContact();
          await TestUtil.deleteUser();
     });

     it("should can get list address", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          const getList: Response = await supertest(webApplication)
               .get(`/api/v1/contacts/${getContact?.id}/addresses`)
               .set("Cookie", `${token}`);

          console.info(getList.body);

          expect(getList.statusCode).toBe(200);
          expect(getList.body.data).toHaveLength(1);
     });


     it("should reject if id address is invalidddddd", async () => {
          const login : Response = await supertest(webApplication)
               .post("/api/v1/users/login")
               .send({
                    username: "testt",
                    password: "Testt"
               });

          expect(login.statusCode).toBe(200);
          expect(login.headers["set-cookie"][0]).toBeDefined();
          expect(login.body.data.username).toBe("testt");
          expect(login.body.data.name).toBe("testt");

          const token : string = login.headers["set-cookie"][0];

          const getContact : Contact | null = await TestUtil.getContact();

          console.info(getContact);

          const getAddress : Address | null = await TestUtil.getAddress(getContact?.id!);

          console.info(getAddress);

          if (getContact) {
               const getList: Response = await supertest(webApplication)
                    .get(`/api/v1/contacts/${getContact?.id + 1}/addresses`)
                    .set("Cookie", `${token}`);

               console.info(getList.body);

               expect(getList.statusCode).toBe(404);
               expect(getList.body.errors).toBeDefined();
          }
     });
     
});