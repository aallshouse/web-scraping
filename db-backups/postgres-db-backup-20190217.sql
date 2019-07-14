--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1 (Debian 11.1-1.pgdg90+1)
-- Dumped by pg_dump version 11.1 (Debian 11.1-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY staging.transactions DROP CONSTRAINT transactions_pkey;
ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
ALTER TABLE ONLY public.miniregister DROP CONSTRAINT miniregister_pkey;
ALTER TABLE ONLY public.creditcards DROP CONSTRAINT creditcards_pkey;
ALTER TABLE public.miniregister ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.creditcards ALTER COLUMN id DROP DEFAULT;
DROP TABLE staging.transactions;
DROP TABLE public.transactions;
DROP SEQUENCE public.miniregister_id_seq;
DROP TABLE public.miniregister;
DROP SEQUENCE public.creditcards_id_seq;
DROP TABLE public.creditcards;
DROP SCHEMA staging;
--
-- Name: staging; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA staging;


ALTER SCHEMA staging OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: creditcards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcards (
    id integer NOT NULL,
    companyname character varying(255),
    availablecredit numeric(9,2),
    balance numeric(9,2),
    dateentered date,
    nextduedate date
);


ALTER TABLE public.creditcards OWNER TO postgres;

--
-- Name: creditcards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.creditcards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.creditcards_id_seq OWNER TO postgres;

--
-- Name: creditcards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.creditcards_id_seq OWNED BY public.creditcards.id;


--
-- Name: miniregister; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.miniregister (
    id integer NOT NULL,
    description character varying(255),
    amount numeric(9,2),
    dateentered date DEFAULT ('now'::text)::date,
    groupid integer,
    "order" integer
);


ALTER TABLE public.miniregister OWNER TO postgres;

--
-- Name: miniregister_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.miniregister_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.miniregister_id_seq OWNER TO postgres;

--
-- Name: miniregister_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.miniregister_id_seq OWNED BY public.miniregister.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    description character varying(255),
    amount character varying(255),
    transactiondate date,
    notprocessed boolean,
    category character varying(255),
    isbill boolean
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: transactions; Type: TABLE; Schema: staging; Owner: postgres
--

CREATE TABLE staging.transactions (
    id integer NOT NULL,
    description character varying(255),
    amount character varying(255),
    transactiondate date,
    notprocessed boolean,
    category character varying(255),
    isbill boolean,
    duplicate boolean
);


ALTER TABLE staging.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: staging; Owner: postgres
--

ALTER TABLE staging.transactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME staging.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: creditcards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcards ALTER COLUMN id SET DEFAULT nextval('public.creditcards_id_seq'::regclass);


--
-- Name: miniregister id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miniregister ALTER COLUMN id SET DEFAULT nextval('public.miniregister_id_seq'::regclass);


--
-- Data for Name: creditcards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcards (id, companyname, availablecredit, balance, dateentered, nextduedate) FROM stdin;
1	Amazon credit	22.00	1977.97	2019-02-10	\N
2	Barclays	0.00	2042.31	2019-02-10	\N
3	Capital One Platinum	\N	2236.65	2019-02-10	\N
4	Capital One QuickSilver	0.00	2564.48	2019-02-10	\N
5	Citi	8.37	670.44	2019-02-10	\N
6	Credit One (MC)	54.00	945.63	2019-02-10	\N
7	Credit One (V)	63.00	986.92	2019-02-10	\N
8	Discover	55.00	1244.97	2019-02-10	\N
9	GameStop	78.84	504.00	2019-02-10	\N
10	Giant Eagle credit	0.00	207.26	2019-02-10	\N
11	NTB	158.57	1041.00	2019-02-10	\N
12	Old Navy	0.00	300.00	2019-02-10	\N
13	PayPal credit	0.29	2753.71	2019-02-10	\N
14	PayPal (MC)	6.00	293.97	2019-02-10	\N
15	Target credit	45.24	754.76	2019-02-10	\N
16	Walmart credit	275.00	1524.33	2019-02-10	\N
\.


--
-- Data for Name: miniregister; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.miniregister (id, description, amount, dateentered, groupid, "order") FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, description, amount, transactiondate, notprocessed, category, isbill) FROM stdin;
2	Moes	-10.00	2018-12-17	f	eating-out:lunch	f
7	Credit One	-48.00	2018-12-17	f	credit-cards:X	t
3	Citi	-25.00	2018-12-17	f	credit-cards:X	t
4	LA Fitness	-29.95	2018-12-17	f	memberships:gym	t
75	AT&T	-227.63	2018-11-26	f	bills:cellphone	t
143	GameStop credit	-50	2018-12-18	t	credit-cards:X	t
142	Netflix	-11.76	2018-12-18	t	entertainment:X	t
1	11950 POS PUR 12/15 01:52 MCDONALD'S F1215 PITTSBURGH PA 1 011950 ~5814	-4.4800	2018-12-17	f	\N	\N
140	PAYPAL INST XFER SPOTIFYUSAI	-10.6900	2018-11-05	f	\N	\N
5	14034 POS PUR 12/15 05:21 TARGET 00 PITTSBURGH PA 151 014034 ~5310	-8.0800	2018-12-17	f	\N	\N
6	17091 POS PUR 12/16 13:44 DUNKIN #349047 Q PITTSBURGH PA 3490001 017091~5814	-2.5400	2018-12-17	f	\N	\N
11	41856 POS PUR 12/12 02:49 SUNOCO 036301420 PITTSBURGH PA 0363001 041856~5542	-49.4900	2018-12-13	f	\N	\N
12	5984 POS PUR 12/12 08:41 SUBWAY 00 PITTSBURGH PA 001 005984 ~5814	-14.1100	2018-12-13	f	\N	\N
13	43122 POS PUR 12/11 12:27 COMCAST THREE CS 800-266-2278 PA 00000000 043~4899	-206.6600	2018-12-11	f	\N	\N
16	54360 POS PUR 12/07 20:09 DUNKIN #349047 Q PITTSBURGH PA 3490005 054360~5814	-2.8400	2018-12-10	f	\N	\N
17	0026 POS PUR 12/10 11:29 MOE'S 938 BRIDGEVILLE PA 00A94759 000026 ~5814	-12.0900	2018-12-11	f	\N	\N
18	PAYPAL ECHECK 4MK22ANDA8UN4	-25.0000	2018-12-14	f	\N	\N
19	22444 POS PUR 12/08 03:42 TARGET 00 PITTSBURGH PA 152 022444 ~5310	-5.3500	2018-12-10	f	\N	\N
20	94296 POS PUR 12/09 03:41 Audible US 888-283-5051 NJ 00000000 094296 ~5968	-15.8500	2018-12-10	f	\N	\N
21	34369 POS PUR 12/09 19:50 GIANT-EAGLE #002 Pittsburgh PA 25038100 76569~5411	-50.3100	2018-12-10	f	\N	\N
26	25778 POS PUR 12/10 21:32 Kindle Svcs*M04A 866-321-8851 WA 00000000 025~5818	-11.6500	2018-12-10	f	\N	\N
27	13685 POS PUR 12/07 06:21 Amazon.com*M03EL Amzn.com/bill WA 00000000 01~5942	-9.9800	2018-12-07	f	\N	\N
28	PAYPAL INST XFER CALENDARSCO	-19.5100	2018-12-07	f	\N	\N
29	64023 POS PUR 12/07 04:07 Amazon.com*M028M Amzn.com/bill WA 00000000 06~5942	-9.5800	2018-12-07	f	\N	\N
30	54193 POS PUR 12/06 09:19 DUNKIN #349047 Q PITTSBURGH PA 3490005 054193~5814	-2.8400	2018-12-07	f	\N	\N
31	13646 POS PUR 12/05 05:06 GET GO #3185 WEST MIFFLIN PA 00000000 013646 ~5542	-12.4600	2018-12-06	f	\N	\N
32	54114 POS PUR 12/05 13:54 DUNKIN #349047 Q PITTSBURGH PA 3490005 054114~5814	-2.8400	2018-12-06	f	\N	\N
33	4173 POS PUR 12/05 13:54 DUNKIN #349047 Q PITTSBURGH PA 3490002 004173~5814	-2.1400	2018-12-06	f	\N	\N
35	53918 POS PUR 12/04 19:13 DUNKIN #349047 Q PITTSBURGH PA 3490005 053918~5814	-2.8400	2018-12-05	f	\N	\N
36	33518 POS PUR 12/05 20:56 BELLA RIAS PITTSBURGH PA 00000000 033518 ~5812	-17.4300	2018-12-06	f	\N	\N
37	32032 POS PUR 12/04 18:41 GIANT-EAGLE #002 Pittsburgh PA 25038000 65351~5411	-6.9800	2018-12-05	f	\N	\N
38	53755 POS PUR 12/03 09:01 DUNKIN #349047 Q PITTSBURGH PA 3490005 053755~5814	-2.8400	2018-12-04	f	\N	\N
39	6863 POS PUR 12/04 12:32 WAL-MART #5040 SCOTT TWP PA 50400018 499331 ~5310	-18.4400	2018-12-04	f	\N	\N
41	0008 POS PUR 12/03 07:52 MOE'S 938 BRIDGEVILLE PA 00A94759 000008 ~5814	-12.0900	2018-12-04	f	\N	\N
42	0036 POS PUR 11/30 22:48 MOE'S 938 BRIDGEVILLE PA 00A94759 000036 ~5814	-1.3900	2018-12-03	f	\N	\N
47	53258 POS PUR 11/30 22:44 DUNKIN #349047 Q PITTSBURGH PA 3490005 053258~5814	-2.6200	2018-12-03	f	\N	\N
48	66332 POS PUR 12/03 01:18 AMZN Mktp US*M00 Amzn.com/bill WA 00000000 06~5942	-37.2700	2018-12-03	f	\N	\N
49	24118 POS PUR 12/03 08:25 AMZN Mktp US*M05 Amzn.com/bill WA 00000000 02~5942	-9.6600	2018-12-03	f	\N	\N
50	53085 POS PUR 11/30 19:05 SHEETZ 00 PITTSBURGH PA 002 053085 ~5541	-22.9400	2018-12-03	f	\N	\N
51	41688 POS PUR 12/03 17:48 Kindle Svcs*M09N 866-321-8851 WA 00000000 041~5818	-9.5300	2018-12-03	f	\N	\N
53	61030 POS PUR 12/02 19:51 GIANT-EAGLE #002 Pittsburgh PA 25039100 13612~5411	-8.7900	2018-12-03	f	\N	\N
54	84993 POS PUR 12/02 07:24 TARGET 00 PITTSBURGH PA 108 084993 ~5310	-14.3600	2018-12-03	f	\N	\N
57	PAYPAL INST XFER PRAGPROG BK	-4.9900	2018-12-03	f	\N	\N
59	PAYPAL INST XFER PRAGPROG BK	-11.9700	2018-12-03	f	\N	\N
62	SURCHARGE FEE 666292 ATM WTD 11/29 18:56 CROSSROAD SUNOCO WEST MIFFLIN PA LK418	-2.0000	2018-11-30	f	\N	\N
64	FEE FOR ATM WTD 11/29 18:56 CROSSROAD SUNOCO WEST MIFFLIN PA LK418514 666~6011	-2.7500	2018-11-30	f	\N	\N
68	14593 POS PUR 11/29 00:23 HELLO BISTRO 250 UPPER SAINT C PA 54214593 01~5812	-15.1900	2018-11-30	f	\N	\N
69	666292 ATM WTD 11/29 18:56 CROSSROAD SUNOCO WEST MIFFLIN PA LK418514 666~6011	-20.0000	2018-11-30	f	\N	\N
70	46979 POS PUR 11/29 20:21 WENDYS 524 PITTSBURGH PA 62328008 348176 ~5814	-12.2700	2018-11-30	f	\N	\N
72	0013 POS PUR 11/26 07:20 MOE'S 938 BRIDGEVILLE PA 00A94759 000013 ~5814	-10.7500	2018-11-27	f	\N	\N
73	22030 POS PUR 11/23 03:00 Amazon.com*M04SJ Amzn.com/bill WA 00000000 02~5942	-15.9100	2018-11-26	f	\N	\N
77	50980 POS PUR 11/16 12:56 KIDS PLUS PEDIAT PITTSBURGH PA 75764534 05098~8011	-25.0000	2018-11-19	f	\N	\N
78	77481 POS PUR 11/14 14:05 RITE AID STORE - WEST MIFFLIN PA 00000000 077~5912	-17.9100	2018-11-14	f	\N	\N
8	Capital One (car)	-274.50	2018-12-17	f	car-payment	t
10	Amazon credit	-65.00	2018-12-17	f	credit-cards:X	t
9	Hello Bistro	-13.05	2018-12-14	f	eating-out:lunch	f
22	Jetbrains	-15.94	2018-12-10	f	software:work	t
15	Hello Bistro	-15.19	2018-12-10	f	eating-out:lunch	f
14	Target	-9.59	2018-12-10	f	misc:X	f
25	Rent	-1135.00	2018-12-10	f	rent	t
24	Target Credit	-27.00	2018-12-10	f	credit-cards:X	t
34	Dropbox	-9.99	2018-12-06	f	misc:X	t
45	Spotify	-10.69	2018-12-05	f	entertainment:X	t
46	Starbucks (card reload)	-15.00	2018-12-04	f	eating-out:coffee	f
44	Giant Eagle credit	-27.00	2018-12-04	f	credit-cards:X	t
43	Capital One Platinum	-67.00	2018-12-04	f	credit-cards:X	t
40	Carnegie Museums membership	-12.50	2018-12-04	f	memberships:museums	t
61	PayPal Credit	-66.00	2018-12-03	f	credit-cards:X	t
60	Barclays	-59.92	2018-12-03	f	credit-cards:X	t
58	NTB	-50.00	2018-12-03	f	credit-cards:X	t
56	Citi	-50.00	2018-12-03	f	credit-cards:X	t
55	Giant Eagle	-215.05	2018-12-03	f	groceries:X	f
52	Goldfish Swim School	-88.00	2018-12-03	f	memberships:swim-school	t
63	Oz-Code	-10.03	2018-11-30	f	software:work	t
65	AES Student Loan	-104.84	2018-11-29	f	student-loan	t
66	LA Fitness	-30.00	2018-11-28	f	memberships:gym-kids-klub	t
74	Walmart Credit	-50.00	2018-11-28	f	credit-cards:X	t
67	Duquesne Light	-182.51	2018-11-28	f	bills:utilities:electric	t
71	GitKraken	-49.00	2018-11-28	f	software:work	t
76	Capital One QuickSilver	-100.00	2018-11-26	f	credit-cards:X	t
23	DDI - Paycheck Deposit	1976.89	2018-12-07	f	income:paycheck	f
79	81343 POS PUR 11/13 02:39 ROCHESTER INNHAR PITTSBURGH PA 01463285 08134~5812	-32.4700	2018-11-13	f	\N	\N
81	CAPITAL ONE MOBILE PMT 830639800992448	-65.0000	2018-11-05	f	\N	\N
82	16421 POS PUR 11/25 13:21 DUNKIN #349047 Q PITTSBURGH PA 3490001 016421~5814	-8.7300	2018-11-26	f	\N	\N
85	COMENITY PAY OH WEB PYMT P18316221243570	-40.0000	2018-11-14	f	\N	\N
86	50062 POS PUR 11/11 12:50 MOE'S SW GRILL # WEXFORD PA 00215815 050062 ~5814	-9.4200	2018-11-13	f	\N	\N
87	PAYPAL INST XFER STARBUCKS	-15.0000	2018-11-06	f	\N	\N
88	36252 RECURRING 11/01 14:59 IPY*Goldfish Wex 724-7998850 PA 00001000 0362~8299	-88.0000	2018-11-02	f	\N	\N
89	50037 POS PUR 11/24 09:44 MOE'S SW GRILL # WEXFORD PA 00215815 050037 ~5814	-9.4200	2018-11-26	f	\N	\N
91	PAYPAL INST XFER GRUBHUBFOOD	-44.0000	2018-11-19	f	\N	\N
92	30753 POS PUR 11/10 20:32 SUNOCO 036301420 PITTSBURGH PA 0363001 030753~5542	-52.6300	2018-11-13	f	\N	\N
93	79270 POS PUR 11/10 07:51 AMZN Mktp US*M81 Amzn.com/bill WA 00000000 07~5942	-9.5300	2018-11-13	f	\N	\N
94	39259 POS PUR 11/07 15:31 2DLLRNC CNV CR16 PITTSBURGH PA 072 039259 ~5814	-10.2500	2018-11-08	f	\N	\N
95	NTB ONLINE PMT 122793765067430	-27.0000	2018-11-05	f	\N	\N
96	53988 POS PUR 11/25 08:09 MCDONALD'S F1215 PITTSBURGH PA 1 053988 ~5814	-8.1200	2018-11-26	f	\N	\N
98	PAYMENT FOR AMZ STORECARD 1730854913	-64.0000	2018-11-19	f	\N	\N
99	9911 POS PUR 11/10 00:03 COMCAST THREE CS 800-266-2278 PA 00000000 009~4899	-206.6600	2018-11-13	f	\N	\N
100	DEVELOPMENT DIME DIRECT DEP 929008534400MU9	1976.8800	2018-11-09	f	\N	\N
101	SURCHARGE FEE 4482 ATM WTD 11/03 16:03 Cardtronics CCSW PITTSBURGH PA LK943720	-2.5000	2018-11-05	f	\N	\N
102	44827 POS PUR 11/01 10:35 APL* ITUNES.COM/ 866-712-7753 CA 00000000 044~5735	-1.0600	2018-11-02	f	\N	\N
103	9236 POS PUR 11/27 12:26 SQ *BCGK INC. BRIDGEVILLE PA 00000000 009236~5811	-10.1100	2018-11-28	f	\N	\N
105	56896 POS PUR 11/16 18:42 WALGREENS #9736 PITTSBURGH PA 00000000 056896~5912	-47.5500	2018-11-19	f	\N	\N
106	50579 POS PUR 11/09 07:18 FIVE GUYS PA 179 BRIDGEVILLE PA 59050579 0505~5814	-18.1700	2018-11-13	f	\N	\N
108	4482 ATM WTD 11/03 16:03 Cardtronics CCSW PITTSBURGH PA LK943720 00367~6011	-20.0000	2018-11-05	f	\N	\N
109	PAYPAL ECHECK 4MK22AMB9XWAC	-65.0000	2018-11-05	f	\N	\N
110	50755 POS PUR 11/27 05:43 BP#953429836191 PITTSBURGH PA 9534001 050755 ~5542	-45.6900	2018-11-28	f	\N	\N
111	PAYPAL INST XFER GRUBHUBFOOD	-42.0000	2018-11-26	f	\N	\N
112	98131 RECURRING 11/16 03:44 LA FITNESS 949-255-7200 CA 00000000 098131 ~7997	-29.9500	2018-11-19	f	\N	\N
113	19968 POS PUR 11/10 18:52 Prime Video*M81L 888-802-3080 WA 00000000 019~5818	-9.5300	2018-11-13	f	\N	\N
115	82864 POS PUR 11/02 08:31 CARNEGIE MUSEUMS 412-622-3370 PA 00010037 082~7991	-12.5000	2018-11-05	f	\N	\N
116	63845 POS PUR 11/02 13:52 APL* ITUNES.COM/ 866-712-7753 CA 00000000 063~5735	-4.2700	2018-11-05	f	\N	\N
117	42008 POS PUR 11/24 11:44 GIANT-EAGLE #002 Pittsburgh PA 25038100 63028~5411	-68.3700	2018-11-26	f	\N	\N
119	PAYPAL INST XFER NETFLIX.COM	-11.7600	2018-11-19	f	\N	\N
120	0024 POS PUR 11/12 15:48 MOE'S 938 BRIDGEVILLE PA 00A94759 000024 ~5814	-12.0900	2018-11-13	f	\N	\N
121	PAYPAL INST XFER JETBRAINSAM	-21.2900	2018-11-07	f	\N	\N
122	BARCLAYCARD US CREDITCARD 581206399	-58.0700	2018-11-05	f	\N	\N
124	PAYPAL INST XFER MANNING PUB	-19.9900	2018-11-20	f	\N	\N
125	63945 POS PUR 11/10 04:17 GIANT-EAGLE #002 PITTSBURGH PA 00000000 06394~5411	-121.9100	2018-11-13	f	\N	\N
126	60713 POS PUR 11/06 06:30 DUNKIN #356242 BRIDGEVILLE PA 3562005 060713 ~5814	-2.8100	2018-11-07	f	\N	\N
127	0032 POS PUR 11/02 23:17 MOE'S 938 BRIDGEVILLE PA 00A94759 000032 ~5814	-6.7400	2018-11-05	f	\N	\N
128	30117 POS PUR 11/01 07:28 HELLO BISTRO 250 UPPER SAINT C PA 63330117 03~5812	-13.0500	2018-11-02	f	\N	\N
129	PAYPAL INST XFER MANNING PUB	-17.9900	2018-11-23	f	\N	\N
130	17386 POS PUR 11/18 07:50 SUBWAY 00 PITTSBURGH PA 001 017386 ~5814	-9.6200	2018-11-19	f	\N	\N
131	CAPITAL ONE AUTO CARPAY 006206175051197	-274.5000	2018-11-14	f	\N	\N
132	PAYPAL ECHECK 4MK22AMHZUZCE	-35.0000	2018-11-13	f	\N	\N
133	PAYPAL INST XFER DROPBOX	-9.9900	2018-11-06	f	\N	\N
134	FEE FOR ATM WTD 11/03 16:03 Cardtronics CCSW PITTSBURGH PA LK943720 00367~6011	-2.7500	2018-11-05	f	\N	\N
135	10164 POS PUR 11/25 08:15 Prime Video*M09T 888-802-3080 WA 00000000 010~5818	-11.6500	2018-11-26	f	\N	\N
136	83762 POS PUR 11/17 05:43 TARGET 00 PITTSBURGH PA 108 083762 ~5310	-62.1500	2018-11-19	f	\N	\N
138	50679 POS PUR 11/11 18:04 CVS/PHARMACY #02 Wexford PA 30244903 031728 ~5912	-22.5000	2018-11-13	f	\N	\N
139	COMENITY PAY UR WEB PYMT P18307218435022	-27.0000	2018-11-06	f	\N	\N
141	Starting Balance	1844.10	2018-10-31	f	\N	\N
123	Wenderlich - Paddle.com	-19.99	2018-11-26	f	memberships:dev-training	t
83	DDI - Paycheck Deposit	1977.80	2018-11-23	f	income:paycheck	f
118	Citi	-30.00	2018-11-20	f	credit-cards:X	t
104	Credit One	-55.00	2018-11-20	f	credit-cards:X	t
84	Discover	-50.00	2018-11-19	f	credit-cards:X	t
90	Lending Club	-105.68	2018-11-20	f	bills:loan-payment	t
97	Credit One	-55.00	2018-11-20	f	credit-cards:X	t
137	State Farm	-243.76	2018-11-14	f	bills:insurance	t
114	Audible.com	-15.85	2018-11-09	f	entertainment:X	t
80	Navient	-231.40	2018-11-09	f	student-loan	t
107	Rent	-1135.00	2018-11-08	f	rent	t
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: staging; Owner: postgres
--

