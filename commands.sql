CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text not null,
  title text not null,
  likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES 
('John Doe', 'www.john.com', 'Book of John'),
('Jane Doe', 'www.jane.fi', 'Diary of Jane');