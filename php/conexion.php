<?php
  $host    = "localhost";
  $usuario = "root";
  $clave   = "";
  $bd      = "portfolio";

  /*$host    = "sql105.infinityfree.com";
  $usuario = "if0_39988774";
  $clave   = "qSdjELMelYinI";
  $bd      = "if0_39988774_portfolio";*/

  $conn = new mysqli($host, $usuario, $clave, $bd, 3307);
  $conn->set_charset("utf8mb4");

  if ($conn->connect_error) {
    file_put_contents("debug.txt", "Error de conexión: " . $conn->connect_error . "\n", FILE_APPEND);
    die("Error de conexión: " . $conn->connect_error);
  }else{
    file_put_contents("debug.txt", "Conexión exitosa\n", FILE_APPEND);
  }
?>