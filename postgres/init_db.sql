CREATE TABLE users (
  id TEXT,
  email TEXT,
  nickname TEXT,
  img_url TEXT,
  connection_requests TEXT[],
  PRIMARY KEY (id)
);

CREATE TABLE Messages (
  id SERIAL,
  to_id TEXT REFERENCES users,
  from_id TEXT REFERENCES users,
  dateCreated TEXT,
  body TEXT,
  read BOOLEAN,
  recieved BOOLEAN,
  PRIMARY KEY (id)
);

CREATE TABLE connections (
  user_a_id TEXT REFERENCES users,
  user_b_id TEXT REFERENCES users,
  PRIMARY KEY (user_a_id, user_b_id)
);
