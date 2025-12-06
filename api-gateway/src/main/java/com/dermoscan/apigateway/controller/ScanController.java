package com.dermoscan.apigateway.controller;

import com.dermoscan.apigateway.dto.ScanResponse;
import com.dermoscan.apigateway.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor // Inyecta automáticamente el 'scanService' en el constructor
@CrossOrigin(origins = "*") // Permite peticiones desde el Frontend (React)
public class ScanController {

    private final ScanService scanService;

    @PostMapping(value = "/scan", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> scanImage(@RequestParam("file") MultipartFile file) {
        
        // 1. Validación básica de entrada
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo no puede estar vacío.");
        }

        try {
            // 2. Delegar la lógica al servicio
            ScanResponse response = scanService.analyzeSkinImage(file);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // 3. Manejo de errores centralizado
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la imagen: " + e.getMessage());
        }
    }
}