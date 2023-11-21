const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints= require("../endpoints.json")
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const { expect } = require("@jest/globals");


beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());


describe("/api/topics", () => {
  test("GET:200 sends an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        expect(response.body.topics).toEqual(expect.arrayContaining([
          {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch'
          },
          {
            description: 'Not dogs',
            slug: 'cats'
          },
          {
            description: 'what books are made of',
            slug: 'paper'
          }]));
        
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
          
        });
      });
  });

  test("GET:404 sends an NOT FOUND error if there is an invalid endpoint", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("path not found");
      });
  });
})

describe("/api", () => {
  test("GET:200 sends an object with all endpoints information", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.msg).toBe('object')
        expect(response.body.msg).toEqual(endpoints);
      });
  });

})