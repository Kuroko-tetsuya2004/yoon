--
-- PostgreSQL database dump
--

\restrict isi0JMNU1WNhOkdm22cKPV95bjyTPHnDiDTcvwTSwbUwDuFGMqfiQ44qfkyWaTM

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache OWNER TO sail;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO sail;

--
-- Name: commande_evenementielles; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.commande_evenementielles (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    titre character varying(255) NOT NULL,
    type_evenement character varying(255) NOT NULL,
    date_evenement timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.commande_evenementielles OWNER TO sail;

--
-- Name: commande_evenementielles_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.commande_evenementielles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_evenementielles_id_seq OWNER TO sail;

--
-- Name: commande_evenementielles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.commande_evenementielles_id_seq OWNED BY public.commande_evenementielles.id;


--
-- Name: commande_gazs; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.commande_gazs (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    partenaire_id bigint,
    type_bonbonne character varying(255) NOT NULL,
    quantite integer NOT NULL,
    contenant_vide boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    contenant_recupere boolean DEFAULT false NOT NULL
);


ALTER TABLE public.commande_gazs OWNER TO sail;

--
-- Name: commande_gazs_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.commande_gazs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_gazs_id_seq OWNER TO sail;

--
-- Name: commande_gazs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.commande_gazs_id_seq OWNED BY public.commande_gazs.id;


--
-- Name: commande_materiels; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.commande_materiels (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    partenaire_id bigint,
    type_materiel character varying(255) NOT NULL,
    quantite integer NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.commande_materiels OWNER TO sail;

--
-- Name: commande_materiels_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.commande_materiels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_materiels_id_seq OWNER TO sail;

--
-- Name: commande_materiels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.commande_materiels_id_seq OWNED BY public.commande_materiels.id;


--
-- Name: commande_pondereuxes; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.commande_pondereuxes (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    partenaire_id bigint,
    type_produit character varying(255) NOT NULL,
    poids_estime numeric(8,2) NOT NULL,
    quantite integer NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.commande_pondereuxes OWNER TO sail;

--
-- Name: commande_pondereuxes_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.commande_pondereuxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commande_pondereuxes_id_seq OWNER TO sail;

--
-- Name: commande_pondereuxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.commande_pondereuxes_id_seq OWNED BY public.commande_pondereuxes.id;


--
-- Name: commandes; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.commandes (
    id bigint NOT NULL,
    client_id bigint NOT NULL,
    repere_id bigint NOT NULL,
    statut character varying(255) DEFAULT 'en_attente'::character varying NOT NULL,
    montant_total numeric(10,2) NOT NULL,
    creneau character varying(255) NOT NULL,
    mode_paiement character varying(255) NOT NULL,
    statut_paiement character varying(255) DEFAULT 'en_attente'::character varying NOT NULL,
    type_commande character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    motif_refus text,
    commandeable_type character varying(255),
    commandeable_id bigint,
    frais_livraison numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.commandes OWNER TO sail;

--
-- Name: commandes_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.commandes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commandes_id_seq OWNER TO sail;

--
-- Name: commandes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.commandes_id_seq OWNED BY public.commandes.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO sail;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO sail;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO sail;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO sail;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO sail;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: litiges; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.litiges (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    user_id bigint NOT NULL,
    description text NOT NULL,
    statut character varying(255) DEFAULT 'ouvert'::character varying NOT NULL,
    resolution text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.litiges OWNER TO sail;

--
-- Name: litiges_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.litiges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.litiges_id_seq OWNER TO sail;

--
-- Name: litiges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.litiges_id_seq OWNED BY public.litiges.id;


--
-- Name: livraisons; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.livraisons (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    livreur_id bigint NOT NULL,
    heure_depart timestamp(0) without time zone,
    heure_arrivee timestamp(0) without time zone,
    statut_livraison character varying(50) DEFAULT 'en_attente'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.livraisons OWNER TO sail;

--
-- Name: livraisons_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.livraisons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livraisons_id_seq OWNER TO sail;

--
-- Name: livraisons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.livraisons_id_seq OWNED BY public.livraisons.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO sail;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO sail;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    notifiable_type character varying(255) NOT NULL,
    notifiable_id bigint NOT NULL,
    data text NOT NULL,
    read_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notifications OWNER TO sail;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO sail;

--
-- Name: prestations; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.prestations (
    id bigint NOT NULL,
    commande_evenementielle_id bigint NOT NULL,
    produit_id bigint NOT NULL,
    partenaire_id bigint NOT NULL,
    quantite integer NOT NULL,
    prix_unitaire numeric(10,2) NOT NULL,
    caution numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    statut character varying(255) DEFAULT 'en_attente'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.prestations OWNER TO sail;

--
-- Name: prestations_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.prestations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestations_id_seq OWNER TO sail;

--
-- Name: prestations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.prestations_id_seq OWNED BY public.prestations.id;


--
-- Name: produits; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.produits (
    id bigint NOT NULL,
    partenaire_id bigint NOT NULL,
    categorie character varying(255) NOT NULL,
    marque character varying(255) NOT NULL,
    modele character varying(255) NOT NULL,
    nom_produit character varying(255) NOT NULL,
    description text,
    prix numeric(10,2) NOT NULL,
    photo character varying(255),
    est_disponible boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    quantite_stock integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.produits OWNER TO sail;

--
-- Name: produits_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.produits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produits_id_seq OWNER TO sail;

--
-- Name: produits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.produits_id_seq OWNED BY public.produits.id;


--
-- Name: proposition_livraisons; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.proposition_livraisons (
    id bigint NOT NULL,
    commande_id bigint NOT NULL,
    livreur_id bigint NOT NULL,
    statut character varying(255) DEFAULT 'en_attente'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.proposition_livraisons OWNER TO sail;

--
-- Name: proposition_livraisons_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.proposition_livraisons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proposition_livraisons_id_seq OWNER TO sail;

--
-- Name: proposition_livraisons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.proposition_livraisons_id_seq OWNED BY public.proposition_livraisons.id;


--
-- Name: reperes; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.reperes (
    id bigint NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    description text NOT NULL,
    photo character varying(255),
    nom character varying(255) NOT NULL,
    client_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    adresse character varying(500),
    is_default boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reperes OWNER TO sail;

--
-- Name: reperes_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.reperes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reperes_id_seq OWNER TO sail;

--
-- Name: reperes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.reperes_id_seq OWNED BY public.reperes.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO sail;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sail
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    email character varying(255),
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'client'::character varying NOT NULL,
    disponibilite boolean DEFAULT true,
    type_service character varying(100),
    statut_validation character varying(255),
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    rappel_actif boolean DEFAULT false NOT NULL,
    frequence_rappel_jours integer,
    prochain_rappel_date date,
    description_boutique text,
    photo_devanture character varying(255),
    moyen_transport character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    photo_moyen_transport character varying(255),
    adresse character varying(255),
    propre_service_livraison boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO sail;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sail
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO sail;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sail
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: commande_evenementielles id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_evenementielles ALTER COLUMN id SET DEFAULT nextval('public.commande_evenementielles_id_seq'::regclass);


--
-- Name: commande_gazs id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_gazs ALTER COLUMN id SET DEFAULT nextval('public.commande_gazs_id_seq'::regclass);


--
-- Name: commande_materiels id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_materiels ALTER COLUMN id SET DEFAULT nextval('public.commande_materiels_id_seq'::regclass);


--
-- Name: commande_pondereuxes id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_pondereuxes ALTER COLUMN id SET DEFAULT nextval('public.commande_pondereuxes_id_seq'::regclass);


--
-- Name: commandes id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commandes ALTER COLUMN id SET DEFAULT nextval('public.commandes_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: litiges id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.litiges ALTER COLUMN id SET DEFAULT nextval('public.litiges_id_seq'::regclass);


--
-- Name: livraisons id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.livraisons ALTER COLUMN id SET DEFAULT nextval('public.livraisons_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: prestations id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.prestations ALTER COLUMN id SET DEFAULT nextval('public.prestations_id_seq'::regclass);


--
-- Name: produits id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.produits ALTER COLUMN id SET DEFAULT nextval('public.produits_id_seq'::regclass);


--
-- Name: proposition_livraisons id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.proposition_livraisons ALTER COLUMN id SET DEFAULT nextval('public.proposition_livraisons_id_seq'::regclass);


--
-- Name: reperes id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.reperes ALTER COLUMN id SET DEFAULT nextval('public.reperes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: commande_evenementielles; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.commande_evenementielles (id, commande_id, titre, type_evenement, date_evenement, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: commande_gazs; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.commande_gazs (id, commande_id, partenaire_id, type_bonbonne, quantite, contenant_vide, created_at, updated_at, contenant_recupere) FROM stdin;
1	1	3	6kg	1	t	2026-07-09 19:38:27	2026-07-09 19:38:27	f
2	2	3	6kg	3	t	2026-07-09 21:08:19	2026-07-09 21:08:19	f
\.


--
-- Data for Name: commande_materiels; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.commande_materiels (id, commande_id, partenaire_id, type_materiel, quantite, date_debut, date_fin, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: commande_pondereuxes; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.commande_pondereuxes (id, commande_id, partenaire_id, type_produit, poids_estime, quantite, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: commandes; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.commandes (id, client_id, repere_id, statut, montant_total, creneau, mode_paiement, statut_paiement, type_commande, created_at, updated_at, motif_refus, commandeable_type, commandeable_id, frais_livraison) FROM stdin;
1	4	1	acceptee	3000.00	Dès que possible	especes	en_attente	gaz	2026-07-09 19:38:27	2026-07-09 19:38:27	\N	\N	\N	0.00
2	4	1	acceptee	9000.00	Dès que possible	wave	en_attente	gaz	2026-07-09 21:08:19	2026-07-09 21:08:19	\N	\N	\N	0.00
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: litiges; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.litiges (id, commande_id, user_id, description, statut, resolution, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: livraisons; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.livraisons (id, commande_id, livreur_id, heure_depart, heure_arrivee, statut_livraison, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_07_05_135852_create_reperes_table	1
5	2026_07_05_142238_add_adresse_to_reperes_table	1
6	2026_07_05_151216_add_is_default_to_reperes_table	1
7	2026_07_05_151924_create_commandes_table	1
8	2026_07_05_151928_create_commande_gazs_table	1
9	2026_07_05_151934_create_commande_pondereuxes_table	1
10	2026_07_05_153300_create_produits_table	1
11	2026_07_06_012020_create_livraisons_table	1
12	2026_07_06_012023_add_rappel_fields_to_users_table	1
13	2026_07_06_012029_add_contenant_recupere_to_commande_gazs_table	1
14	2026_07_06_021900_create_commande_materiels_table	1
15	2026_07_08_203600_add_quantite_stock_to_produits_table	1
16	2026_07_08_203610_add_motif_refus_to_commandes_table	1
17	2026_07_08_203700_create_notifications_table	1
18	2026_07_08_212054_add_geolocation_and_details_to_users_table	1
19	2026_07_08_212100_create_proposition_livraisons_table	1
20	2026_07_08_220200_create_commande_evenementielles_table	1
21	2026_07_08_220202_create_prestations_table	1
22	2026_07_08_220822_create_litiges_table	1
23	2026_07_09_183043_add_ecommerce_fields_to_users_table	2
24	2026_07_09_220000_refactor_commandes_polymorphism	2
25	2026_07_09_183616_normalize_user_roles	3
26	2026_07_09_230000_add_frais_livraison_to_commandes_table	4
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.notifications (id, type, notifiable_type, notifiable_id, data, read_at, created_at, updated_at) FROM stdin;
4c303868-1414-4a20-a29a-84898c9e94eb	App\\Notifications\\NouvelleCommandeNotification	App\\Models\\User	3	{"commande_id":1,"message":"Nouvelle commande re\\u00e7ue (gaz)."}	\N	2026-07-09 19:38:28	2026-07-09 19:38:28
3a20ffb3-420f-46eb-a04e-ce81026571eb	App\\Notifications\\CommandeStatusNotification	App\\Models\\User	4	{"commande_id":1,"message":"Votre commande a \\u00e9t\\u00e9 automatiquement accept\\u00e9e."}	\N	2026-07-09 19:38:28	2026-07-09 19:38:28
2b3ab964-0da3-4a86-b3a0-d7f0c7485dbe	App\\Notifications\\NouvelleCommandeNotification	App\\Models\\User	3	{"commande_id":2,"message":"Nouvelle commande re\\u00e7ue (gaz)."}	\N	2026-07-09 21:08:20	2026-07-09 21:08:20
a4b94a12-b519-4746-8d7d-f2e9bc60944c	App\\Notifications\\CommandeStatusNotification	App\\Models\\User	4	{"commande_id":2,"message":"Votre commande a \\u00e9t\\u00e9 automatiquement accept\\u00e9e."}	\N	2026-07-09 21:08:20	2026-07-09 21:08:20
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: prestations; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.prestations (id, commande_evenementielle_id, produit_id, partenaire_id, quantite, prix_unitaire, caution, statut, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: produits; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.produits (id, partenaire_id, categorie, marque, modele, nom_produit, description, prix, photo, est_disponible, created_at, updated_at, quantite_stock) FROM stdin;
2	3	materiel	Baache	une bache de 15m de long et 10m de large	Tente de reception VIP	\N	15000.00	produits/I2PKbICj4UuoUXfchQiSshZ9OuobaVJWxOoid1uF.jpg	t	2026-07-09 19:36:12	2026-07-09 19:36:12	0
1	3	gaz	Gaz Mame Diarra	6kg	gaz mame diarra 6kg	\N	3000.00	produits/bdIOhamUPWCdkA4CKEJsARCTToPDFUW7owolnc7C.jpg	t	2026-07-09 19:32:02	2026-07-09 21:08:19	15
\.


--
-- Data for Name: proposition_livraisons; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.proposition_livraisons (id, commande_id, livreur_id, statut, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reperes; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.reperes (id, latitude, longitude, description, photo, nom, client_id, created_at, updated_at, adresse, is_default) FROM stdin;
1	14.76947800	-17.42103100	DEUXIMEGHJKLM	http://localhost:9011/yoon/reperes/DhZPyaqpLldiUEoenjcDLQVO72dsWs4aWJmgsqfQ.jpg	Domicile	4	2026-07-09 19:23:41	2026-07-09 19:23:41	Commune de Cambérène, commune d'arrondissement des Parcelles Assainies, Dakar, Région de Dakar, 14000, Sénégal	t
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sail
--

COPY public.users (id, name, telephone, email, email_verified_at, password, role, disponibilite, type_service, statut_validation, remember_token, created_at, updated_at, rappel_actif, frequence_rappel_jours, prochain_rappel_date, description_boutique, photo_devanture, moyen_transport, latitude, longitude, photo_moyen_transport, adresse, propre_service_livraison) FROM stdin;
1	Super Admin	770000000	admin@yoon.sn	\N	$2y$12$RvhISl0Frc5FG425Z7PSu.OBWS.DTMHJJ1ES4.mq4REuL5WapK91O	administrateur	t	\N	\N	\N	2026-07-09 02:24:00	2026-07-09 02:24:00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
3	Touba Gaz	770314488	\N	\N	$2y$12$h35er.sot/WA.p8AlClI8eIVFwxqOXdKxmbVfHIfXN..LaDLjqKW6	partenaire	t	\N	valide	\N	2026-07-09 18:59:17	2026-07-09 19:03:22	f	\N	\N	Boehsgdchjxwk<	boutiques/X99fOlBEYgP1YjboDqUhEidWbqauTS90gxI8gkQR.jpg	\N	\N	\N	\N	dgfhgjhjklùm	f
4	Malick Wade	771111111	\N	\N	$2y$12$P3jjX/Xz2ht.8//ALVO.eO80leTdezWs5uLlM7szIqOARFiXodfqy	client	t	\N	valide	\N	2026-07-09 19:21:22	2026-07-09 19:21:22	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
2	papa wade	765226478	\N	\N	$2y$12$EoL8m3BZZ1383HsePtzIBuj5Usap.HEubu6sXdKeum9oA5VrAw62C	livreur	t	\N	valide	\N	2026-07-09 18:06:04	2026-07-10 21:52:51	f	\N	\N	\N	\N	Camionnette	14.76947800	-17.42103100	\N	\N	f
\.


--
-- Name: commande_evenementielles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.commande_evenementielles_id_seq', 1, false);


--
-- Name: commande_gazs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.commande_gazs_id_seq', 2, true);


--
-- Name: commande_materiels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.commande_materiels_id_seq', 1, false);


--
-- Name: commande_pondereuxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.commande_pondereuxes_id_seq', 1, false);


--
-- Name: commandes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.commandes_id_seq', 2, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: litiges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.litiges_id_seq', 1, false);


--
-- Name: livraisons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.livraisons_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.migrations_id_seq', 26, true);


--
-- Name: prestations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.prestations_id_seq', 1, false);


--
-- Name: produits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.produits_id_seq', 2, true);


--
-- Name: proposition_livraisons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.proposition_livraisons_id_seq', 1, false);


--
-- Name: reperes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.reperes_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sail
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: commande_evenementielles commande_evenementielles_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_evenementielles
    ADD CONSTRAINT commande_evenementielles_pkey PRIMARY KEY (id);


--
-- Name: commande_gazs commande_gazs_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_gazs
    ADD CONSTRAINT commande_gazs_pkey PRIMARY KEY (id);


--
-- Name: commande_materiels commande_materiels_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_materiels
    ADD CONSTRAINT commande_materiels_pkey PRIMARY KEY (id);


--
-- Name: commande_pondereuxes commande_pondereuxes_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_pondereuxes
    ADD CONSTRAINT commande_pondereuxes_pkey PRIMARY KEY (id);


--
-- Name: commandes commandes_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: litiges litiges_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.litiges
    ADD CONSTRAINT litiges_pkey PRIMARY KEY (id);


--
-- Name: livraisons livraisons_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.livraisons
    ADD CONSTRAINT livraisons_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: prestations prestations_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.prestations
    ADD CONSTRAINT prestations_pkey PRIMARY KEY (id);


--
-- Name: produits produits_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_pkey PRIMARY KEY (id);


--
-- Name: proposition_livraisons proposition_livraisons_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.proposition_livraisons
    ADD CONSTRAINT proposition_livraisons_pkey PRIMARY KEY (id);


--
-- Name: reperes reperes_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.reperes
    ADD CONSTRAINT reperes_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_telephone_unique; Type: CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_telephone_unique UNIQUE (telephone);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: commandes_commandeable_type_commandeable_id_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX commandes_commandeable_type_commandeable_id_index ON public.commandes USING btree (commandeable_type, commandeable_id);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: notifications_notifiable_type_notifiable_id_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX notifications_notifiable_type_notifiable_id_index ON public.notifications USING btree (notifiable_type, notifiable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: sail
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: commande_evenementielles commande_evenementielles_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_evenementielles
    ADD CONSTRAINT commande_evenementielles_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: commande_gazs commande_gazs_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_gazs
    ADD CONSTRAINT commande_gazs_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: commande_gazs commande_gazs_partenaire_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_gazs
    ADD CONSTRAINT commande_gazs_partenaire_id_foreign FOREIGN KEY (partenaire_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: commande_materiels commande_materiels_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_materiels
    ADD CONSTRAINT commande_materiels_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: commande_materiels commande_materiels_partenaire_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_materiels
    ADD CONSTRAINT commande_materiels_partenaire_id_foreign FOREIGN KEY (partenaire_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: commande_pondereuxes commande_pondereuxes_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_pondereuxes
    ADD CONSTRAINT commande_pondereuxes_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: commande_pondereuxes commande_pondereuxes_partenaire_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commande_pondereuxes
    ADD CONSTRAINT commande_pondereuxes_partenaire_id_foreign FOREIGN KEY (partenaire_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: commandes commandes_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: commandes commandes_repere_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_repere_id_foreign FOREIGN KEY (repere_id) REFERENCES public.reperes(id) ON DELETE CASCADE;


--
-- Name: litiges litiges_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.litiges
    ADD CONSTRAINT litiges_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: litiges litiges_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.litiges
    ADD CONSTRAINT litiges_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: livraisons livraisons_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.livraisons
    ADD CONSTRAINT livraisons_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: livraisons livraisons_livreur_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.livraisons
    ADD CONSTRAINT livraisons_livreur_id_foreign FOREIGN KEY (livreur_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: prestations prestations_commande_evenementielle_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.prestations
    ADD CONSTRAINT prestations_commande_evenementielle_id_foreign FOREIGN KEY (commande_evenementielle_id) REFERENCES public.commande_evenementielles(id) ON DELETE CASCADE;


--
-- Name: prestations prestations_partenaire_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.prestations
    ADD CONSTRAINT prestations_partenaire_id_foreign FOREIGN KEY (partenaire_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: prestations prestations_produit_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.prestations
    ADD CONSTRAINT prestations_produit_id_foreign FOREIGN KEY (produit_id) REFERENCES public.produits(id) ON DELETE CASCADE;


--
-- Name: produits produits_partenaire_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_partenaire_id_foreign FOREIGN KEY (partenaire_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: proposition_livraisons proposition_livraisons_commande_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.proposition_livraisons
    ADD CONSTRAINT proposition_livraisons_commande_id_foreign FOREIGN KEY (commande_id) REFERENCES public.commandes(id) ON DELETE CASCADE;


--
-- Name: proposition_livraisons proposition_livraisons_livreur_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.proposition_livraisons
    ADD CONSTRAINT proposition_livraisons_livreur_id_foreign FOREIGN KEY (livreur_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reperes reperes_client_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: sail
--

ALTER TABLE ONLY public.reperes
    ADD CONSTRAINT reperes_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict isi0JMNU1WNhOkdm22cKPV95bjyTPHnDiDTcvwTSwbUwDuFGMqfiQ44qfkyWaTM

