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
  } catch (\Exception $e) {
    error_log("Excepción global: " . $e->getMessage());
    handleException($e);
  }

  //FUNCION
  //obtener proyectos
  function obtenerProyectos($data){
    global $conn;

    try {
      $sql    = 
      "SELECT
        p.proyecto_id, p.nombre as nombre_proyecto, p.descripcion, p.fechaDesde, p.fechaHasta, p.inhabilitada,
        p.url_fotos, t.tecnologia_id, t.nombre as nombre_tecnologia
      FROM proyectos p
      INNER JOIN proyectos_tecnologia pt ON p.proyecto_id = pt.proyecto_id
      INNER JOIN tecnologias t ON pt.tecnologia_id = t.tecnologia_id";
      $where  = [];
      $params = [];
      $types  = "";

      $where[] = "t.inhabilitada = 0";

      if (isset($data['proyecto_id'])) {
        $where[]  = "p.proyecto_id = ?";
        $params[] = $data['proyecto_id'];
        $types   .= "i";
      }

      if (isset($data['tecnologia_id'])) {
        $where[]  = "t.tecnologia_id = ?";
        $params[] = $data['tecnologia_id'];
        $types   .= "i";
      }

      if (isset($data['nombre'])) {
        $where[]  = "p.nombre LIKE ?";
        $params[] = "%" . $data['nombre'] . "%";
        $types   .= "s";
      }

      if (isset($data['inhabilitada'])) {
        $valor = ($data['inhabilitada'] === "0") ? 0 : 1;
        $where[]  = "p.inhabilitada = ?";
        $params[] = intval($data['inhabilitada']);
        $types .= "i";
      }

      if (isset($data['fecha_desde']) && !isset($data['fecha_hasta'])) {
        $where[]  = "p.fechaDesde = ?";
        $params[] = $data['fecha_desde'];
        $types   .= "s";
      }

      if (isset($data['fecha_desde']) && isset($data['fecha_hasta'])) {
        $where[]  = "p.fechaDesde <= ?";
        $params[] = $data['fecha_desde'];
        $types   .= "s";

        $where[]  = "p.fechaHasta >= ?";
        $params[] = $data['fecha_hasta'];
        $types   .= "s";
      }

      if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
      }

      $stmt = $conn->prepare($sql);
      if (!$stmt) {
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

      $result = $stmt->get_result();
      if (!$result) {
        throw new Exception("Error al obtener resultados: " . $conn->error);
      }

      /*$tecnos = [];
      while ($row = $result->fetch_assoc()) {
        $tecnos[] = $row;
      }

      sendResponse(1, "Listado obtenido", ['proyectos' => $tecnos]);*/
      $proyectos = [];
      while ($row = $result->fetch_assoc()) {
        $id = $row['proyecto_id'];

        if (!isset($proyectos[$id])) {
          $proyectos[$id] = [
            'proyecto_id'   => $row['proyecto_id'],
            'nombre'        => $row['nombre_proyecto'],
            'descripcion'   => $row['descripcion'],
            'fecha_desde'    => $row['fechaDesde'],
            'fecha_hasta'    => $row['fechaHasta'],
            'inhabilitada'  => $row['inhabilitada'],
            'url_fotos'     => $row['url_fotos'],
            'tecnologias'   => []
          ];
        }

        $proyectos[$id]['tecnologias'][] = [
          'tecnologia_id' => $row['tecnologia_id'],
          'nombre'        => $row['nombre_tecnologia'] // cuidado: este es el nombre de la tecnología
        ];
      }

      // Reindexar para enviar como array plano
      sendResponse(1, "Listado obtenido", ['proyectos' => array_values($proyectos)]);

    } catch (\Throwable $e) {
      error_log("Excepción en obtenerProyectos: " . $e->getMessage());
      handleException($e);
    }
  }

  //nuevo proyecto
  function crearProyectos($data){
    global $conn;

    if (empty($data['tecnologias']) || count($data['tecnologias']) === 0) {
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
      $sqlControl  = "SELECT count(*) AS cantidad FROM proyectos WHERE nombre = ? AND descripcion = ? AND fechaDesde = ? AND fechaHasta = ? AND inhabilitada = ? AND url_fotos = ?";
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

      //proceso de crear
      $sql  = "INSERT INTO proyectos(nombre, descripcion, fechaDesde, fechaHasta, inhabilitada, url_fotos) VALUES (?,?,?,?,?,?)";
      $stmt = $conn->prepare($sql);
      if(!$stmt){
        error_log("Prepare failed: ".$conn->error);
        sendResponse(0, "Error al preparar la consulta para insertar proyectos.");
      }
      $stmt->bind_param("ssssis", $nombre, $descripcion, $fechaDesde, $fechaHasta, $estado, $url);
      $stmt->execute();
      if ($stmt->affected_rows === 1) {
        $nuevoId = $stmt->insert_id;
        
        //agregar en proyectos_tecnologia
        $valores = [];
        foreach ($tecnologias as $tecnoId) {
          $valores[] = "($nuevoId, $tecnoId)";
        }

        $sqlTecno = "INSERT INTO proyectos_tecnologia(proyecto_id, tecnologia_id) VALUES " . implode(", ", $valores);
        $result = $conn->query($sqlTecno);

        if (!$result) {
          $conn->rollback();
          sendResponse(0, "Error al insertar tecnologías: " . $conn->error);
        }

        $conn->commit(); 
        sendResponse(1, "Se creó correctamente la Tecnología", ["id"=>$nuevoId]);
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

  //bloquear
  function bloquear($data){
    global $conn;
  }
  //desbloquear
  function desbloquear($data){
    global $conn;
  }
?>