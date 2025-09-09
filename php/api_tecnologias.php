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
      file_put_contents("debug.txt", json_encode($_GET));
      $data = $_GET;
    } else {
      $rawInput = file_get_contents("php://input");
      file_put_contents("debug.txt", $rawInput);
      $data = json_decode($rawInput, true);
    }

    file_put_contents("debug.txt", "Método: $method\nDatos: " . json_encode($data));

    switch ($method) {
      case 'GET':
        obtenerTecnologias($data);
      break;

      case 'POST':
        if (!isset($data['accion'])) {
          sendResponse(0, "Falta el parámetro 'accion'.");
        }

        switch ($data['accion']) {
          case 'crear':
            crearTecnologia($data);
            break;
          case 'actualizar':
            actualizarTecnologia($data);
            break;
          case 'eliminar':
            eliminarTecnologia($data);
            break;
          default:
            sendResponse(0, "Acción no reconocida.");
        }
      break;

      default:
        sendResponse(0, "Método no permitido.");
    }
  } catch (\Throwable $e) {
    error_log("Excepción global: " . $e->getMessage());
    handleException($e);
  }

  // Función GET
  function obtenerTecnologias($data) {
    global $conn;

    try {
      $sql    = "SELECT tecnologia_id, nombre, inhabilitada FROM tecnologias";
      $where  = [];
      $params = [];
      $types  = "";

      if (isset($data['id'])) {
        $where[]  = "tecnologia_id = ?";
        $params[] = $data['id'];
        $types   .= "i";
      }

      if (isset($data['nombre'])) {
        $where[]  = "nombre LIKE ?";
        $params[] = "%" . $data['nombre'] . "%";
        $types   .= "s";
      }

      if (isset($data['inhabilitada'])) {
        $valor = ($data['inhabilitada'] === "0") ? 0 : 1;
        $where[]  = "inhabilitada = ?";
        $params[] = intval($data['inhabilitada']);
        $types .= "i";
      }

      if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
      }

      $stmt = $conn->prepare($sql);
      if (!$stmt) {
        /*error_log("Prepare failed: " . $conn->error);
        sendResponse(0, "Error al preparar la consulta.");*/
        throw new Exception("Error en prepare: " . $conn->error);
      }

      if (!empty($params)) {
        error_log("Tipos: $types");
        error_log("Params: " . json_encode($params));

        error_log("Preparando bind_param con types: $types y params: " . json_encode($params));

        $stmt->bind_param($types, ...$params);
        error_log("Bind param ejecutado");

      }

      error_log("Ejecutando statement...");
      $stmt->execute();
      error_log("Statement ejecutado correctamente");
      /*$stmt->store_result();
      $stmt->bind_result($id, $nombre, $inhabilitada);

      $tecnos = [];
      while ($stmt->fetch()) {
        $tecnos[] = [
          'id' => $id,
          'nombre' => $nombre,
          'inhabilitada' => $inhabilitada
        ];
      }*/
      $result = $stmt->get_result();
      if (!$result) {
        throw new Exception("Error al obtener resultados: " . $conn->error);
      }

      $tecnos = [];
      while ($row = $result->fetch_assoc()) {
        $tecnos[] = $row;
      }

      sendResponse(1, "Listado obtenido", ['tecnologias' => $tecnos]);
    } catch (\Throwable $e) {
      error_log("Excepción en obtenerTecnologias: " . $e->getMessage());
      handleException($e);
    }
  }

  // Función POST: crear
  function crearTecnologia($data) {
    global $conn;

    if (!isset($data['nombre_nuevo']) || !isset($data['estado_nuevo'])) {
      sendResponse(0, "Rellene los campos obligatorios para continuar.");
    }

    $nombreTecno = $data['nombre_nuevo'];
    $estado      = $data['estado_nuevo'];

    try {
      $conn->autocommit(false);

      $sql  = "INSERT INTO tecnologias (nombre, inhabilitada) VALUES (?, ?)";
      $stmt = $conn->prepare($sql);

      if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        sendResponse(0, "Error al preparar la consulta.");
      }

      $stmt->bind_param("ss", $nombreTecno, $estado);
      $stmt->execute();

      if ($stmt->affected_rows === 1) {
        $conn->commit();
        sendResponse(1, "Se creó correctamente la Tecnología");
      } else {
        $conn->rollback();
        sendResponse(0, "No se insertó ningún registro. Revisar.");
      }
    } catch (\Exception $e) {
      $conn->rollback();
      error_log("Excepción atrapada: " . $e->getMessage());
      handleException($e);
    }
  }

  // Funciones futuras: actualizarTecnologia, eliminarTecnologia
  function actualizarTecnologia($data) {
    sendResponse(0, "Función actualizarTecnologia aún no implementada.");
  }

  function eliminarTecnologia($data) {
    sendResponse(0, "Función eliminarTecnologia aún no implementada.");
  }
?>
