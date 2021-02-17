CREATE TABLE identity.users(
	id 					BIGSERIAL,
	username 			CHARACTER VARYING(64) NOT NULL,
	hashed_password 	BYTEA NOT NULL,
	aes256_key 			BYTEA,
	datablob 			BYTEA,				
	created 			time with time zone,
	PRIMARY KEY(id)
);

CREATE TABLE identity.usermetadata(
	id						BIGSERIAL,
	uuid					UUID,
	
);

CREATE TABLE identity.keys(
	id						BIGINT,
	aes256_key			VARCHAR(256),
	datablob				VARCHAR(1000),
	created				TIMESTAMP with time zone,
	FOREIGN KEY (id) REFERENCES identity.users(id)
);

CREATE TABLE identity.pseudonyms(
	id					BIGINT,
	pseudonym			VARCHAR(64) NOT NULL,
	associated_user		BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (associated_user) REFERENCES identity.users(id)
);


CREATE TABLE documents.documents(
	hash				VARCHAR(128),
	binfile				BYTEA NOT NULL,
	PRIMARY KEY(hash)
);

CREATE TABLE documents.meta(
	hash						VARCHAR(128),
	created 				TIMESTAMP with time zone,
	accepted 			TIMESTAMP with time zone,
	-- other metadata can be added...
	FOREIGN KEY (hash) REFERENCES documents.documents(hash)
);

CREATE TABLE documents.publicData(
	-- if an author wishes to provide these...
	hash						VARCHAR(128),
	authors					VARCHAR(128),
	dateOfPublication		DATE,
	affiliations			VARCHAR(128),
	keywords					VARCHAR(128),
	-- and so on...
	FOREIGN KEY (hash) REFERENCES documents.documents(hash)
);
