CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create database prac1
    with owner prac1;

create table public.film
(
    id          uuid default uuid_generate_v4() not null
        constraint "PK_697487ada088902377482c970d1"
            primary key,
    rating      double precision                not null,
    director    varchar                         not null,
    tags        text                            not null,
    image       varchar                         not null,
    cover       varchar                         not null,
    title       varchar                         not null,
    about       varchar                         not null,
    description varchar                         not null
);

alter table public.film
    owner to prac1;

create table public.schedule
(
    id       uuid default uuid_generate_v4() not null
        constraint "PK_7e33fc2ea755a5765e3564e66dd"
            primary key,
    daytime  varchar                         not null,
    hall     integer                         not null,
    rows     integer                         not null,
    seats    integer                         not null,
    price    double precision                not null,
    taken    text                            not null,
    "filmId" uuid
        constraint "FK_1c2f5e637713a429f4854024a76"
            references public.film
);

alter table public.schedule
    owner to prac1;

     CREATE TABLE public.order (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

alter table public.order
    owner to prac1;
  
CREATE TABLE public.ticket (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    film_id uuid NOT NULL REFERENCES public.film(id),
    session_id uuid NOT NULL REFERENCES public.schedule(id),
    "row" INT NOT NULL,
    seat INT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    session_time TIMESTAMP NOT NULL,
    "orderId" uuid NOT NULL REFERENCES public.order(id)
);

alter table public.ticket
    owner to prac1;



