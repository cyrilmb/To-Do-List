CREATE TABLE list (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (250) NOT NULL,
	"deadline" DATE,
	"complete" BOOLEAN DEFAULT FALSE,
	"comptime" DATE
)