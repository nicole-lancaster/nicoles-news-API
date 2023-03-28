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
});

// /api/article/10923470 --> article does not exist - 404 not found
// /api/article/pineapple --> invalid ID - 400 bad request
