package com.sb.productservice.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    String uploadImage(String folder, String filename, MultipartFile file);

    String overwriteImage(String folder, String filename, MultipartFile file);

    void deleteImage(String folder, String filename);

    byte[] getImage(String folder, String filename);

}
