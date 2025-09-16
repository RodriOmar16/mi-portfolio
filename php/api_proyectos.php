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
      $sql = 
      "SELECT
        p.proyecto_id, 
        p.nombre as nombre_proyecto, 
        p.descripcion, 
        p.fechaDesde, 
        p.fechaHasta, 
        p.inhabilitada,
        p.url_fotos, 
        t.tecnologia_id, 
        t.nombre as nombre_tecnologia
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

      if (isset($data['tecnologia'])) {
        $where[]  = "t.tecnologia_id = ?";
        $params[] = $data['tecnologia'];
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

      if (!isset($data['fecha_desde']) && isset($data['fecha_hasta'])) {
        $where[]  = "p.fechaHasta = ?";
        $params[] = $data['fecha_hasta'];
        $types   .= "s";
      }

      if (isset($data['fecha_desde']) && isset($data['fecha_hasta'])) {
        $where[]  = "p.fechaDesde >= ?";
        $params[] = $data['fecha_desde'];
        $types   .= "s";

        $where[]  = "p.fechaHasta <= ?";
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
      sendResponse(1, "Listado de proyectos", ['proyectos' => array_values($proyectos)]);

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

    if (strtotime($fechaDesde) >= strtotime($fechaHasta)) {
      sendResponse(0, "La fecha de inicio debe ser estrictamente menor que la fecha de finalización.");
    }

    try {
      $conn->autocommit(false);
      //controlo que no exista ese proyecto creado
      $sqlControl  = "SELECT count(*) AS cantidad FROM proyectos WHERE nombre = ? AND descripcion = ? AND fechaDesde = ? AND fechaHasta = ? AND inhabilitada = ? AND url_fotos = ?";
      $stmtControl = $conn->prepare($sqlControl);
      
      if(!$stmtControl){
        error_log("Prepare failed: ".$conn->error);
        sendResponse(0, "Ocurrió un error al intentar controlar si ya existe el proyecto: ".$conn->error);
      }
      $stmtControl->bind_param("ssssis", $nombre, $descripcion, $fechaDesde, $fechaHasta, $estado, $url);
      $stmtControl->execute();

      $result = $stmtControl->get_result();
      if(!$result){
        throw new Exception("Error al obtener resultados: " . $conn->error);
        sendResponse(0, "Ocurrió un error al obtener resultados del control al crear: ".$conn->error);
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
        sendResponse(0, "Error al preparar la consulta para insertar proyectos: ".$conn->error);
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
    if(!isset($data['id'])){
      sendResponse(0, "No llegó el id del proyecto.");
    }

    $id = $data['id'];

    try {
      $conn->autocommit(false);
      //controlo que no este inhabilitada ya
      $sql  = "SELECT count(*) as cantidad FROM proyectos p WHERE p.inhabilitada = 1 AND p.proyecto_id = ?";
      $stmt = $conn->prepare($sql);
      if(!$stmt){
        throw new Exception("Error en prepare: " . $conn->error);
        sendResponse(0, "Error en el prepare del control de bloqueo: ", $conn->error);
      }

      $stmt->bind_param("i", $id);
      $stmt->execute();

      $result = $stmt->get_result();
      if(!$result){
        throw new Exception("Error al obtener resultados: " . $conn->error);
        sendResponse(0, "Error al obtener los resultados del control de bloqueo: ".$conn->error);
      }

      $row = $result->fetch_assoc();
      $cantidad = intval($row['cantidad']);
      if($cantidad > 0){
        sendResponse(0, "El proyecto ya se encuentra en estado inhabilitado.");
      }

      //Se procede a bloquear
      $sqlBloq  = "UPDATE proyectos SET inhabilitada = 1 WHERE proyecto_id = ?";
      $stmtBloq = $conn->prepare($sqlBloq);

      if (!$stmtBloq) {
        throw new Exception("Error en prepare: " . $conn->error);
        sendResponse(0, "Al momento de intentar armar la consulta para bloquear el proyecto ocurrió un error: ".$conn->error);
      }

      $stmtBloq->bind_param("i", $id);
      $stmtBloq->execute();

      if($stmtBloq->affected_rows === 1){
        $conn->commit();
        sendResponse(1, "Proyecto bloqueado con éxito.");
      }else{
        $conn->rollback();
        sendResponse(0, "No fue posible bloquear el proyecto. Revisar.");
      }
    } catch (\Throwable $e) { 
      $conn->rollback();
      error_log("Excepción en bloquear: " . $e->getMessage());
      handleException($e);
    }
  }

  //desbloquear
  function desbloquear($data){
    global $conn;
    if(!isset($data['id'])){
      sendResponse(0, "No llegó el id del proyecto.");
    }

    $id = $data['id'];

    try {
      $conn->autocommit(false);
      //controlo que no este inhabilitada ya
      $sql  = "SELECT count(*) as cantidad FROM proyectos p WHERE p.inhabilitada = 0 AND p.proyecto_id = ?";
      $stmt = $conn->prepare($sql);
      if(!$stmt){
        throw new Exception("Error en prepare: " . $conn->error);
        sendResponse(0, "Error en el prepare del control de desbloqueo: ", $conn->error);
      }

      $stmt->bind_param("i", $id);
      $stmt->execute();

      $result = $stmt->get_result();
      if(!$result){
        throw new Exception("Error al obtener resultados: " . $conn->error);
        sendResponse(0, "Error al obtener los resultados del control de desbloqueo: ".$conn->error);
      }

      $row = $result->fetch_assoc();
      $cantidad = intval($row['cantidad']);
      if($cantidad > 0){
        sendResponse(0, "El proyecto ya se encuentra en estado habilitado.");
      }

      //Se procede a bloquear
      $sqlDesbloq  = "UPDATE proyectos SET inhabilitada = 0 WHERE proyecto_id = ?";
      $stmtDesbloq = $conn->prepare($sqlDesbloq);

      if (!$stmtDesbloq) {
        throw new Exception("Error en prepare: " . $conn->error);
        sendResponse(0, "Al momento de intentar armar la consulta para desbloquear el proyecto ocurrió un error: ".$conn->error);
      }

      $stmtDesbloq->bind_param("i", $id);
      $stmtDesbloq->execute();

      if($stmtDesbloq->affected_rows === 1){
        $conn->commit();
        sendResponse(1, "Proyecto desbloqueado con éxito.");
      }else{
        $conn->rollback();
        sendResponse(0, "No fue posible desbloquear el proyecto. Revisar.");
      }
    } catch (\Throwable $e) { 
      $conn->rollback();
      error_log("Excepción en desbloquear: " . $e->getMessage());
      handleException($e);
    }
  }

  //actualizar
  function actualizarProyectos($data){
    global $conn;
    
    if (empty($data['tecnologias']) || count($data['tecnologias']) === 0) {
      sendResponse(0, "Se requiere seleccionar al menos una tecnología.");
    }

    if(!isset($data['descripcion']) || !isset($data['inhabilitada']) || !isset($data['fecha_desde']) ||
       !isset($data['nombre']) || !isset($data['url_fotos'])){
      sendResponse(0, "Es necesario completar los campos para poder continuar.");
    }

    $id          = $data['proyecto_id'];
    $descripcion = $data['descripcion'];
    $estado      = $data['inhabilitada'];
    $nombre      = $data['nombre'];
    $url         = $data['url_fotos'];
    $fechaDesde  = $data['fecha_desde'];
    $fechaHasta  = $data['fecha_hasta'];
    $tecnologias = $data['tecnologias'];

    if (!empty($data['fecha_hasta']) && strtotime($data['fecha_hasta']) !== false) {
      if (strtotime($data['fecha_hasta']) <= strtotime($data['fecha_desde'])) {
        sendResponse(0, "La fecha de finalización debe ser posterior a la fecha de inicio.");
      }
    }


    try {
      $conn->autocommit(false);
      //controlo que no exista ese proyecto creado
      $sqlControl  = 
      "SELECT count(*) AS cantidad 
       FROM proyectos 
       WHERE proyecto_id  = ?
         AND nombre       = ? 
         AND descripcion  = ? 
         AND fechaDesde   = ? 
         AND fechaHasta   = ? 
         AND inhabilitada = ? 
         AND url_fotos    = ?";
      $stmtControl = $conn->prepare($sqlControl);
      
      if(!$stmtControl){
        error_log("Prepare failed: ".$conn->error);
        sendResponse(0, "Ocurrió un error al intentar controlar si ya existe el proyecto: ".$conn->error);
      }
      $stmtControl->bind_param("issssis", $id, $nombre, $descripcion, $fechaDesde, $fechaHasta, $estado, $url);
      $stmtControl->execute();

      $result = $stmtControl->get_result();
      if(!$result){
        throw new Exception("Error al obtener resultados: " . $conn->error);
        sendResponse(0, "Ocurrió un error al obtener resultados del control al actualizar: ".$conn->error);
      }
      $row = $result->fetch_assoc();
      $cantidad = intval($row['cantidad']);

      if($cantidad > 0){
        sendResponse(0, "El proyecto ya tiene los cambios que deseas grabar.");
      }
      
      //proceso de actualizar el proyecto
      $sql  = 
      "UPDATE proyectos
       SET nombre       = ?, 
           descripcion  = ?, 
           fechaDesde   = ?, 
           fechaHasta   = ?, 
           inhabilitada = ?,  
           url_fotos    = ?
       WHERE proyecto_id = ?";
      $stmt = $conn->prepare($sql);
      if(!$stmt){
        error_log("Prepare failed: ".$conn->error);
        sendResponse(0, "Error al preparar la consulta para modificar proyecto: ".$conn->error);
      }
      $stmt->bind_param("ssssisi", $nombre, $descripcion, $fechaDesde, $fechaHasta, $estado, $url, $id);
      $stmt->execute();

      $todoOk = true;
      if ($stmt->affected_rows === 1) {
        //obtengo las tecnologias que hay en la base ahora
        $sqlActuales  = "SELECT tecnologia_id FROM proyectos_tecnologia WHERE proyecto_id = ?";
        $stmtActuales = $conn->prepare($sqlActuales);
        $stmtActuales->bind_param("i", $id);
        $stmtActuales->execute();
        $resultActuales = $stmtActuales->get_result();

        $tecnologiasActuales = [];
        while ($row = $resultActuales->fetch_assoc()) {
          $tecnologiasActuales[] = intval($row['tecnologia_id']);
        }

        //determino la diferencia entre los array
        $tecnologiasNuevas   = array_diff($tecnologias, $tecnologiasActuales);
        $tecnologiasEliminar = array_diff($tecnologiasActuales, $tecnologias);

        //inserto los tecnologia_id que vengan a la tabla proyectos_tecnologia
        if (!empty($tecnologiasNuevas)) {
          $valoresInsert = [];
          foreach ($tecnologiasNuevas as $tecnoId) {
            $valoresInsert[] = "($id, $tecnoId)";
          }
          $sqlInsert = "INSERT INTO proyectos_tecnologia(proyecto_id, tecnologia_id) VALUES " . implode(", ", $valoresInsert);
          if (!$conn->query($sqlInsert)) {
            $todoOk = false;
            throw new Exception("Error al insertar tecnologías nuevas: " . $conn->error);
            sendResponse(0, "Error en la insersión masiva de tecnologias.");
          }
        }

        //borro los registros de proyectos_tecnologia que no tengan el tecnologia_id que no vinieron
        if (!empty($tecnologiasEliminar)) {
          $placeholders = implode(",", array_fill(0, count($tecnologiasEliminar), "?"));
          $sqlDelete    = "DELETE FROM proyectos_tecnologia WHERE proyecto_id = ? AND tecnologia_id IN ($placeholders)";
          $stmtDelete   = $conn->prepare($sqlDelete);
          if (!$stmtDelete) {
            error_log("Error al preparar DELETE: " . $conn->error);
            sendResponse(0, "Error al preparar DELETE: " . $conn->error);
            $todoOk = false;
          } else {
            $typesDelete  = str_repeat("i", count($tecnologiasEliminar) + 1);
            $paramsDelete = array_merge([$id], $tecnologiasEliminar);
            $stmtDelete->bind_param($typesDelete, ...$paramsDelete);
            if (!$stmtDelete->execute()) {
              error_log("Error al ejecutar DELETE: " . $stmtDelete->error);
              sendResponse(0, "Error al ejecutar DELETE: " . $stmtDelete->error);
              $todoOk = false;
            }
          }
        }

        if ($todoOk) {
          $conn->commit();
          sendResponse(1, "Se modificó correctamente el proyecto", ["id" => $id]);
        } else {
          $conn->rollback();
          sendResponse(0, "Ocurrió un error al sincronizar las tecnologías.");
        }
      } else {
        $conn->rollback();
        sendResponse(0, "No se modificó ningún registro. Revisar.");
      }
    } catch (\Exception $e) {
      $conn->rollback();
      error_log("Excepción atrapada: " . $e->getMessage());
      handleException($e);
    }
  }

?>