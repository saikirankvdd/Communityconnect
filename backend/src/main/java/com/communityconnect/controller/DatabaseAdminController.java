package com.communityconnect.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/database")
@CrossOrigin(origins = "*")
public class DatabaseAdminController {

    private static final Logger log = LoggerFactory.getLogger(DatabaseAdminController.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseAdminController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/tables")
    public ResponseEntity<Map<String, Object>> getTables() {
        try {
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE TABLE_SCHEMA = 'PUBLIC' ORDER BY TABLE_NAME"
            );

            List<Map<String, Object>> result = new ArrayList<>();
            long totalRows = 0;

            for (Map<String, Object> table : tables) {
                String tableName = (String) table.get("TABLE_NAME");
                try {
                    Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM \"" + tableName + "\"", Long.class);
                    totalRows += (count != null ? count : 0);

                    List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                        "SELECT COLUMN_NAME, DATA_TYPE_NAME, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS " +
                        "WHERE TABLE_SCHEMA = 'PUBLIC' AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
                        tableName
                    );

                    Map<String, Object> item = new HashMap<>();
                    item.put("name", tableName);
                    item.put("type", table.get("TABLE_TYPE"));
                    item.put("rowCount", count != null ? count : 0);
                    item.put("columns", columns);
                    result.add(item);
                } catch (Exception e) {
                    log.warn("Could not fetch details for table: {}", tableName, e);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("tables", result);
            response.put("totalTables", result.size());
            response.put("totalRows", totalRows);
            response.put("dbEngine", "H2 In-Memory (PostgreSQL Mode)");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching database tables", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tables/{tableName}")
    public ResponseEntity<Map<String, Object>> getTableData(
            @PathVariable String tableName,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        try {
            String sanitizedTable = tableName.replaceAll("[^a-zA-Z0-9_]", "");
            
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM \"" + sanitizedTable + "\" LIMIT ? OFFSET ?",
                limit, offset
            );

            Long totalCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM \"" + sanitizedTable + "\"", Long.class
            );

            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME, DATA_TYPE_NAME FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = 'PUBLIC' AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
                sanitizedTable
            );

            Map<String, Object> response = new HashMap<>();
            response.put("tableName", sanitizedTable);
            response.put("totalRows", totalCount != null ? totalCount : 0);
            response.put("columns", columns);
            response.put("rows", rows);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching data for table: {}", tableName, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> executeQuery(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query string cannot be empty"));
        }

        String trimmed = query.trim().toLowerCase();
        if (trimmed.startsWith("drop") || trimmed.startsWith("truncate") || trimmed.startsWith("alter")) {
            return ResponseEntity.badRequest().body(Map.of("error", "DDL mutations (DROP, TRUNCATE, ALTER) are restricted for safety."));
        }

        try {
            long startTime = System.currentTimeMillis();
            if (trimmed.startsWith("select") || trimmed.startsWith("show") || trimmed.startsWith("explain")) {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);
                long executionTime = System.currentTimeMillis() - startTime;

                List<String> headers = rows.isEmpty() ? Collections.emptyList() : new ArrayList<>(rows.get(0).keySet());

                Map<String, Object> response = new HashMap<>();
                response.put("headers", headers);
                response.put("rows", rows);
                response.put("rowCount", rows.size());
                response.put("executionTimeMs", executionTime);
                return ResponseEntity.ok(response);
            } else {
                int affectedRows = jdbcTemplate.update(query);
                long executionTime = System.currentTimeMillis() - startTime;

                Map<String, Object> response = new HashMap<>();
                response.put("affectedRows", affectedRows);
                response.put("executionTimeMs", executionTime);
                response.put("message", "Query executed successfully. " + affectedRows + " row(s) affected.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
