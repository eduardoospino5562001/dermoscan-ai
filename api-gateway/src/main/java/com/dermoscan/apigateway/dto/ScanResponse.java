package com.dermoscan.apigateway.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
public class ScanResponse {
    private String filename;
    private List<Prediction> predictions;

    // Clase interna estática para definir la estructura de una predicción
    @Data
    @AllArgsConstructor
    public static class Prediction {
        private String label;
        private double probability;
    }
}