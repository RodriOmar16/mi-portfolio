-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 20-09-2025 a las 23:37:13
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `portfolio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `proyecto_id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fechaDesde` date NOT NULL,
  `fechaHasta` date DEFAULT NULL,
  `inhabilitada` tinyint(1) NOT NULL DEFAULT 0,
  `url_fotos` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`proyecto_id`, `nombre`, `descripcion`, `fechaDesde`, `fechaHasta`, `inhabilitada`, `url_fotos`) VALUES
(7, 'Prueba 1', 'había una vez un gato montes, queres que te lo cuente otra vez ? ', '2025-09-16', '0000-00-00', 1, 'esto_deberia_ser_un_link'),
(8, 'Prueba 2', 'srdtfgyuhijok\nertyuiop\nzxcvbnm,\n31245678', '2024-01-02', '2025-06-10', 1, 'esto_es_una_url_de_fotos'),
(9, 'Calculadora de Polinomios', 'Es una aplicación que sirve como herramienta de apoyo para los cálculos que se realizan en la matería de progración numérica, tema: \"Raíces de polinomios\"\nCon ella es posible:\n- Graficar el polonomio\n- Realizar operaciones de división por Horner doble o simple\n- Aproximar la raíz por newton para polinomios\n- Calcular raices enteras y racionales si las tiene\n- Aproximar raices por Bairstow\n- Cota de las raices reales por Lagrange, Newton, Laguerre\nLa interfaz gráfica es mayor parte está hecha con Netbeans, y controlada desde una clase especifica para manipaler la GUI.\nAplica patrones de diseño MVC.', '2025-06-01', '2025-07-22', 0, 'Java/calc_polinomios'),
(10, 'Conversor de Bases', 'El objetivo de este proyecto es convertir numéros de una base de sistema de numeración en otra, aplicando distintos métodos:\n- Suma ponderada\n- Divisón reiterada\n- Multiplicación reiterada\n- Método directo', '2025-05-03', '2025-05-05', 0, 'Java/conversor_bases'),
(11, 'Resolución de Ecua. NO Lineales', 'Este programa, es una gran ayuda para corroborar resultados y trazas de los procesos creados por los métodos de resolución de ecuaciones no lineales (Abiertos y Cerrados):\n- Bisección\n- Regula Falsi\n- Regula Falsi Modificada \n- Newton\n- Secante\n- Punto Fijo\n- Convergencia Cúbica\n- Aceleración de convergencia (Aitken)\nPermitiendo ingresar una función y los parámetros que requiera el método y muestra la traza.', '2025-05-06', '2025-07-09', 0, 'Java/res_ecu_NO_lineales'),
(12, 'Sistema de Gestión de Biblioteca', 'Este es un sistema completo de Gestión de biblioteca, aún no terminado.\nSe conecta a una base de datos PostgreSQL utilizando el PostgreSQL JDBC Driver.\nGestiona los socios y los libros, por medio de un panel de ABM para cada uno.\nTambién una vista que permite controlar y asociar los libros a socios y llevar un control (Está en proceso).\nUtilizando interfaz gráfica a Netbeans, dado que permite una mayor maquetación.\nUtiliza también el patron de diseño MVC.', '2025-07-18', '0000-00-00', 0, 'Java/sist_gestion_biblioteca'),
(13, 'SIU con MVC', 'Este es una aplicación que simula es Sistema de Alumnos (SIU). \nNo se conecta a una base de datos, hace la lectura de un .txt para validar el login.\nTiene también vista de examenes tomando está información de un .txt análogamente.\nRealizado utilizando patrones de diseño MVC.', '2025-07-02', '2025-07-03', 0, 'Java/siu_mvc'),
(14, 'Login y Registro de Usuarios', 'Es un proyecto simple, que se conecta al backend utilizando Firebase.\nEl front End está desarrollado todo con vue 2 y vuetify.\nPermite registrar usuarios nuevos y validar el login.', '2024-11-22', '2024-12-20', 0, 'Vue/firebase'),
(15, 'Sistema de Getión de Reservas', 'Este es un proyecto en desarrollo, que tiene como finalidad ser un sistema de gestión de reservas para eventos.\nUtilizando Vue.js 3 para el Front End y PHP para el back end utilizando como API y como Base de datos el DBMS de PostgreSQL.\nAdmite un login para distintos tipos de roles para usuarios: DBA, Admin y Organizador.', '2025-03-04', '0000-00-00', 0, 'Vue/reservas'),
(16, 'Calculadora', '', '2023-04-03', '2023-05-11', 0, 'React/calculadora'),
(17, 'Globos Media Luna', 'Tienda e-commerce para una emprendimiento de venta de Globos, Bouquets, Menaje, etc...\nUtilizando plugins de Wordpress: WooCommercer, Elementor\nManejo de distintos Roles: Admin & Gestor.\nRealizando envíos por medio de un Plugin de Correos.', '2024-02-01', '2024-04-09', 0, 'Wordpress/globos'),
(18, 'The On Led', 'Landing page y Tienda e-commerce para la venta de letreros de luces de Neon.\nUtilizando plugins de Wordpress: WooCommerce y Elementor.', '2024-01-19', '2024-03-26', 0, 'Wordpress/theon');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos_tecnologia`
--

