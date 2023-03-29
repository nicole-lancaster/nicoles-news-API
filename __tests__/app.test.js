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
  test("GET 404: responds with 404 status code when user inputs a non-existent URl route", () => {
    return request(app)
      .get("/api/wrong-topics-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
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
  test("GET 404: responds with 404 status code when user inputs a non-existent article number", () => {
    return request(app)
      .get("/api/articles/234234234")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist");
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
        expect(articles).toBeInstanceOf(Array);
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
              comment_count: expect.any(String)
            });
          })
        );
      });
  });
});