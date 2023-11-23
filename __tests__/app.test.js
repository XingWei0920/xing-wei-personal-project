const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints= require("../endpoints.json")
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

describe("/api", () => {
  test("GET:200 sends an object with all endpoints information", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe('object')
        expect(response.body).toEqual(endpoints);
      });
  });

})

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of all comment objects for a specific article_id with required properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });


  test("GET:200 sends an array of all article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
          expect(response.body.comments).toBeSortedBy('created_at',{descending: true})
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

  test("GET:400 sends an Bad Request error if there is not a valid article_id", () => {
     return request(app)
       .get("/api/articles/banana/comments")
       .expect(400)
       .then((response) => {
         expect(response.body.msg).toBe("Bad Request");
       });
    });

    test("GET:404 sends an not found error if the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
   });

   test("GET:200 sends an empty array if the article_id exists but there is no comments releated", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
   });
    

     
  });