--
-- PostgreSQL database dump
--

\restrict vn4bGVSkZSn3wuMCl3jboX1GPhC3XMhaiveOqGBK6JcS4lUXxcSP00wMZASnQJR

-- Dumped from database version 14.5
-- Dumped by pg_dump version 18.3

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: COREI3
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "COREI3";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerta (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    mensaje text NOT NULL,
    estado character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT alerta_estado_check CHECK (((estado)::text = ANY ((ARRAY['ACTIVA'::character varying, 'SOLUCIONADA'::character varying])::text[])))
);


ALTER TABLE public.alerta OWNER TO postgres;

--
-- Name: alerta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerta_id_seq OWNER TO postgres;

--
-- Name: alerta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerta_id_seq OWNED BY public.alerta.id;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id integer NOT NULL,
    ci character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_seq OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_seq OWNED BY public.cliente.id;


--
-- Name: detalle_venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_venta (
    id integer NOT NULL,
    venta_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    total_precio numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT detalle_venta_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.detalle_venta OWNER TO postgres;

--
-- Name: detalle_venta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_venta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_venta_id_seq OWNER TO postgres;

--
-- Name: detalle_venta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_venta_id_seq OWNED BY public.detalle_venta.id;


--
-- Name: insumo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insumo (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    cantidad integer DEFAULT 0 NOT NULL,
    unidad_medida character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    precio numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT insumo_cantidad_check CHECK ((cantidad >= 0)),
    CONSTRAINT insumo_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.insumo OWNER TO postgres;

--
-- Name: insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insumo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insumo_id_seq OWNER TO postgres;

--
-- Name: insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insumo_id_seq OWNED BY public.insumo.id;


--
-- Name: inventario_movimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario_movimiento (
    id integer NOT NULL,
    inventario_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) DEFAULT 0 NOT NULL,
    descripcion text,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer,
    costo_anterior numeric(10,2),
    CONSTRAINT inventario_movimiento_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT inventario_movimiento_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SALIDA'::character varying])::text[])))
);


ALTER TABLE public.inventario_movimiento OWNER TO postgres;

--
-- Name: inventario_movimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_movimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventario_movimiento_id_seq OWNER TO postgres;

--
-- Name: inventario_movimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_movimiento_id_seq OWNED BY public.inventario_movimiento.id;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    precio numeric(10,2) DEFAULT 0 NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    codigo character varying(50),
    imagen character varying(255),
    CONSTRAINT producto_precio_check CHECK ((precio >= (0)::numeric)),
    CONSTRAINT producto_stock_check CHECK ((stock >= 0)),
    CONSTRAINT producto_stock_minimo_check CHECK ((stock_minimo >= 0))
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- Name: producto_costo_historico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_costo_historico (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    costo_anterior numeric(10,2) DEFAULT 0 NOT NULL,
    costo_nuevo numeric(10,2) DEFAULT 0 NOT NULL,
    usuario_id integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.producto_costo_historico OWNER TO postgres;

--
-- Name: producto_costo_historico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_costo_historico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_costo_historico_id_seq OWNER TO postgres;

--
-- Name: producto_costo_historico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_costo_historico_id_seq OWNED BY public.producto_costo_historico.id;


--
-- Name: producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_seq OWNER TO postgres;

--
-- Name: producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_seq OWNED BY public.producto.id;


--
-- Name: producto_movimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_movimiento (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    tipo character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    stock_anterior integer DEFAULT 0 NOT NULL,
    stock_nuevo integer DEFAULT 0 NOT NULL,
    motivo text,
    usuario_id integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT producto_movimiento_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT producto_movimiento_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SALIDA'::character varying])::text[])))
);


ALTER TABLE public.producto_movimiento OWNER TO postgres;

--
-- Name: producto_movimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_movimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_movimiento_id_seq OWNER TO postgres;

--
-- Name: producto_movimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_movimiento_id_seq OWNED BY public.producto_movimiento.id;


--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    contacto character varying(100),
    telefono character varying(30),
    email character varying(150),
    direccion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.proveedor OWNER TO postgres;

--
-- Name: proveedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedor_id_seq OWNER TO postgres;

--
-- Name: proveedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proveedor_id_seq OWNED BY public.proveedor.id;


--
-- Name: reposicion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reposicion (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer,
    proveedor_id integer,
    CONSTRAINT reposicion_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.reposicion OWNER TO postgres;

--
-- Name: reposicion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reposicion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reposicion_id_seq OWNER TO postgres;

--
-- Name: reposicion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reposicion_id_seq OWNED BY public.reposicion.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    password text NOT NULL,
    rol character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuario_rol_check CHECK (((rol)::text = ANY ((ARRAY['PROPIETARIO'::character varying, 'EMPLEADO'::character varying])::text[])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venta (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    total numeric(10,2) DEFAULT 0 NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    metodo_pago character varying(50) DEFAULT 'EFECTIVO'::character varying NOT NULL,
    cliente_nombre character varying(255),
    cliente_id integer,
    estado character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    fecha_anulacion timestamp without time zone,
    usuario_anulacion_id integer,
    motivo_anulacion text,
    CONSTRAINT venta_estado_check CHECK (((estado)::text = ANY ((ARRAY['ACTIVA'::character varying, 'ANULADA'::character varying])::text[])))
);


ALTER TABLE public.venta OWNER TO postgres;

--
-- Name: venta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venta_id_seq OWNER TO postgres;

--
-- Name: venta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venta_id_seq OWNED BY public.venta.id;


--
-- Name: alerta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerta ALTER COLUMN id SET DEFAULT nextval('public.alerta_id_seq'::regclass);


--
-- Name: cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id SET DEFAULT nextval('public.cliente_id_seq'::regclass);


--
-- Name: detalle_venta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta ALTER COLUMN id SET DEFAULT nextval('public.detalle_venta_id_seq'::regclass);


--
-- Name: insumo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo ALTER COLUMN id SET DEFAULT nextval('public.insumo_id_seq'::regclass);


--
-- Name: inventario_movimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_movimiento ALTER COLUMN id SET DEFAULT nextval('public.inventario_movimiento_id_seq'::regclass);


--
-- Name: producto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id SET DEFAULT nextval('public.producto_id_seq'::regclass);


--
-- Name: producto_costo_historico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_costo_historico ALTER COLUMN id SET DEFAULT nextval('public.producto_costo_historico_id_seq'::regclass);


--
-- Name: producto_movimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_movimiento ALTER COLUMN id SET DEFAULT nextval('public.producto_movimiento_id_seq'::regclass);


--
-- Name: proveedor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id SET DEFAULT nextval('public.proveedor_id_seq'::regclass);


--
-- Name: reposicion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reposicion ALTER COLUMN id SET DEFAULT nextval('public.reposicion_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: venta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta ALTER COLUMN id SET DEFAULT nextval('public.venta_id_seq'::regclass);


--
-- Data for Name: alerta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerta (id, producto_id, mensaje, estado, fecha) FROM stdin;
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id, ci, nombre, created_at) FROM stdin;
5	12457896	benjamin	2026-07-07 12:18:46.013571
6	12345678	jose	2026-07-07 19:36:13.000947
7	987654321	maria	2026-07-07 19:36:35.424878
\.


--
-- Data for Name: detalle_venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_venta (id, venta_id, producto_id, cantidad, precio_unitario, subtotal, total_precio) FROM stdin;
71	60	47	1	15.00	15.00	0.00
72	60	46	1	15.00	15.00	0.00
73	61	46	2	15.00	30.00	0.00
74	62	47	2	15.00	30.00	0.00
75	62	48	3	15.00	45.00	0.00
\.


--
-- Data for Name: insumo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumo (id, nombre, cantidad, unidad_medida, created_at, precio) FROM stdin;
39	papas	5	sacos	2026-07-07 12:31:24.890238	170.00
72	tinta	2	caja	2026-07-07 19:35:53.179603	10.00
\.


--
-- Data for Name: inventario_movimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario_movimiento (id, inventario_id, tipo, cantidad, costo_unitario, total, descripcion, fecha, usuario_id, costo_anterior) FROM stdin;
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id, nombre, descripcion, precio, stock, stock_minimo, created_at, codigo, imagen) FROM stdin;
47	salchichas	cono	15.00	47	10	2026-07-07 12:17:26.485565	\N	/uploads/products/product_47_1783441046492_ct7mrt.png
46	papas	conos	15.00	87	10	2026-07-07 12:16:32.130683	\N	/uploads/products/product_46_1783440992148_cawfad.png
48	Pollo	cono	15.00	77	10	2026-07-07 19:34:50.580589	\N	/uploads/products/product_48_1783467290646_ryf8fn.png
\.


--
-- Data for Name: producto_costo_historico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto_costo_historico (id, producto_id, costo_anterior, costo_nuevo, usuario_id, fecha) FROM stdin;
\.


--
-- Data for Name: producto_movimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto_movimiento (id, producto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id, fecha) FROM stdin;
54	47	SALIDA	1	50	49	Venta #60	1	2026-07-07 12:18:46.013571
55	46	SALIDA	1	80	79	Venta #60	1	2026-07-07 12:18:46.013571
56	46	SALIDA	2	79	77	Venta #61	1	2026-07-07 19:36:13.000947
57	47	SALIDA	2	49	47	Venta #62	1	2026-07-07 19:36:35.424878
58	48	SALIDA	3	70	67	Venta #62	1	2026-07-07 19:36:35.424878
59	46	ENTRADA	10	77	87	Reposición de stock	1	2026-07-07 19:36:56.779405
60	48	ENTRADA	10	67	77	Reposición de stock	1	2026-07-07 19:37:24.484524
\.


--
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proveedor (id, nombre, contacto, telefono, email, direccion, created_at) FROM stdin;
3	pepe gonzales	78945612	12345678	lo@gmial.com	calle 123\n	2026-07-07 19:35:21.483454
\.


--
-- Data for Name: reposicion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reposicion (id, producto_id, cantidad, fecha, usuario_id, proveedor_id) FROM stdin;
13	46	10	2026-07-07 19:36:56.779405	1	3
14	48	10	2026-07-07 19:37:24.484524	1	3
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, nombre, correo, password, rol, created_at) FROM stdin;
1	Admin	admin@test.com	$2b$10$9H59mGFJALNiDLxpYX8PnugmFe69Ex0/TJ6Aebxu4JxeZdPSR3Na6	PROPIETARIO	2026-06-25 10:12:04.630862
\.


--
-- Data for Name: venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venta (id, usuario_id, total, fecha, metodo_pago, cliente_nombre, cliente_id, estado, fecha_anulacion, usuario_anulacion_id, motivo_anulacion) FROM stdin;
60	1	30.00	2026-07-07 16:18:00	EFECTIVO	benjamin	5	ACTIVA	\N	\N	\N
61	1	30.00	2026-07-07 23:35:00	EFECTIVO	jose	6	ACTIVA	\N	\N	\N
62	1	75.00	2026-07-07 23:36:00	EFECTIVO	maria	7	ACTIVA	\N	\N	\N
\.


--
-- Name: alerta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerta_id_seq', 5, true);


--
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_seq', 7, true);


--
-- Name: detalle_venta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_venta_id_seq', 75, true);


--
-- Name: insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumo_id_seq', 72, true);


--
-- Name: inventario_movimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_movimiento_id_seq', 9, true);


--
-- Name: producto_costo_historico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_costo_historico_id_seq', 1, false);


--
-- Name: producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_seq', 48, true);


--
-- Name: producto_movimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_movimiento_id_seq', 60, true);


--
-- Name: proveedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedor_id_seq', 3, true);


--
-- Name: reposicion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reposicion_id_seq', 14, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);


--
-- Name: venta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venta_id_seq', 62, true);


--
-- Name: alerta alerta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerta
    ADD CONSTRAINT alerta_pkey PRIMARY KEY (id);


--
-- Name: cliente cliente_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_ci_key UNIQUE (ci);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- Name: detalle_venta detalle_venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_pkey PRIMARY KEY (id);


--
-- Name: insumo insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (id);


--
-- Name: inventario_movimiento inventario_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_movimiento
    ADD CONSTRAINT inventario_movimiento_pkey PRIMARY KEY (id);


--
-- Name: producto producto_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codigo_key UNIQUE (codigo);


--
-- Name: producto_costo_historico producto_costo_historico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_costo_historico
    ADD CONSTRAINT producto_costo_historico_pkey PRIMARY KEY (id);


--
-- Name: producto_movimiento producto_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT producto_movimiento_pkey PRIMARY KEY (id);


--
-- Name: producto producto_nombre_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_nombre_unique UNIQUE (nombre);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id);


--
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id);


--
-- Name: reposicion reposicion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reposicion
    ADD CONSTRAINT reposicion_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: venta venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (id);


--
-- Name: idx_alerta_producto_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerta_producto_id ON public.alerta USING btree (producto_id);


--
-- Name: idx_detalle_venta_venta_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detalle_venta_venta_id ON public.detalle_venta USING btree (venta_id);


--
-- Name: idx_producto_costo_historico_producto_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_costo_historico_producto_id ON public.producto_costo_historico USING btree (producto_id);


--
-- Name: idx_producto_movimiento_producto_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_movimiento_producto_id ON public.producto_movimiento USING btree (producto_id);


--
-- Name: idx_reposicion_producto_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reposicion_producto_id ON public.reposicion USING btree (producto_id);


--
-- Name: idx_venta_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venta_usuario_id ON public.venta USING btree (usuario_id);


--
-- Name: alerta alerta_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerta
    ADD CONSTRAINT alerta_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON DELETE CASCADE;


--
-- Name: detalle_venta detalle_venta_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON DELETE RESTRICT;


--
-- Name: detalle_venta detalle_venta_venta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_venta_id_fkey FOREIGN KEY (venta_id) REFERENCES public.venta(id) ON DELETE CASCADE;


--
-- Name: inventario_movimiento inventario_movimiento_inventario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_movimiento
    ADD CONSTRAINT inventario_movimiento_inventario_id_fkey FOREIGN KEY (inventario_id) REFERENCES public.insumo(id) ON DELETE CASCADE;


--
-- Name: inventario_movimiento inventario_movimiento_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_movimiento
    ADD CONSTRAINT inventario_movimiento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: producto_costo_historico producto_costo_historico_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_costo_historico
    ADD CONSTRAINT producto_costo_historico_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON DELETE CASCADE;


--
-- Name: producto_costo_historico producto_costo_historico_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_costo_historico
    ADD CONSTRAINT producto_costo_historico_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: producto_movimiento producto_movimiento_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT producto_movimiento_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON DELETE CASCADE;


--
-- Name: producto_movimiento producto_movimiento_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_movimiento
    ADD CONSTRAINT producto_movimiento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: reposicion reposicion_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reposicion
    ADD CONSTRAINT reposicion_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON DELETE CASCADE;


--
-- Name: reposicion reposicion_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reposicion
    ADD CONSTRAINT reposicion_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedor(id) ON DELETE SET NULL;


--
-- Name: reposicion reposicion_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reposicion
    ADD CONSTRAINT reposicion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: venta venta_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON DELETE SET NULL;


--
-- Name: venta venta_usuario_anulacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_usuario_anulacion_id_fkey FOREIGN KEY (usuario_anulacion_id) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- Name: venta venta_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: COREI3
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict vn4bGVSkZSn3wuMCl3jboX1GPhC3XMhaiveOqGBK6JcS4lUXxcSP00wMZASnQJR

