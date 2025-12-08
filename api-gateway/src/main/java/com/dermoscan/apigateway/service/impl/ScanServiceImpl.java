package com.dermoscan.apigateway.service.impl;

import com.dermoscan.apigateway.dto.ScanResponse;
import com.dermoscan.apigateway.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ScanServiceImpl implements ScanService {

    private final RestTemplate restTemplate;

    // URL del microservicio de IA.
    private final String IA_SERVICE_URL = 
        "http://" + 
        (System.getenv("IA_SERVICE_HOST") != null ? System.getenv("IA_SERVICE_HOST") : "localhost") + 
        ":8000/analyze";

    @Override
    public ScanResponse analyzeSkinImage(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            return restTemplate.postForObject(IA_SERVICE_URL, requestEntity, ScanResponse.class);

        } catch (IOException e) {
            throw new RuntimeException("Error al leer el archivo para enviarlo al servicio de IA", e);
        }
    }
}