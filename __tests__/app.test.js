const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints= require("../endpoints.json");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const { expect } = require("@jest/globals");
const { TextDecoderStream } = require("node:stream/web");



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

  describe("/api/articles/:article_id", () => {
    test("PATCH:200 update an specific article's vote property", () => {
      const newVote={inc_votes:20}
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send(newVote)
        .then((response) => {       
            expect(typeof response.body.article.topic).toBe("string");
            expect(typeof response.body.article.title).toBe("string");
            expect(typeof response.body.article.article_img_url).toBe("string");
            expect(response.body.article.votes).toBe(20);
            expect(typeof response.body.article.created_at).toBe("string");
            expect(typeof response.body.article.author).toBe("string");
            expect(typeof response.body.article.body).toBe("string");
            expect(response.body.article.article_id).toBe(1);
        });
    });

    test("GET:400 sends an Bad Request error if there is not a valid article_id", () => {
      return request(app)
        .patch("/api/articles/banana")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
     });

     test("GET:404 sends an Not Found error if the article_id does not exists", () => {
      return request(app)
        .patch("/api/articles/99")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
     });

     test("GET:400 sends an Bad Request error if the request body is not complete", () => {
      const newVote={inc_votes:'string'}
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .send(newVote)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
     });
  })  

  describe("/api/comments/:comment_id", () => {
    test('DELETE:204 deletes the specified comment and sends no body back', () => {
      return request(app).delete('/api/comments/3')
      .expect(204);
      // No "then" because a 204 status responds with no body no matter what
    });
  test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('comment does not exist');
      });
  });
  test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-team')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of all user objects with required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
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