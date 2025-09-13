<?php
  session_start();
  file_put_contents("debug_sesion.txt", json_encode($_SESSION));

  if (!isset($_SESSION['usuario_logueado'])) {
    http_response_code(401);
    exit;
  }
  http_response_code(200);
?>
