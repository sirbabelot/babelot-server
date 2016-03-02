CREATE TABLE users (
  id SERIAL,
  email text,
  PRIMARY KEY (id)
);

CREATE TABLE connections (
  user_a_id INTEGER REFERENCES users,
  user_b_id INTEGER REFERENCES users,
  PRIMARY KEY (user_a_id, user_b_id)
);

INSERT INTO "users" (email) VALUES ('jzapata@uwo.ca');
