package com.sb.productservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;

@Service
public class S3ServiceImpl implements S3Service{

    private final S3Client s3Client;

    Logger log = LoggerFactory.getLogger(S3ServiceImpl.class);

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Value("${aws.s3.bucket.region}")
    private String region;

    public S3ServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadImage(String folder, String filename, MultipartFile file) {
        String key = folder + "/" + filename;
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            log.info("✅ Uploaded image: {}", key);
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;

        } catch (IOException e) {
            log.error("❌ Failed to upload image", e);
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public String overwriteImage(String folder, String filename, MultipartFile file) {
        // Since S3 automatically overwrites by key, same as upload
        return uploadImage(folder, filename, file);
    }

    @Override
    public void deleteImage(String folder, String filename) {
        String key = folder + "/" + filename;
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(request);
            log.info("🗑️ Deleted image: {}", key);
        } catch (S3Exception e) {
            log.error("❌ Failed to delete image", e);
            throw new RuntimeException("Image deletion failed");
        }
    }

    @Override
    public byte[] getImage(String folder, String filename) {
        String key = folder + "/" + filename;
        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
            log.info("📥 Fetched image: {}", key);
            return objectBytes.asByteArray();
        } catch (S3Exception e) {
            log.error("❌ Failed to fetch image", e);
            throw new RuntimeException("Image fetch failed");
        }
    }

}
