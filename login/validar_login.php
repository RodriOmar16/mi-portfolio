<?php
  session_start();
  include '../php/conexion.php';

  $email = $_POST['emailUser'];
  $pass = $_POST['pass'];

  $sql = "SELECT * FROM usuarios WHERE email = '$email' AND password = '$pass'";
  $resultado = $conn->query($sql);

  if ($resultado->num_rows === 1) {
    $_SESSION['usuario'] = $email;
    header("Location: ../php/backoffice/back_office.php");
  } else {
    header("Location: index.php?error=1");
  }
?>
