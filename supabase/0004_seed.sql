-- Carga el catálogo de demo que hoy vive en src/data/*.seed.ts, para no arrancar
-- con el panel vacío. Los productos no tienen fotos reales todavía (mientras tanto
-- el sitio muestra el ícono genérico de su categoría) — subilas desde /admin/productos.

insert into categorias (slug, nombre, icono, destacada, orden) values
  ('electrodomesticos', 'Electrodomésticos', 'BoltIcon', true, 1),
  ('climatizacion', 'Climatización', 'CloudIcon', true, 2),
  ('tv-tecnologia', 'Televisores y Tecnología', 'TvIcon', true, 3),
  ('pintureria', 'Pinturería', 'PaintBrushIcon', true, 4),
  ('bazar-hogar', 'Bazar y Hogar', 'HomeIcon', false, 5),
  ('muebles-jardin', 'Muebles y Jardín', 'SunIcon', false, 6),
  ('colchones-blanqueria', 'Colchones y Blanquería', 'MoonIcon', false, 7),
  ('herramientas', 'Herramientas', 'WrenchScrewdriverIcon', false, 8)
on conflict (slug) do nothing;

insert into productos
  (slug, nombre, marca, descripcion, descripcion_larga, categoria_id, precio, precio_promo, oferta_hasta, destacado, nuevo, stock)
values
  ('heladera-no-frost-375l-electrolux', 'Heladera No Frost 375L', 'Electrolux',
   'Heladera No Frost con freezer superior, bajo consumo y amplia capacidad.',
   'Heladera No Frost de 375 litros, ideal para familias grandes. Freezer superior, estantes graduables, cíclica automática y bajo consumo energético clase A. Terminación acero inoxidable.',
   (select id from categorias where slug = 'electrodomesticos'), 850000, 720000, now() + interval '120 hours', true, false, 4),

  ('microondas-grill-20l-bgh', 'Microondas Grill 20L', 'BGH',
   'Microondas con función grill, 10 niveles de potencia y panel digital.', null,
   (select id from categorias where slug = 'electrodomesticos'), 180000, null, null, false, true, 10),

  ('lavarropas-carga-frontal-8kg-drean', 'Lavarropas Carga Frontal 8kg', 'Drean',
   'Lavarropas automático carga frontal, 1200 RPM, múltiples programas de lavado.', null,
   (select id from categorias where slug = 'electrodomesticos'), 620000, null, null, true, false, 6),

  ('aire-acondicionado-split-3000fc-surrey', 'Aire Acondicionado Split Frío/Calor 3000F', 'Surrey',
   'Split frío/calor, tecnología inverter, control remoto y bajo consumo.',
   'Aire acondicionado split frío/calor de 3000 frigorías, tecnología inverter para mayor eficiencia energética. Incluye control remoto, filtro purificador y modo sueño.',
   (select id from categorias where slug = 'climatizacion'), 950000, 799000, now() + interval '18 hours', true, false, 3),

  ('ventilador-de-pie-20-sigma', 'Ventilador de Pie 20"', 'Sigma',
   'Ventilador de pie con 3 velocidades, oscilación automática y altura regulable.', null,
   (select id from categorias where slug = 'climatizacion'), 65000, null, null, false, true, 12),

  ('estufa-a-gas-tiro-balanceado-emege', 'Estufa a Gas Tiro Balanceado', 'Emege',
   'Estufa a gas de tiro balanceado, 4000 kcal/h, para ambientes medianos.', null,
   (select id from categorias where slug = 'climatizacion'), 210000, null, null, false, false, 5),

  ('smart-tv-50-4k-noblex', 'Smart TV 50" 4K UHD', 'Noblex',
   'Smart TV 4K con Android TV, HDR y Bluetooth integrado.',
   'Smart TV de 50 pulgadas con resolución 4K UHD, sistema Android TV con acceso a todas tus apps, HDR10, Bluetooth para auriculares y control remoto con comando de voz.',
   (select id from categorias where slug = 'tv-tecnologia'), 780000, 699000, now() + interval '72 hours', true, false, 7),

  ('smart-tv-32-hd-tcl', 'Smart TV 32" HD', 'TCL',
   'Smart TV HD ideal para dormitorios y cocina, con Wi-Fi integrado.', null,
   (select id from categorias where slug = 'tv-tecnologia'), 320000, null, null, false, true, 9),

  ('latex-interior-20l-tersuave', 'Látex Interior Premium 20L', 'Tersuave',
   'Látex interior lavable, alto rendimiento y excelente cubritividad.',
   'Látex para interiores de la línea premium Tersuave. Alto rendimiento (hasta 12m²/L por mano), terminación mate lavable, disponible en blanco y colores a pedido.',
   (select id from categorias where slug = 'pintureria'), 145000, 120000, now() + interval '40 minutes', true, false, 15),

  ('esmalte-sintetico-1l-tersuave', 'Esmalte Sintético Brillante 1L', 'Tersuave',
   'Esmalte sintético de gran cubrición y terminación brillante para madera y metal.', null,
   (select id from categorias where slug = 'pintureria'), 18000, null, null, false, false, 25),

  ('set-de-ollas-x7-essen', 'Set de Ollas x7 Piezas', 'Essen',
   'Juego de ollas de aluminio antiadherente, aptas para todo tipo de cocinas.', null,
   (select id from categorias where slug = 'bazar-hogar'), 210000, null, null, false, true, 8),

  ('juego-de-sabanas-queen-cannon', 'Juego de Sábanas Queen', 'Cannon',
   'Sábanas 100% algodón, terminación satinada, incluye funda de almohada.', null,
   (select id from categorias where slug = 'colchones-blanqueria'), 55000, 42000, now() + interval '48 hours', true, false, 20),

  ('colchon-queen-resortes-cannon', 'Colchón Queen Resortes Pocket', 'Cannon',
   'Colchón de resortes pocket, alta densidad, doble faz verano/invierno.',
   'Colchón Queen 160x200 con sistema de resortes pocket independientes que reducen la transmisión de movimiento. Doble faz verano/invierno y funda acolchada antialérgica.',
   (select id from categorias where slug = 'colchones-blanqueria'), 480000, null, null, false, true, 5),

  ('reposera-playera-aluminio-x2', 'Reposera Playera Aluminio (Par)', null,
   'Set de 2 reposeras de aluminio con respaldo reclinable en 5 posiciones.', null,
   (select id from categorias where slug = 'muebles-jardin'), 89000, null, null, false, false, 14),

  ('juego-mesa-sillas-jardin-x4', 'Juego de Mesa y 4 Sillas de Jardín', null,
   'Set de jardín en resina, resistente a la intemperie, fácil de limpiar.', null,
   (select id from categorias where slug = 'muebles-jardin'), 350000, null, null, true, false, 4),

  ('cortadora-de-cesped-a-nafta', 'Cortadora de Césped a Nafta', null,
   'Motor a nafta 4 tiempos, cesto recolector y altura de corte regulable.',
   'Cortadora de césped con motor a nafta de 4 tiempos, cesto recolector desmontable, 6 posiciones de altura de corte y ruedas reforzadas. Ideal para jardines medianos y grandes.',
   (select id from categorias where slug = 'herramientas'), 420000, 375000, now() + interval '144 hours', false, false, 3),

  ('taladro-percutor-black-decker', 'Taladro Percutor 1/2"', 'Black+Decker',
   'Taladro percutor con reversa, incluye maletín y set de mechas.', null,
   (select id from categorias where slug = 'herramientas'), 95000, null, null, false, true, 11)
on conflict (slug) do nothing;

insert into banners (titulo, subtitulo, etiqueta, color_fondo, color_texto, orden) values
  ('¡Hasta 12 cuotas sin interés!', 'Con tarjetas de crédito seleccionadas. Aprovechá antes de que termine el mes', '🔥 Bancarias', 'var(--red-brand)', '#FFFFFF', 1),
  ('15% OFF pagando por transferencia', 'Válido en toda la tienda, todos los días. El descuento se aplica al instante', '💸 Transferencia', 'var(--ink)', '#FFFFFF', 2),
  ('¿Necesitás financiar tu compra?', 'Créditos personales disponibles. Consultá condiciones en el local o por WhatsApp', '🤝 Financiación', 'var(--red-dark)', '#FFFFFF', 3),
  ('3 cuotas sin interés con todas las tarjetas', 'En electrodomésticos seleccionados. Stock limitado, ¡no te quedes afuera!', '⚡ Cuotas', 'var(--offer)', '#1a1a1a', 4);
