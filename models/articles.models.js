const db = require("../db/connection.js");
const format = require("pg-format");

const fetchAllArticles = (topic, sortBy, sortOrder) => {
  if (
    sortBy &&
    sortBy !== "title" &&
    sortBy !== "author" &&
    sortBy !== "body" &&
    sortBy !== "created_at" &&
    sortBy !== "votes" &&
    sortBy !== "comment_count"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort by query" });
  }
  const fetchArticlesQueryString1 = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const topicQuery = format(`WHERE articles.topic=%L`, topic);
  const fetchArticleQueryString2 = ` 
  GROUP BY articles.article_id`;
  const defaultOrderByNewest = `ORDER BY created_at DESC`;
  const sortByQuery = `ORDER BY ${sortBy}`;
  const ascOrDesc = sortOrder === "desc" ? "DESC" : "";

  const sqlQuery = `${fetchArticlesQueryString1} ${
    topic ? topicQuery : ""
  } ${fetchArticleQueryString2} ${
    sortBy ? sortByQuery : defaultOrderByNewest
  } ${ascOrDesc}`;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlesById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles 
    WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
    });
};

const fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return [];
      }
    });
};

const insertCommentByArticleId = (article_id, comment, author) => {
  const insertCommentsQueryStr = format(
    `INSERT INTO comments (body, author, article_id)
    VALUES (%L) RETURNING comment_id, votes, created_at, author, body, article_id;
    `,
    [comment, author, article_id]
  );

  return db.query(insertCommentsQueryStr).then((result) => {
    return result.rows[0];
  });
};

const updateArticleById = (article_id, votes) => {
  const updateQueryStr = format(
    `UPDATE articles SET votes = votes + %L WHERE article_id = %L
    RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;
    `,
    votes,
    article_id
  );

  return db.query(updateQueryStr).then(({ rows }) => {
    if (rows.length > 0) {
      return rows[0];
    } else {
      return Promise.reject({
        status: 404,
        msg: "Article ID does not exist",
      });
    }
  });
};

const deletingCommentFromDb = (comment_id) => {
  return db
    .query(
      format(
        `DELETE FROM comments 
  WHERE comment_id = (%L)`,
        comment_id
      )
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      } else if (result.rowCount.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid input",
        });
      } else {
        return result;
      }
    });
};

module.exports = {
  fetchAllArticles,
  fetchArticlesById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
  deletingCommentFromDb,
};
