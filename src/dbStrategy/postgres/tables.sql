CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "posts" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "postText" TEXT,
    "metaTitle" TEXT,
    "metaText" TEXT,
    "metaUrl" TEXT NOT NULL,
    "metaImage" TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "likes" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    "postId" INTEGER NOT NULL REFERENCES posts(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "hashtags" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "hashtag" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "postsHashtags" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "postId" INTEGER NOT NULL REFERENCES posts(id),
    "hashtagId" INTEGER NOT NULL REFERENCES hashtags(id),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);