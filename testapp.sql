--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 12.2

-- Started on 2020-09-09 03:01:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- TOC entry 199 (class 1259 OID 22678)
-- Name: operators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operators (
    id bigint NOT NULL,
    name character varying,
    code integer
);


ALTER TABLE public.operators OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 22676)
-- Name: operators_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.operators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operators_id_seq OWNER TO postgres;

--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 198
-- Name: operators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.operators_id_seq OWNED BY public.operators.id;


--
-- TOC entry 197 (class 1259 OID 22666)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying,
    phone character varying,
    operator_id bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 22664)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2902 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2770 (class 2604 OID 22681)
-- Name: operators id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operators ALTER COLUMN id SET DEFAULT nextval('public.operators_id_seq'::regclass);


--
-- TOC entry 2768 (class 2604 OID 22669)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2774 (class 2606 OID 22686)
-- Name: operators operators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_pkey PRIMARY KEY (id);


--
-- TOC entry 2772 (class 2606 OID 22675)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2020-09-09 03:01:33

--
-- PostgreSQL database dump complete
--

