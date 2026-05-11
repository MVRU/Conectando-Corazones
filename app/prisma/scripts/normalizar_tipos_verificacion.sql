-- Paso 1: verificar duplicados (usuario_id, tipo) antes de crear el índice único.
-- Si esta consulta devuelve filas, hay que decidir cuáles conservar antes de continuar.
SELECT usuario_id, tipo, COUNT(*) AS cantidad
FROM verificaciones
GROUP BY usuario_id, tipo
HAVING COUNT(*) > 1;

-- Paso 2: normalizar registros legacy (tipo 'documental' → 'institucional').
-- En producción es probable que no haya ninguno, pero cubre el caso por si acaso.
UPDATE verificaciones
SET tipo = 'institucional'
WHERE tipo = 'documental';
