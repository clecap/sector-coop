CREATE SCHEMA identities
   AUTHORIZATION postgres;

CREATE TABLE identities.users
(
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    hashed_password character(60) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (username)
)

TABLESPACE pg_default;

ALTER TABLE identities.users
    OWNER to postgres;



CREATE TABLE identities.datablobs
(
    username character varying(64) COLLATE pg_catalog."default" NOT NULL,
    datablob text NOT NULL,
    CONSTRAINT datablobs_pkey PRIMARY KEY (username),
    CONSTRAINT "username-key" FOREIGN KEY (username)
        REFERENCES identities.users (username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE identities.datablobs
    OWNER to postgres;