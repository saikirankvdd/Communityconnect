--
-- PostgreSQL database dump
--

\restrict SBrjotF2MCifUKMZgJvlp7NC8EyofUIKcScQcFaPsufbvTGkMRGgVz2W9QzeIc5

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg12+2)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres1
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres1;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: communities; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.communities (
    id character varying(64) NOT NULL,
    name character varying(255) NOT NULL,
    area character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    pincode character varying(20) NOT NULL,
    address text NOT NULL,
    type character varying(100),
    towers integer DEFAULT 1 NOT NULL,
    total_units integer DEFAULT 0 NOT NULL,
    occupied_units integer DEFAULT 0 NOT NULL,
    amenities_count integer DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    subscription_status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    plan character varying(50) DEFAULT 'GROWTH_TIER'::character varying NOT NULL,
    monthly_inflow numeric(15,2) DEFAULT 0.00,
    president_name character varying(255),
    president_email character varying(255),
    president_phone character varying(50),
    security_gate_phone character varying(50),
    description text,
    image_url text,
    onboarded_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.communities OWNER TO postgres1;

--
-- Name: flats; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.flats (
    id character varying(64) NOT NULL,
    community_id character varying(64) NOT NULL,
    tower character varying(100) NOT NULL,
    flat_number character varying(50) NOT NULL,
    floor integer NOT NULL,
    unit_type character varying(50) NOT NULL,
    sqft integer DEFAULT 1200,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.flats OWNER TO postgres1;

--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres1;

--
-- Name: group_demand_pools; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.group_demand_pools (
    id character varying(64) NOT NULL,
    community_id character varying(64) NOT NULL,
    service_id character varying(64) NOT NULL,
    title character varying(255) NOT NULL,
    target_households integer NOT NULL,
    current_households integer DEFAULT 1 NOT NULL,
    target_units integer NOT NULL,
    current_units integer DEFAULT 1 NOT NULL,
    min_discount_pct integer DEFAULT 15,
    expires_at timestamp without time zone NOT NULL,
    status character varying(50) DEFAULT 'COLLECTING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.group_demand_pools OWNER TO postgres1;

--
-- Name: household_members; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.household_members (
    id character varying(64) NOT NULL,
    household_id character varying(64) NOT NULL,
    user_id character varying(64),
    full_name character varying(255) NOT NULL,
    relation character varying(100) NOT NULL,
    phone_number character varying(50),
    access_granted boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.household_members OWNER TO postgres1;

--
-- Name: households; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.households (
    id character varying(64) NOT NULL,
    flat_id character varying(64) NOT NULL,
    primary_resident_id character varying(64),
    family_name character varying(255) NOT NULL,
    resident_type character varying(50) DEFAULT 'OWNER'::character varying NOT NULL,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    move_in_date date NOT NULL,
    move_out_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.households OWNER TO postgres1;

--
-- Name: occupancy_conflicts; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.occupancy_conflicts (
    id character varying(64) NOT NULL,
    flat_id character varying(64) NOT NULL,
    previous_household_id character varying(64),
    requesting_user_id character varying(64) NOT NULL,
    assigned_security_id character varying(64),
    status character varying(50) DEFAULT 'PENDING_VERIFICATION'::character varying NOT NULL,
    security_report text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at timestamp without time zone
);


ALTER TABLE public.occupancy_conflicts OWNER TO postgres1;

--
-- Name: pool_memberships; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.pool_memberships (
    id character varying(64) NOT NULL,
    pool_id character varying(64) NOT NULL,
    household_id character varying(64) NOT NULL,
    user_id character varying(64) NOT NULL,
    requested_units integer DEFAULT 1 NOT NULL,
    notes text,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pool_memberships OWNER TO postgres1;

--
-- Name: provider_communities; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.provider_communities (
    provider_id character varying(64) NOT NULL,
    community_id character varying(64) NOT NULL
);


ALTER TABLE public.provider_communities OWNER TO postgres1;

--
-- Name: provider_profiles; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.provider_profiles (
    id character varying(64) NOT NULL,
    user_id character varying(64) NOT NULL,
    company_name character varying(255) NOT NULL,
    service_type character varying(100) NOT NULL,
    is_solo_staff boolean DEFAULT false NOT NULL,
    rating numeric(3,2) DEFAULT 4.80,
    total_jobs integer DEFAULT 0,
    police_verified boolean DEFAULT true,
    badge character varying(100) DEFAULT 'SUPER_SERVICE'::character varying
);


ALTER TABLE public.provider_profiles OWNER TO postgres1;

--
-- Name: provider_reviews; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.provider_reviews (
    id character varying(64) NOT NULL,
    booking_id character varying(64) NOT NULL,
    provider_id character varying(64) NOT NULL,
    resident_id character varying(64) NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT provider_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.provider_reviews OWNER TO postgres1;

--
-- Name: service_bookings; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.service_bookings (
    id character varying(64) NOT NULL,
    community_id character varying(64) NOT NULL,
    household_id character varying(64) NOT NULL,
    service_id character varying(64) NOT NULL,
    provider_id character varying(64) NOT NULL,
    quotation_id character varying(64),
    service_type character varying(50) DEFAULT 'GROUP'::character varying NOT NULL,
    status character varying(50) DEFAULT 'REQUESTED'::character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.service_bookings OWNER TO postgres1;

--
-- Name: service_catalog; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.service_catalog (
    id character varying(64) NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    is_groupable boolean DEFAULT true NOT NULL,
    default_unit character varying(50) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    description text
);


ALTER TABLE public.service_catalog OWNER TO postgres1;

--
-- Name: service_quotations; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.service_quotations (
    id character varying(64) NOT NULL,
    pool_id character varying(64) NOT NULL,
    provider_id character varying(64) NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    total_estimated_amount numeric(12,2) NOT NULL,
    validity_date date NOT NULL,
    terms text,
    status character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.service_quotations OWNER TO postgres1;

--
-- Name: temporary_passes; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.temporary_passes (
    id character varying(64) NOT NULL,
    household_id character varying(64) NOT NULL,
    guest_name character varying(255) NOT NULL,
    guest_phone character varying(50) NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    pass_code character varying(20) NOT NULL,
    reason character varying(255),
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.temporary_passes OWNER TO postgres1;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres1
--

CREATE TABLE public.users (
    id character varying(64) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(50),
    role character varying(50) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    community_id character varying(64),
    flat_id character varying(64),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres1;

--
-- Data for Name: communities; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.communities (id, name, area, city, state, pincode, address, type, towers, total_units, occupied_units, amenities_count, status, subscription_status, plan, monthly_inflow, president_name, president_email, president_phone, security_gate_phone, description, image_url, onboarded_date, created_at) FROM stdin;
comm-bhooja	My Home Bhooja	Gachibowli	Hyderabad	Telangana	500032	C9R5+6V, Silpa Gram Craft Village, Gachibowli, Hyderabad	Gated Luxury High-Rise	8	1200	1140	52	ACTIVE	ACTIVE	ENTERPRISE_PREMIUM	4850000.00	S. Venkat Reddy	president.bhooja@communityconnect.com	+91 98490 12345	+91 98490 55001	A vibrant, secure, and ultra-green luxury community.	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80	2025-01-15	2026-09-22 18:55:45.891925
comm-saket	Saket Towers	Damayura	Hyderabad	Telangana	500062	Saket Road, Kapra, Damayura, Hyderabad	Residential Society	4	480	452	28	ACTIVE	ACTIVE	GROWTH_TIER	1820000.00	Elena Rostova	admin.saket@communityconnect.com	+91 98480 99881	+91 98480 66002	Tight-knit residential society with lush gardens.	https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80	2025-02-01	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: flats; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.flats (id, community_id, tower, flat_number, floor, unit_type, sqft, created_at) FROM stdin;
flat-bhooja-a101	comm-bhooja	Block A	101	1	3BHK	2450	2026-09-22 18:55:45.891925
flat-bhooja-a102	comm-bhooja	Block A	102	1	3BHK	2450	2026-09-22 18:55:45.891925
flat-saket-b304	comm-saket	Tower B	304	3	2BHK	1400	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init schema	SQL	V1__init_schema.sql	-496612309	postgres1	2026-09-22 18:55:44.61904	375	t
2	2	seed data	SQL	V2__seed_data.sql	-460805719	postgres1	2026-09-22 18:55:45.697073	206	t
\.


--
-- Data for Name: group_demand_pools; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.group_demand_pools (id, community_id, service_id, title, target_households, current_households, target_units, current_units, min_discount_pct, expires_at, status, created_at) FROM stdin;
pool-bhooja-ac-1	comm-bhooja	srv-ac-service	My Home Bhooja Summer AC Servicing Group Buying	10	2	18	5	20	2026-10-15 23:59:59	COLLECTING	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: household_members; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.household_members (id, household_id, user_id, full_name, relation, phone_number, access_granted, created_at) FROM stdin;
hm-1	house-bhooja-a101	user-resident-rahul	Rahul Sharma	PRIMARY	+91 98765 43210	t	2026-09-22 18:55:45.891925
hm-2	house-bhooja-a101	\N	Priya Sharma	SPOUSE	+91 98765 43211	t	2026-09-22 18:55:45.891925
hm-3	house-bhooja-a102	user-resident-ananya	Ananya Deshmukh	PRIMARY	+91 98111 22233	t	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.households (id, flat_id, primary_resident_id, family_name, resident_type, status, move_in_date, move_out_date, created_at) FROM stdin;
house-bhooja-a101	flat-bhooja-a101	user-resident-rahul	Rahul Family	OWNER	ACTIVE	2025-01-01	\N	2026-09-22 18:55:45.891925
house-bhooja-a102	flat-bhooja-a102	user-resident-ananya	Deshmukh Household	OWNER	ACTIVE	2025-01-10	\N	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: occupancy_conflicts; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.occupancy_conflicts (id, flat_id, previous_household_id, requesting_user_id, assigned_security_id, status, security_report, created_at, resolved_at) FROM stdin;
\.


--
-- Data for Name: pool_memberships; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.pool_memberships (id, pool_id, household_id, user_id, requested_units, notes, joined_at) FROM stdin;
pm-1	pool-bhooja-ac-1	house-bhooja-a101	user-resident-rahul	3	2 Split ACs in Bedrooms + 1 Cassette AC in Living Room	2026-09-22 18:55:45.891925
pm-2	pool-bhooja-ac-1	house-bhooja-a102	user-resident-ananya	2	2 Split ACs	2026-09-22 18:55:45.891925
\.


--
-- Data for Name: provider_communities; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.provider_communities (provider_id, community_id) FROM stdin;
prov-coolcare	comm-bhooja
prov-coolcare	comm-saket
prov-sunita	comm-bhooja
prov-lakshmi	comm-bhooja
\.


--
-- Data for Name: provider_profiles; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.provider_profiles (id, user_id, company_name, service_type, is_solo_staff, rating, total_jobs, police_verified, badge) FROM stdin;
prov-coolcare	user-provider-coolcare	CoolCare Services Pvt Ltd	AC_REPAIR	f	4.90	142	t	COMMUNITY_PREFERRED
prov-sunita	user-provider-sunita	Sunita Devi Cooking Services	COOK	t	4.95	28	t	POLICE_VERIFIED_STAFF
prov-lakshmi	user-provider-lakshmi	Lakshmi Housekeeping	MAID	t	4.88	35	t	POLICE_VERIFIED_STAFF
\.


--
-- Data for Name: provider_reviews; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.provider_reviews (id, booking_id, provider_id, resident_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: service_bookings; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.service_bookings (id, community_id, household_id, service_id, provider_id, quotation_id, service_type, status, scheduled_date, total_amount, notes, created_at) FROM stdin;
\.


--
-- Data for Name: service_catalog; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.service_catalog (id, name, category, is_groupable, default_unit, base_price, description) FROM stdin;
srv-ac-service	AC Servicing & Deep Jet Wash	Appliance Maintenance	t	AC Unit	899.00	Comprehensive high-pressure foam jet wash and gas check for split/window ACs.
srv-pest-control	Herbal Pest Control Treatment	Cleaning & Sanitation	t	Flat	1299.00	Odourless 2-coat herbal gel treatment for cockroaches and ants.
srv-cook	Dedicated Home Cook	Individual Household Staff	f	Month	8000.00	Experienced home cook for North/South Indian meals 2 times a day.
srv-maid	Housekeeping & Maid Service	Individual Household Staff	f	Month	5000.00	Daily sweeping, mopping, utensil cleaning, and dust management.
\.


--
-- Data for Name: service_quotations; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.service_quotations (id, pool_id, provider_id, price_per_unit, total_estimated_amount, validity_date, terms, status, created_at) FROM stdin;
\.


--
-- Data for Name: temporary_passes; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.temporary_passes (id, household_id, guest_name, guest_phone, start_time, end_time, pass_code, reason, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres1
--

COPY public.users (id, email, password_hash, full_name, phone_number, role, is_active, community_id, flat_id, created_at, updated_at) FROM stdin;
user-platform-admin	platform.admin@communityconnect.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Super Platform Admin	+91 99999 00000	PLATFORM_ADMIN	t	\N	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-admin-bhooja	admin.bhooja@communityconnect.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Ramesh Varma	+91 98490 11111	COMMUNITY_ADMIN	t	comm-bhooja	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-resident-rahul	rahul.sharma@gmail.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Rahul Sharma	+91 98765 43210	RESIDENT	t	comm-bhooja	flat-bhooja-a101	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-resident-ananya	ananya.deshmukh@gmail.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Ananya Deshmukh	+91 98111 22233	RESIDENT	t	comm-bhooja	flat-bhooja-a102	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-security-bhooja	security.bhooja@communityconnect.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Vikram Singh (Head Security)	+91 98490 55001	SECURITY	t	comm-bhooja	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-provider-coolcare	contact@coolcareac.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	CoolCare AC Services	+91 98888 77777	SERVICE_PROVIDER	t	\N	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-provider-sunita	sunita.cook@communityconnect.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Sunita Devi (Home Cook)	+91 98765 99001	SERVICE_PROVIDER	t	\N	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
user-provider-lakshmi	lakshmi.maid@communityconnect.com	$2a$10$e8W/2s1YjOQ62X.d7z53ceJp3eX.N3V9l42n.O0J4K.44e99/HjKO	Lakshmi Bai (Housekeeper Maid)	+91 98765 99002	SERVICE_PROVIDER	t	\N	\N	2026-09-22 18:55:45.891925	2026-09-22 18:55:45.891925
\.


--
-- Name: communities communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.communities
    ADD CONSTRAINT communities_pkey PRIMARY KEY (id);


--
-- Name: flats flats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.flats
    ADD CONSTRAINT flats_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: group_demand_pools group_demand_pools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.group_demand_pools
    ADD CONSTRAINT group_demand_pools_pkey PRIMARY KEY (id);


--
-- Name: household_members household_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_pkey PRIMARY KEY (id);


--
-- Name: households households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (id);


--
-- Name: occupancy_conflicts occupancy_conflicts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.occupancy_conflicts
    ADD CONSTRAINT occupancy_conflicts_pkey PRIMARY KEY (id);


--
-- Name: pool_memberships pool_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.pool_memberships
    ADD CONSTRAINT pool_memberships_pkey PRIMARY KEY (id);


--
-- Name: provider_communities provider_communities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_communities
    ADD CONSTRAINT provider_communities_pkey PRIMARY KEY (provider_id, community_id);


--
-- Name: provider_profiles provider_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_profiles
    ADD CONSTRAINT provider_profiles_pkey PRIMARY KEY (id);


--
-- Name: provider_profiles provider_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_profiles
    ADD CONSTRAINT provider_profiles_user_id_key UNIQUE (user_id);


--
-- Name: provider_reviews provider_reviews_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_reviews
    ADD CONSTRAINT provider_reviews_booking_id_key UNIQUE (booking_id);


--
-- Name: provider_reviews provider_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_reviews
    ADD CONSTRAINT provider_reviews_pkey PRIMARY KEY (id);


--
-- Name: service_bookings service_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_pkey PRIMARY KEY (id);


--
-- Name: service_catalog service_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_catalog
    ADD CONSTRAINT service_catalog_pkey PRIMARY KEY (id);


--
-- Name: service_quotations service_quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_quotations
    ADD CONSTRAINT service_quotations_pkey PRIMARY KEY (id);


--
-- Name: temporary_passes temporary_passes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.temporary_passes
    ADD CONSTRAINT temporary_passes_pkey PRIMARY KEY (id);


--
-- Name: flats uq_flat_community_tower_number; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.flats
    ADD CONSTRAINT uq_flat_community_tower_number UNIQUE (community_id, tower, flat_number);


--
-- Name: pool_memberships uq_pool_household; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.pool_memberships
    ADD CONSTRAINT uq_pool_household UNIQUE (pool_id, household_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_bookings_community; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_bookings_community ON public.service_bookings USING btree (community_id);


--
-- Name: idx_bookings_household; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_bookings_household ON public.service_bookings USING btree (household_id);


--
-- Name: idx_flats_community; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_flats_community ON public.flats USING btree (community_id);


--
-- Name: idx_households_flat; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_households_flat ON public.households USING btree (flat_id);


--
-- Name: idx_households_status; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_households_status ON public.households USING btree (status);


--
-- Name: idx_pools_community; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_pools_community ON public.group_demand_pools USING btree (community_id);


--
-- Name: idx_users_community; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_users_community ON public.users USING btree (community_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres1
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: flats flats_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.flats
    ADD CONSTRAINT flats_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: group_demand_pools group_demand_pools_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.group_demand_pools
    ADD CONSTRAINT group_demand_pools_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: group_demand_pools group_demand_pools_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.group_demand_pools
    ADD CONSTRAINT group_demand_pools_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service_catalog(id);


--
-- Name: household_members household_members_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;


--
-- Name: household_members household_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: households households_flat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_flat_id_fkey FOREIGN KEY (flat_id) REFERENCES public.flats(id) ON DELETE CASCADE;


--
-- Name: households households_primary_resident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_primary_resident_id_fkey FOREIGN KEY (primary_resident_id) REFERENCES public.users(id);


--
-- Name: occupancy_conflicts occupancy_conflicts_assigned_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.occupancy_conflicts
    ADD CONSTRAINT occupancy_conflicts_assigned_security_id_fkey FOREIGN KEY (assigned_security_id) REFERENCES public.users(id);


--
-- Name: occupancy_conflicts occupancy_conflicts_flat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.occupancy_conflicts
    ADD CONSTRAINT occupancy_conflicts_flat_id_fkey FOREIGN KEY (flat_id) REFERENCES public.flats(id) ON DELETE CASCADE;


--
-- Name: occupancy_conflicts occupancy_conflicts_previous_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.occupancy_conflicts
    ADD CONSTRAINT occupancy_conflicts_previous_household_id_fkey FOREIGN KEY (previous_household_id) REFERENCES public.households(id);


--
-- Name: occupancy_conflicts occupancy_conflicts_requesting_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.occupancy_conflicts
    ADD CONSTRAINT occupancy_conflicts_requesting_user_id_fkey FOREIGN KEY (requesting_user_id) REFERENCES public.users(id);


--
-- Name: pool_memberships pool_memberships_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.pool_memberships
    ADD CONSTRAINT pool_memberships_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id);


--
-- Name: pool_memberships pool_memberships_pool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.pool_memberships
    ADD CONSTRAINT pool_memberships_pool_id_fkey FOREIGN KEY (pool_id) REFERENCES public.group_demand_pools(id) ON DELETE CASCADE;


--
-- Name: pool_memberships pool_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.pool_memberships
    ADD CONSTRAINT pool_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: provider_communities provider_communities_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_communities
    ADD CONSTRAINT provider_communities_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE;


--
-- Name: provider_communities provider_communities_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_communities
    ADD CONSTRAINT provider_communities_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.provider_profiles(id) ON DELETE CASCADE;


--
-- Name: provider_profiles provider_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_profiles
    ADD CONSTRAINT provider_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: provider_reviews provider_reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_reviews
    ADD CONSTRAINT provider_reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id) ON DELETE CASCADE;


--
-- Name: provider_reviews provider_reviews_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_reviews
    ADD CONSTRAINT provider_reviews_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.provider_profiles(id);


--
-- Name: provider_reviews provider_reviews_resident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.provider_reviews
    ADD CONSTRAINT provider_reviews_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.users(id);


--
-- Name: service_bookings service_bookings_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id);


--
-- Name: service_bookings service_bookings_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id);


--
-- Name: service_bookings service_bookings_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.provider_profiles(id);


--
-- Name: service_bookings service_bookings_quotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.service_quotations(id);


--
-- Name: service_bookings service_bookings_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.service_catalog(id);


--
-- Name: service_quotations service_quotations_pool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_quotations
    ADD CONSTRAINT service_quotations_pool_id_fkey FOREIGN KEY (pool_id) REFERENCES public.group_demand_pools(id) ON DELETE CASCADE;


--
-- Name: service_quotations service_quotations_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.service_quotations
    ADD CONSTRAINT service_quotations_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.provider_profiles(id);


--
-- Name: temporary_passes temporary_passes_household_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres1
--

ALTER TABLE ONLY public.temporary_passes
    ADD CONSTRAINT temporary_passes_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO postgres1;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO postgres1;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO postgres1;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO postgres1;


--
-- PostgreSQL database dump complete
--

\unrestrict SBrjotF2MCifUKMZgJvlp7NC8EyofUIKcScQcFaPsufbvTGkMRGgVz2W9QzeIc5

