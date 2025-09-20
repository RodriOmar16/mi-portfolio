<?php
  $host    = "sql105.infinityfree.com";
  $usuario = "if0_39988774";
  $clave   = "qSdjELMelYinI";
  $bd      = "if0_39988774_portfolio";

  $conn = new mysqli($host, $usuario, $clave, $bd);

  if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
  }
?>