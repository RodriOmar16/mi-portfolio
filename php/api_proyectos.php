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
    global $conn;

    if(!empty($data['tecnologias'])){
      sendResponse(0, "Se requiere seleccionar al menos una tecnología.");
    }
    if(!isset($data['descripcion']) || !isset($data['estado']) ||!isset($data['fechaDesdeNuevo']) ||
       !isset($data['nombre']) || !isset($data['url'])){
      sendResponse(0, "Es necesario completar los campos para poder continuar.");
    }

    $descripcion = $data['descripcion'];
    $estado      = $data['estado'];
    $nombre      = $data['nombre'];
    $url         = $data['url'];
    $fechaDesde  = $data['fechaDesdeNuevo'];
    $fechaHasta  = $data['fechaHastaNuevo'];
    $tecnologias = $data['tecnologias'];

    try {
      $conn->autocommit(false);
      //controlo que no exista ese proyecto creado
      $sqlControl  = "SELECT count(*) AS cantidad FROM proyectos WHERE nombre = ? AND descripcion = ? AND fechaDesde = ? AND fechaHasta = ? AND inhabilitada = ? AND url_fotos	= ?";
      $stmtControl = $conn->prepare($sqlControl);
      
      if(!$stmtControl){
        error_log("Prepare failed: ".$conn->error);
        sendResponse(0, "Ocurrió un error al intentar obtener los datos del proyecto.");
      }
      $stmtControl->bind_param("ssssis", $nombre, $descripcion, $fechaDesde, $fechaHasta, $estado, $url);
      $stmtControl->execute();

      $result = $stmtControl->get_result();
      if(!$result){
        throw new Exception("Error al obtener resultados: " . $conn->error);
      }
      $row = $result->fetch_assoc();
      $cantidad = intval($row['cantidad']);

      if($cantidad > 0){
        sendResponse(0, "El proyecto ya se encuentra registrado.");
      }
    } catch (\Throwable $e) {
      handleException();
    }
  }
?>