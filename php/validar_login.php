<?php
  require 'conexion.php';
  require 'common.php';
  session_start();
  setcookie("PHPSESSID", session_id(), [
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax'
  ]);

 
  file_put_contents("debug.txt", file_get_contents("php://input"));

  $data = json_decode(file_get_contents('php://input'), true);

  if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    sendResponse(0, "Metodo no permitido.");
  }
  if(!isset($data['user']) || !isset($data['password'])){
    sendResponse(0, "Rellene los campos obligatorios para continuar.");
  }
  $username = $data['user'];
  $password = $data['password'];

  try {
    //constructo ya consulta
    $stmt = $conn->prepare("SELECT * FROM usuarios u WHERE u.usuario_nombre = ? OR u.email = ?");
    $stmt->bind_param("ss", $username, $username);
    //ejecuto
    $stmt->execute();
    $resultado = $stmt->get_result();

    if($resultado->num_rows === 0 ){
      sendResponse(0, "Usuario no encontrado");
    }

    $usuario = $resultado->fetch_assoc();

    if($usuario['password'] !== $data['password']){
      sendResponse(0, "Contraseña incorrecta.");
    
    }
    $_SESSION['usuario_logueado'] = true;
    sendResponse(1, "Bienvenido/a ".$username." de nuevo", [
      "usuario" => $usuario['usuario_nombre'],
      "email"  => $usuario['email']
    ]);
  } catch (\Exception  $e) {
    handleException($e);
  }

?>
