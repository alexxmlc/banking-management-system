package com.punct.punct_banking.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.punct.punct_banking.service.DocumentService;

import net.sourceforge.tess4j.TesseractException;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @PostMapping("/upload")

    public ResponseEntity<?> getUploadedDocument(@RequestPart MultipartFile document) {

        String fileName;
        String dataFromDocument;

        try {
            fileName = documentService.saveDocument(document);
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload the file");
        }
        try {
            dataFromDocument = documentService.extractText(fileName);
        } catch (TesseractException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to read data from document");
        }
        return ResponseEntity.ok(dataFromDocument);
    }
}
