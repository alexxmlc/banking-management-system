package com.punct.punct_banking.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.awt.image.BufferedImage;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import com.punct.punct_banking.dto.ExtractedData;

@Service
public class DocumentService {

    public String saveDocument(MultipartFile document) throws java.io.IOException {
        Path uploadPath = Paths.get("uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String originalFileName = document.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + "." + extension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(document.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    public ExtractedData extractText(String fileName) {
        ITesseract tesseract = new Tesseract();
        tesseract.setDatapath("tessdata");
        tesseract.setLanguage("ron+eng"); 
        tesseract.setPageSegMode(ITessAPI.TessPageSegMode.PSM_SINGLE_BLOCK);

        File transformedFile = null;

        try {
            File file = new File("uploads/" + fileName);
            transformedFile = processImage(file);
            String scannedData = tesseract.doOCR(transformedFile);
            
            System.out.println("--- RAW OCR DATA ---");
            System.out.println(scannedData);
            System.out.println("--------------------");

            // Parse MRZ
            ExtractedData mrzData = parseMRZ(scannedData);

            // If MRZ failed to produce a CNP , try visual regex
            String cnp = mrzData.getCnp();
            if (cnp == null) {
                cnp = parseCNPVisual(scannedData);
            }

            // Prefer MRZ names as they are cleaner
            String firstName = mrzData.getFirstName();
            String lastName = mrzData.getLastName();

            if (firstName == null) firstName = extractFieldVisual(scannedData, "Prenume|First name");
            if (lastName == null) lastName = extractFieldVisual(scannedData, "Nume|Last name");

            // Visual extraction only 
            String rawAddress = extractAddressBlock(scannedData);
            String cleanAddress = cleanAddress(rawAddress);

            return new ExtractedData(cnp, firstName, lastName, cleanAddress);

        } catch (IOException | TesseractException e) {
            throw new RuntimeException("Error processing OCR document", e);
        } finally {
            if (transformedFile != null) {
                transformedFile.delete();
            }
        }
    }

    private ExtractedData parseMRZ(String text) {
        ExtractedData data = new ExtractedData(null, null, null, null);
        String[] lines = text.split("\\r?\\n");
        
        // Scan lines to find the two MRZ lines
        String line1 = null; 
        String line2 = null; 
        
        for (String line : lines) {
            // Remove spaces to handle OCR gaps
            String cleanLine = line.trim().replace(" ", "").toUpperCase();
            
            if (cleanLine.startsWith("IDROU")) {
                line1 = cleanLine;
            } else if (line1 != null && cleanLine.length() > 20 && hasDigits(cleanLine)) {
                // If we found line 1, the next long-ish line with digits is prolly line 2
                line2 = cleanLine;
                break; // We found both
            }
        }

        if (line1 != null) {
            // --- Parse Names ---
            try {
                String namesPart = line1.substring(5); // Skip IDROU
                String[] parts = namesPart.split("<<");
                
                if (parts.length >= 2) {
                    // Replace single '<' with space to handle compound names 
                    String lastName = parts[0].replace("<", " ").trim();
                    
                    // Remove any trailing junk after the name logic 
                    String firstNamePart = parts[1];
                    // First name ends at the end of line or before a digit if OCR messed up
                    String firstName = firstNamePart.split("[\\d]")[0].replace("<", " ").trim();
                    
                    data.setFirstName(firstName);
                    data.setLastName(lastName);
                }
            } catch (Exception e) {
                System.out.println("MRZ Name parse error: " + e.getMessage());
            }
        }

        if (line2 != null) {
            
            try {  
                if (line2.length() >= 35) {
                   String dob = line2.substring(13, 19); // YYMMDD
                   String opt = line2.substring(28, 35); // 7 digits
                   
                   // Romanian CNP Construction from MRZ:
                   // CNP = [SexDigit] [YYMMDD] [Suffix]
                   
                   // Reconstruct
                   String reconstructedCNP = opt.charAt(0) + dob + opt.substring(1);
                   
                   // Validate length and digits
                   if (reconstructedCNP.length() == 13 && reconstructedCNP.matches("\\d+")) {
                       data.setCnp(reconstructedCNP);
                   }
                }
            } catch (Exception e) {
                System.out.println("MRZ CNP parse error: " + e.getMessage());
            }
        }
        
        return data;
    }
    
    private boolean hasDigits(String s) {
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) return true;
        }
        return false;
    }

    private String extractAddressBlock(String text) {
        if (text == null) return null;
        
        String regex = "(?i)(?:Domiciliu|Adresse).*?\\n([\\s\\S]*?)(?=(?:Emisa?|Valabilitate|SPCLEP|IDROU|226\\s*CJ))";
        
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private String cleanAddress(String rawAddress) {
        if (rawAddress == null) return null;
        
        String clean = rawAddress.replaceAll("[\\r\\n]+", " ");
        // Removing special chars but keeping letters, digits, and standard punctuation
        clean = clean.replaceAll("[^a-zA-Z0-9\\s\\.\\,-]", "");
        clean = clean.replaceAll("J+ud", "Jud");
        
        return clean.replaceAll("\\s+", " ").trim();
    }

    private String extractFieldVisual(String text, String labels) {
        // Fallback for names if MRZ fails
        String regex = "(?i)(?:" + labels + ").*?\\n\\s*([^\\n]+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).replaceAll("^[^a-zA-Z]+", "").trim();
        }
        return null;
    }

    private String parseCNPVisual(String text) {
        // Fallback CNP logic
        Pattern pattern = Pattern.compile("(?<!\\d)[1-8]\\d{12}(?!\\d)");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) return matcher.group();
        return null;
    }
    
    private File processImage(File originalFile) throws IOException {
        
        BufferedImage original = ImageIO.read(originalFile);
        if (original.getWidth() < original.getHeight()) {
            original = rotateImage(original, -90);
        }

        double scaleFactor = 3.5;
        int newWidth = (int) (original.getWidth() * scaleFactor);
        int newHeight = (int) (original.getHeight() * scaleFactor);
        BufferedImage scaledImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = scaledImage.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.drawImage(original, 0, 0, newWidth, newHeight, null);
        g.dispose();

        BufferedImage binaryImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_BYTE_BINARY);
        int threshold = 170; 

        for (int x = 0; x < newWidth; x++) {
            for (int y = 0; y < newHeight; y++) {
                int pixel = scaledImage.getRGB(x, y);
                Color color = new Color(pixel);
                int brightness = (color.getRed() + color.getGreen() + color.getBlue()) / 3;
                binaryImage.setRGB(x, y, brightness > threshold ? Color.WHITE.getRGB() : Color.BLACK.getRGB());
            }
        }
        
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

        File output = File.createTempFile("ocr_", ".jpg");
        ImageIO.write(paddedImage, "jpg", output);
        return output;
    }

    private BufferedImage rotateImage(BufferedImage img, double angle) {

        double rads = Math.toRadians(angle);
        int w = img.getHeight();
        int h = img.getWidth();
        BufferedImage rotated = new BufferedImage(w, h, img.getType());
        Graphics2D g2d = rotated.createGraphics();

        g2d.translate((w - img.getWidth()) / 2, (h - img.getHeight()) / 2);
        g2d.rotate(rads, img.getWidth() / 2, img.getHeight() / 2);
        g2d.drawRenderedImage(img, null);
        g2d.dispose();
        return rotated;
    }
}