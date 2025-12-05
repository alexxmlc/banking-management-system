package com.punct.punct_banking.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.apache.commons.io.FilenameUtils;

import net.sourceforge.tess4j.ITessAPI;
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

    public String extractText(String fileName) {

        ITesseract tesseract = new Tesseract();

        tesseract.setDatapath("tessdata");
        tesseract.setLanguage("ron+eng");
        tesseract.setPageSegMode(ITessAPI.TessPageSegMode.PSM_SINGLE_BLOCK);

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

        // Rotate if needed
        if (original.getWidth() < original.getHeight()) {
            original = rotateImage(original, -90);
        }

        // Crop: Left 45% (removes photo)
        int cropX = (int) (original.getWidth() * 0.45);
        int cropWidth = original.getWidth() - cropX;
        BufferedImage cropped = original.getSubimage(cropX, 0, cropWidth, original.getHeight());

        // Scale: 3.5x for clarity
        double scaleFactor = 3.5;
        int newWidth = (int) (cropped.getWidth() * scaleFactor);
        int newHeight = (int) (cropped.getHeight() * scaleFactor);
        BufferedImage scaledImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = scaledImage.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.drawImage(cropped, 0, 0, newWidth, newHeight, null);
        g.dispose();

        g.drawImage(cropped, 0, 0, newWidth, newHeight, null);
        g.dispose();

        // Binarize: Threshold 180 (Essential for CNP visibility)
        BufferedImage binaryImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_BYTE_BINARY);
        int threshold = 180;

        for (int x = 0; x < newWidth; x++) {
            for (int y = 0; y < newHeight; y++) {
                int pixel = scaledImage.getRGB(x, y);
                Color color = new Color(pixel);
                int brightness = (color.getRed() + color.getGreen() + color.getBlue()) / 3;

                if (brightness > threshold) {
                    binaryImage.setRGB(x, y, Color.WHITE.getRGB());
                } else {
                    binaryImage.setRGB(x, y, Color.BLACK.getRGB());
                }
            }
        }

        // Erase artifacts
        // Paint a 15px wide white vertical strip on the left edge
        // This physically overwrites the black crop line that Tesseract was misreading as a letter
        Graphics2D gClean = binaryImage.createGraphics();
        gClean.setColor(Color.WHITE);
        gClean.fillRect(0, 0, 15, newHeight); 
        gClean.dispose();

        // Add padding (Breathing room for Tesseract)
        int padding = 50;
        BufferedImage paddedImage = new BufferedImage(
                binaryImage.getWidth() + (padding * 2),
                binaryImage.getHeight() + (padding * 2),
                BufferedImage.TYPE_BYTE_BINARY);

        Graphics2D gPad = paddedImage.createGraphics();
        gPad.setColor(Color.WHITE);
        gPad.fillRect(0, 0, paddedImage.getWidth(), paddedImage.getHeight());
        gPad.drawImage(binaryImage, padding, padding, null);
        gPad.dispose();

        ImageIO.write(paddedImage, "jpg", new File("uploads/debug_processed.jpg"));

        File output = File.createTempFile("ocr_", ".jpg");
        ImageIO.write(paddedImage, "jpg", output);

        return output;
    }

    private BufferedImage rotateImage(BufferedImage img, double angle) {

        double rads = Math.toRadians(angle);
        int w = img.getHeight();
        int h = img.getWidth();

        // Create the canvas for the new image
        BufferedImage rotated = new BufferedImage(w, h, img.getType());
        Graphics2D g2d = rotated.createGraphics();

        // Rotation around center
        AffineTransform at = new AffineTransform();
        at.rotate(rads, w / 2.0, h / 2.0);

        // Apply the transformation
        g2d.setTransform(at);
        g2d.drawImage(img, 0, 0, null);
        g2d.dispose();

        return rotated;
    }
}
