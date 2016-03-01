CREATE TABLE users (
  id SERIAL,
  connections integer[],
  email text,
  PRIMARY KEY (id)
);

CREATE TABLE connections (
  id SERIAL,
  userA_id INTEGER REFERENCES users,
  userB_id INTEGER REFERENCES users,
  PRIMARY KEY (id)
);

INSERT INTO "users" (email) VALUES ('jzapata@uwo.ca');
