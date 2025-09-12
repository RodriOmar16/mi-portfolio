<?php
  require 'conexion.php';
  require 'common.php';

  try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'OPTIONS') {
      http_response_code(200);
      exit;
    }

    if ($method === 'GET') {
      file_put_contents("debugProject.txt", json_encode($_GET));
      $data = $_GET;
    } else {
      $rawInput = file_get_contents("php://input");
      file_put_contents("debugProject.txt", $rawInput);
      $data = json_decode($rawInput, true);
    }

    //file_put_contents("debugProject.txt", "Método: $method\nDatos: " . json_encode($data));

    switch ($method) {
      case 'GET':
        obtenerProyectos($data);
        break;

      case 'POST':
        if (!isset($data['accion'])) {
          sendResponse(0, "Falta el parámetro 'accion'.");
        }

        switch ($data['accion']) {
          case 'crear':
            crearProyectos($data);
            break;
          case 'editar':
            actualizarProyectos($data);
            break;
          case 'eliminar':
            eliminarProyectos($data);
            break;
          case 'bloquear':
            bloquear($data);
            break;
          case 'desbloquear':
            desbloquear($data);
            break;
          default:
            sendResponse(0, "Acción no reconocida.");
        }
        break;
      default: sendResponse(0, "Método no permitido.");
    }
  } catch (\Throwable $e) {
    error_log("Excepción global: " . $e->getMessage());
    handleException($e);
  }

  //FUNCION
  //nuevo proyecto
  function crearProyectos($data){
    
  }
?>