COPY staging.transactions (id, description, amount, transactiondate, notprocessed, category, isbill, duplicate) FROM stdin;
319	Credit One Bank Payment 0000320881892	-100.0000	2019-02-15	f	\N	\N	\N
318	41849 POS PUR 02/13 19:08 SUBWAY 00 PITTSBURGH PA 001 041849 ~5814	-6.4200	2019-02-14	f	\N	\N	\N
315	DEVELOPMENT DIME DIRECT DEP 929709924823MU9	2039.4300	2019-02-15	f	\N	\N	\N
314	31537 POS PUR 02/14 06:10 HELLO BISTRO 250 UPPER SAINT C PA 52931537 03~5812	-15.1900	2019-02-15	f	\N	\N	\N
333	PAYPAL INST XFER PRAGPROG BK	-11.3700	2019-02-14	f	\N	\N	\N
326	NTB ONLINE PMT 112883366914266	-158.5700	2019-02-14	f	\N	\N	\N
321	21534 POS PUR 02/14 16:00 Amazon.com*MI3AT Amzn.com/bill WA 00000000 02~5942	-42.3800	2019-02-14	f	\N	\N	\N
320	Credit One Bank Payment 0000320881982	-100.0000	2019-02-15	f	\N	\N	\N
345	Amazon	-49.00	2019-02-15	t	\N	\N	\N
344	Duquesne Light	-202.50	2019-02-15	t	\N	\N	\N
323	0015 POS PUR 02/13 01:26 PETVALU #5176 PITTSBURG PA 00005281 000015 ~5948	-36.2900	2019-02-14	f	\N	\N	\N
322	COMENITY PAY OH WEB PYMT P19045246786994	-145.6100	2019-02-15	f	\N	\N	\N
343	Giant Eagle	-192.53	2019-02-15	t	\N	\N	\N
342	Subway	-13.89	2019-02-15	t	\N	\N	\N
341	Balance	7.41	2019-02-12	f	\N	\N	\N
340	CAPITAL ONE MOBILE PMT 904439800399300	-400.0000	2019-02-14	f	\N	\N	\N
337	PAYPAL INST XFER UBER	-4.0000	2019-02-14	f	\N	\N	\N
336	PAYPAL INST XFER UBER	-4.0000	2019-02-14	f	\N	\N	\N
339	H&R BLOCK 04 HRBLOCK RT RCXXXXXX6509	4725.9900	2019-02-13	f	\N	\N	\N
338	BARCLAYCARD US CREDITCARD 604474058	-164.7900	2019-02-14	f	\N	\N	\N
317	PAYPAL ECHECK 4MK22APSFQCQS	-318.9700	2019-02-15	f	\N	\N	\N
316	COMENITY PAY UR WEB PYMT P19045246851295	-207.2600	2019-02-15	f	\N	\N	\N
332	PAYPAL INST XFER UBER	-24.7300	2019-02-14	f	\N	\N	\N
335	TARGET CARD SRVC BILL PAY 000000006309313	-150.0000	2019-02-14	f	\N	\N	\N
334	PAYPAL INST XFER ITUNESAPPST	-0.9900	2019-02-14	f	\N	\N	\N
329	72601 POS PUR 02/13 02:22 PETSMART # 3001 PITTSBURGH PA 00007847 072601~5995	-27.6400	2019-02-14	f	\N	\N	\N
328	CITI CARD ONLINE PAYMENT 152883370753304	-691.6300	2019-02-14	f	\N	\N	\N
331	PAYPAL INST XFER UBER	-25.9600	2019-02-14	f	\N	\N	\N
330	PAYPAL INST XFER ITUNESAPPST	-43.8500	2019-02-14	f	\N	\N	\N
325	CAPITAL ONE MOBILE PMT 904439800391035	-163.0000	2019-02-14	f	\N	\N	\N
324	DISCOVER E-PAYMENT 9459	-600.0000	2019-02-14	f	\N	\N	\N
327	PAYPAL INST XFER STARBUCKS	-50.0000	2019-02-14	f	\N	\N	\N
346	LA Fitness	-29.95	2019-02-19	t	\N	f	\N
347	Comcast	-212.88	2019-02-17	t		t	\N
348	AT&T	-227.64	2019-02-17	t		t	\N
349	Corner Store - Pittsburgh Mills Mall	-8.95	2019-02-16	t		f	\N
350	New Dimensions Comics - Pittsburgh Mills Mall	-55.61	2019-02-16	t		f	\N
351	McDonald's	-8.12	2019-02-16	t		f	\N
352	Walmart Credit	-100	2019-02-17	t	credit-cards:X	t	\N
353	Amazon credit	-150	2019-02-17	t	credit-cards:X	t	\N
354	PayPal Credit	-200	2019-02-15	t	credit-cards:X	t	\N
355	Giant Eagle credit	-207.26	2019-02-13	t	credit-cards:X	t	\N
356	State Farm	-121.88	2019-02-17	t	car:insurance	t	\N
357	Amazon credit	-200	2019-02-16	t	credit-cards:X	t	\N
358	Navient	-13.88	2019-02-17	t	student-loan	t	\N
359	AES Student Loan	-45.08	2019-02-17	t	student-loan	t	\N
\.


--
-- Name: creditcards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.creditcards_id_seq', 16, true);


--
-- Name: miniregister_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.miniregister_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 143, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: staging; Owner: postgres
--

SELECT pg_catalog.setval('staging.transactions_id_seq', 359, true);


--
-- Name: creditcards creditcards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcards
    ADD CONSTRAINT creditcards_pkey PRIMARY KEY (id);


--
-- Name: miniregister miniregister_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miniregister
    ADD CONSTRAINT miniregister_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: staging; Owner: postgres
--

ALTER TABLE ONLY staging.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

