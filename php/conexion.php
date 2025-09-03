<?php
  $host = "localhost";
  $usuario = "root";
  $clave = "";
  $bd = "portfolio";

  $conn = new mysqli($host, $usuario, $clave, $bd, 3307);

  if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
  }
?>