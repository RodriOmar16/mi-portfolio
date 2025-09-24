<?php
  require 'common.php';
  require __DIR__ . '/vendor/autoload.php'; // ← carga automática de PHPMailer

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $nombre  = $data['nombre']  ?? '';
    $email   = $data['email']   ?? '';
    $mensaje = $data['mensaje'] ?? '';

    if (empty($nombre) || empty($email) || empty($mensaje)) {
      sendResponse(0, "Requiere rellenar los campos del formulario.");
      exit;
    }

    $mail = new PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host       = 'smtp.gmail.com';
      $mail->SMTPAuth   = true;
      $mail->Username   = 'rodrigoomarmiranda1@gmail.com';
      $mail->Password   = 'lpio blfa afes pald';
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port       = 587;

      $mail->setFrom($email, $nombre);
      $mail->addAddress('rodrigoomarmiranda1@gmail.com');
      $mail->Subject = "Nuevo mensaje desde tu Portfolio";
      $mail->Body    = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";

      $mail->send();
      sendResponse(1, "Mensaje enviado correctamente.");
    } catch (Exception $e) {
      handleException("Error PHPMailer: " . $e->getMessage());
      sendResponse(0, "No se pudo enviar el mensaje.");
    }
  } else {
    sendResponse(0, "Método no permitido.");
  }
?>