CREATE TABLE `proyectos_tecnologia` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(10) NOT NULL,
  `tecnologia_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos_tecnologia`
--

INSERT INTO `proyectos_tecnologia` (`id`, `proyecto_id`, `tecnologia_id`) VALUES
(3, 7, 4),
(4, 8, 11),
(5, 8, 13),
(6, 8, 4),
(7, 7, 11),
(8, 7, 14),
(9, 7, 13),
(10, 9, 12),
(11, 10, 12),
(12, 11, 12),
(13, 12, 12),
(14, 13, 12),
(15, 12, 20),
(16, 14, 22),
(17, 14, 11),
(18, 15, 19),
(19, 15, 20),
(20, 15, 11),
(21, 16, 14),
(25, 17, 18),
(27, 14, 23),
(28, 15, 23),
(29, 18, 18),
(30, 18, 24),
(31, 18, 25),
(32, 17, 24),
(33, 17, 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` int(10) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `inhabilitada` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `descripcion`, `inhabilitada`) VALUES
(1, 'admin', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnologias`
--

CREATE TABLE `tecnologias` (
  `tecnologia_id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `inhabilitada` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tecnologias`
--

INSERT INTO `tecnologias` (`tecnologia_id`, `nombre`, `inhabilitada`) VALUES
(1, 'HTML 5', 0),
(2, 'CSS', 0),
(4, 'JavaScript', 0),
(11, 'Vue.js', 0),
(12, 'Java', 0),
(13, 'Node.js', 0),
(14, 'React', 0),
(15, 'prueba 2', 1),
(16, 'prueba 3', 1),
(18, 'Wordpress', 0),
(19, 'PHP', 0),
(20, 'PostgreSQL', 0),
(21, 'Oracle', 0),
(22, 'Firebase', 0),
(23, 'Vuetify', 0),
(24, 'WooCommerce', 0),
(25, 'Elementor', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(10) NOT NULL,
  `usuario_nombre` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `inhabilitado` tinyint(1) NOT NULL DEFAULT 0,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `usuario_nombre`, `email`, `inhabilitado`, `password`) VALUES
(1, 'rodriomar16', 'rodrigo.omar.miranda16@gmail.com', 0, 'Rodrigo1698*');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_roles`
--

CREATE TABLE `usuarios_roles` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_roles`
--

INSERT INTO `usuarios_roles` (`usuario_id`, `rol_id`) VALUES
(1, 1),
(1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`proyecto_id`);

--
-- Indices de la tabla `proyectos_tecnologia`
--
ALTER TABLE `proyectos_tecnologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proyectos` (`proyecto_id`),
  ADD KEY `fk_tecnologia` (`tecnologia_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indices de la tabla `tecnologias`
--
ALTER TABLE `tecnologias`
  ADD PRIMARY KEY (`tecnologia_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `user_email` (`email`);

--
-- Indices de la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD KEY `fk_usuarios` (`usuario_id`),
  ADD KEY `fk_roles` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `proyecto_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `proyectos_tecnologia`
--
ALTER TABLE `proyectos_tecnologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tecnologias`
--
ALTER TABLE `tecnologias`
  MODIFY `tecnologia_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `proyectos_tecnologia`
--
ALTER TABLE `proyectos_tecnologia`
  ADD CONSTRAINT `fk_proyectos` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`proyecto_id`),
  ADD CONSTRAINT `fk_tecnologia` FOREIGN KEY (`tecnologia_id`) REFERENCES `tecnologias` (`tecnologia_id`);

--
-- Filtros para la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD CONSTRAINT `fk_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`),
  ADD CONSTRAINT `fk_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
