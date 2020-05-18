
-> here redis is used for users session.
-> /qa/cron/send_pdf this url hit by every 5 min.
-> MAIL TRAP service is used for sending email to user.

STACK USED :- Node.js(express framework), MySQL, Redis (for Session).

POSTMAN COLLECTION LINK : https://www.getpostman.com/collections/1405cfb8930ba36bb3bf






######### MySQL table schema, insertions ########


CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) not NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text,
  `token` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE `user_asked_question` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `pdf_sent` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `catalog_questions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_desc` varchar(255) DEFAULT NULL,
  `question_desc_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `catalog_question_similars` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) NOT NULL,
  `similar_question_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE `catalog_question_answers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) NOT NULL,
  `answer` TEXT DEFAULT NULL,
  `answer_video_url` TEXT DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


INSERT INTO catalog_questions(question_desc, question_desc_url) VALUES
('q1', 'q1url'),
('q2', 'q2url'),
('q3', 'q3url'),
('q4', 'q4url');



INSERT INTO catalog_question_answers(question_id, answer, answer_video_url) VALUES
('1', 'q1ans1', 'q1ans1url'),
('1', 'q1ans2', 'q1ans2url'),
('1', 'q1ans3', 'q1ans3url'),
('1', 'q1ans4', 'q1ans4url'),
('1', 'q1ans5', 'q1ans5url'),
('2', 'q2ans1', 'q2ans1url'),
('2', 'q2ans2', 'q2ans2url'),
('2', 'q2ans3', 'q2ans3url'),
('2', 'q2ans4', 'q2ans4url'),
('2', 'q2ans5', 'q2ans5url'),
('3', 'q3ans1', 'q3ans1url'),
('3', 'q3ans2', 'q3ans2url'),
('3', 'q3ans3', 'q3ans3url'),
('3', 'q3ans4', 'q3ans4url'),
('3', 'q3ans5', 'q3ans5url'),
('4', 'q4ans1', 'q4ans1url'),
('4', 'q4ans2', 'q4ans2url'),
('4', 'q4ans3', 'q4ans3url'),
('4', 'q4ans4', 'q4ans4url'),
('4', 'q4ans5', 'q4ans5url');


INSERT INTO catalog_question_similars(question_id, similar_question_id) VALUES
('1', '2'),
('1', '3'),
('2', '4');