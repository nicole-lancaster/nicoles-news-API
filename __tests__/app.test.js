const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("ENDPOINT: /api/*", () => {
  test("GET 404: responds with 404 status code when user inputs a non-existent URL route", () => {
    return request(app)
      .get("/api/wrong-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
      });
  });
});

describe("ENDPOINT: /api/topics", () => {
  test("GET 200: should respond with an array of topic objects, each of which should have slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("ENDPOINT: /api/articles", () => {
  test("GET 200: response with an array of article objects, with all the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          })
        );
      });
  });
  test("GET 200: responds with an array of article objects, correctly sorted by date (descending order)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("ENDPOINT: /api/articles/:article_id", () => {
  test("GET 200: should respond with a single (article) object, with all the correct properties", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 10,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("PATCH 200: accepts a request of an object with a vote increment property and a newVote number (value), and responds with the updated article object", () => {
    const requestBody = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 5,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: -100,
          article_img_url: expect.any(String),
        });
      });
  });
  test("PATCH 200: updates a valid article with an existing vote count that isn't 0", () => {
    const requestBody = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          article_img_url: expect.any(String),
        });
      });
  });

  test("GET 400: responds with 400 status code when user inputs an invalid article_id", () => {
    return request(app)
      .get("/api/articles/pineapple")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("GET 404: responds with 404 status code when user inputs a non-existent article number", () => {
    return request(app)
      .get("/api/articles/234234234")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist");
      });
  });

  test("GET 404: responds with 404 status code when user inputs article_id of 0 (which is a num but doesn't exist)", () => {
    return request(app)
      .get("/api/articles/0")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist");
      });
  });
  test("PATCH 400: responds with a 400 status code and error message if user inputs a valid article number but missing post body properties", () => {
    const requestBody = {};
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then((articleOrError) => {
        expect(articleOrError.body.msg).toBe(
          "Malformed body/missing required fields"
        );
      });
  });
  test("PATCH 400: responds with a 400 status code and error message if user inputs a valid article number but invalid post body property data types", () => {
    const requestBody = {
      inc_votes: "pineapple",
    };
    return request(app)
      .patch("/api/articles/4")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH 400: responds with a 400 status code and error message if user inputs a valid article number but invalid url param data types", () => {
    const requestBody = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/pineapple")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("ENDPOINT: /api/articles/:article_id/comments", () => {
  test("GET 200: responds with an array of comments for the given article ID", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comments) => {
          expect(comments).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 3,
            })
          );
        });
      });
  });
  test("GET 200: responds with an array of comment objects, correctly sorted by date (descending order)", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: responds with an empty array if article exists but there are no comments associated with that article ID", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  test("GET 404: responds with 404 status code when user inputs an out of range article number", () => {
    return request(app)
      .get("/api/articles/9332879283/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Out of range for type integer - choose a smaller number"
        );
      });
  });
  test("GET 404: responds with 404 status code when user inputs a non-existent article number", () => {
    return request(app)
      .get("/api/articles/5667/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist");
      });
  });
  test("GET 400: responds with 400 status code when user inputs an invalid article_id", () => {
    return request(app)
      .get("/api/articles/pineapple/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST 201: accepts a request of an object with username and body property, and responds withthe posted comment object", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I am 100% sure that we're not completely sure.",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "I am 100% sure that we're not completely sure.",
          article_id: 5,
        });
      });
  });
  test("POST 400: responds with a 400 status code and error message if user inputs a number that is out of range of request", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I am 100% sure that we're not completely sure.",
    };
    return request(app)
      .post("/api/articles/23423421123/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Out of range for type integer - choose a smaller number"
        );
      });
  });

  test("POST 404: responds with a 404 status code and error message if user inputs an non existent article ID", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I am 100% sure that we're not completely sure.",
    };
    return request(app)
      .post("/api/articles/5432/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Key (article_id)=(5432) is not present in table "articles".'
        );
      });
  });

  test("POST 400: responds with a 400 status code and error message if user inputs an invalid article ID", () => {
    const requestBody = {
      username: "butter_bridge",
      body: "I am 100% sure that we're not completely sure.",
    };
    return request(app)
      .post("/api/articles/apples/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST 404: responds with a 400 status code and error message if user inputs a valid article number but missing post body properties", () => {
    const requestBody = {};
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Malformed body/missing required fields");
      });
  });

  test("POST 400: responds with a 400 status code and error message if user inputs a valid article number but missing post body.body property", () => {
    const requestBody = {
      username: "hi",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Malformed body/missing required fields");
      });
  });

  test("POST 404 - Username not found", () => {
    const requestBody = {
      username: 5,
      body: 5,
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Key (author)=(5) is not present in table "users".'
        );
      });
  });

  test("POST 404: responds with a 400 status code and error message if user inputs a valid article number but missing post body.username property", () => {
    const requestBody = {
      body: "hi",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Malformed body/missing required fields");
      });
  });

  test("POST 404: responds with a 400 status code and error message if user inputs a valid article number but undefined post body", () => {
    const requestBody = undefined;
    return request(app)
      .post("/api/articles/5/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Malformed body/missing required fields");
      });
  });
});
