package com.punct.punct_banking.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.apache.commons.io.FilenameUtils;

@Service
public class DocumentService {

    public String saveDocument(MultipartFile document) throws java.io.IOException {

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Get the file extension
        String originalFileName = document.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFileName);

        // Generate and UUID to save the file with this UUID as name
        String fileName = UUID.randomUUID().toString() + "." + extension;

        // Save the file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(document.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
