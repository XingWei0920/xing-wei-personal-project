const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");


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

describe("/api/article/:article_id", () => {
  test("GET:200 sends an the article object with articel_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
      const date = new Date('2020-07-09 21:11:00') 
        expect(response.body.article.length).toBe(1);
        expect(response.body.article[0]).toEqual(expect.objectContaining({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: date.toISOString(),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }));          
        });
      });

  test("GET:404 sends an NOT FOUND error if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });

  test("GET:404 sends an Bad Request error if the article_id is not a number", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

})