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
              article_id: expect.any(Number),
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
});
