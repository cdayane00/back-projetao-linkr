CREATE TABLE "images"(
    "id" SERIAL PRIMARY KEY,
    "url" TEXT NOT NULL
);

CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "profile_pic_id" INTEGER NOT NULL UNIQUE REFERENCES "images"(id)
);