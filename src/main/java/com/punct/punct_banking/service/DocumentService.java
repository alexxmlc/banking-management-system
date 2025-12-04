package com.punct.punct_banking.service;

import java.awt.Graphics2D;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.awt.image.BufferedImage;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.apache.commons.io.FilenameUtils;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

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

    public String extractText(String fileName){

        ITesseract tesseract = new Tesseract();

        tesseract.setDatapath("tessdata");
        tesseract.setLanguage("ron+eng");

        File transformedFile = null;

        try {
            File file = new File("uploads/" + fileName);
            transformedFile = processImage(file);
            String scannedData = tesseract.doOCR(transformedFile);
            return scannedData;
        } catch (IOException | TesseractException e) {
            throw new RuntimeException("Error processing OCR document", e);
        } finally {
            if (transformedFile != null) {
                transformedFile.delete();
            }
        }
    }

    private File processImage(File originalFile) throws IOException {

        BufferedImage original = ImageIO.read(originalFile);
        BufferedImage grayImage = new BufferedImage(original.getWidth(), original.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY);

        Graphics2D g = grayImage.createGraphics();
        g.drawImage(original, 0, 0, null);
        g.dispose();

        File output = File.createTempFile("ocr_", ".jpg");
        ImageIO.write(grayImage, "jpg", output);

        return output;
    }
}
