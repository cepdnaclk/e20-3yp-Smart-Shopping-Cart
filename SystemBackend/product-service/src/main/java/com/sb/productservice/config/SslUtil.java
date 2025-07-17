//package com.sb.productservice.config;
//
//import org.bouncycastle.openssl.PEMKeyPair;
//import org.bouncycastle.openssl.PEMParser;
//import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
//
//import javax.net.ssl.*;
//import java.io.*;
//import java.security.*;
//import java.security.cert.CertificateFactory;
//import java.security.cert.X509Certificate;
//
//public class SslUtil {
//
//    public static SSLSocketFactory getSocketFactory(
//            InputStream caCrtStream,
//            InputStream crtStream,
//            InputStream keyStream
//    ) throws Exception {
//
//        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
//
//        // Load CA cert
//        CertificateFactory cf = CertificateFactory.getInstance("X.509");
//        X509Certificate caCert = (X509Certificate) cf.generateCertificate(caCrtStream);
//
//        // Load client cert
//        X509Certificate clientCert = (X509Certificate) cf.generateCertificate(crtStream);
//
//        // Load private key
//        PEMParser pemParser = new PEMParser(new InputStreamReader(keyStream));
//        Object object = pemParser.readObject();
//        pemParser.close();
//        PEMKeyPair pemKeyPair = (PEMKeyPair) object;
//        PrivateKey privateKey = new JcaPEMKeyConverter()
//                .setProvider("BC")
//                .getPrivateKey(pemKeyPair.getPrivateKeyInfo());
//
//        // KeyStore
//        KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
//        ks.load(null, null);
//        ks.setCertificateEntry("ca-cert", caCert);
//        ks.setCertificateEntry("client-cert", clientCert);
//        ks.setKeyEntry("private-key", privateKey, "".toCharArray(), new java.security.cert.Certificate[]{clientCert});
//
//        // TrustManager
//        TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
//        tmf.init(ks);
//
//        // KeyManager
//        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
//        kmf.init(ks, "".toCharArray());
//
//        SSLContext context = SSLContext.getInstance("TLSv1.2");
//        context.init(kmf.getKeyManagers(), tmf.getTrustManagers(), new SecureRandom());
//
//        return context.getSocketFactory();
//    }
//
//}
