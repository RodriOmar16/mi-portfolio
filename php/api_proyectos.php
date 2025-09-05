<?php
  session_start();
  if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autorizado"]);
    exit();
  }

  include 'conexion.php';
  $sql = "SELECT nombre, descripcion FROM proyectos";
  $res = $conn->query($sql);

  $proyectos = [];
  while ($row = $res->fetch_assoc()) {
    $proyectos[] = $row;
  }

  echo json_encode($proyectos);
?>