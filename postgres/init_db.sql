CREATE TABLE users (
  id TEXT,
  email TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE connections (
  user_a_id TEXT REFERENCES users,
  user_b_id TEXT REFERENCES users,
  PRIMARY KEY (user_a_id, user_b_id)
);

INSERT INTO "users" (id) VALUES ('jzapata');
