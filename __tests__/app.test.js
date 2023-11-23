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
        expect(typeof response.body).toBe('object')
        expect(response.body).toEqual(endpoints);
      });
  });
})

describe("/api/articles", () => {
  test("GET:200 sends an array of all article objects with required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("GET:200 sends an array of all article objects without property of body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        
        response.body.articles.forEach((article) => {
          expect(Object.keys(article).includes('body')).toBe(false)
        });
      });
  });

  test("GET:200 sends an array of all article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
          expect(response.body.articles).toBeSortedBy('created_at',{descending: true})
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

describe("GET /api/article/:article_id", () => {
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

describe("POST /api/articles/:article_id/comments", () => {
  test("GET:201 post a comment into the comments table for a specific article", () => {
      const newComment={author: 'lurker',
      body: 'This is an excellent article',}
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send(newComment)
      .then((response) => {
        
          expect(response.body.comment.author).toBe('lurker');
          expect(response.body.comment.body).toBe("This is an excellent article");
          expect(response.body.comment.article_id).toBe(1);
      });
  });

  test("GET:400 post a comment into the comments table with a invalid article_id", () => {
    const newComment={author: 'lurker',
    body: 'This is an excellent article',}
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
    .then((response) => {
      
      expect(response.body.msg).toBe("Bad Request");
    });
   });

   test("GET:404 post a comment into the comments table with a article_id which does not exists", () => {
    const newComment={author: 'lurker',
    body: 'This is an excellent article',}
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
    .then((response) => {
      
      expect(response.body.msg).toBe("Not Found");
    });
  })
  test("GET:400 post a comment into the comments table with an imcomplete request body", () => {
    const newComment={author: 'lurker'}
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
    .then((response) => {
      
      expect(response.body.msg).toBe("Bad Request");
    });
 }); 
 test("GET:404 post a comment into the comments table with an username which does not exist", () => {
  const newComment={author: 'xing_wei',
  body: 'This is an excellent article',}
  return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
  .then((response) => {
    
    expect(response.body.msg).toBe("Not Found");
  });
}); 
  });