package com.dermoscan.apigateway.service;

import com.dermoscan.apigateway.dto.ScanResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ScanService {
    // Definimos qué debe hacer el servicio, pero no cómo.
    ScanResponse analyzeSkinImage(MultipartFile file);
}