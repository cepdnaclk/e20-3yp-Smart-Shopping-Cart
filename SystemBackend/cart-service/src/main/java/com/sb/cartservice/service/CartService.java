package com.sb.cartservice.service;

import com.sb.cartservice.dto.CartDTO;
import com.sb.cartservice.dto.UserCartSummaryDTO;
import com.sb.productservice.grpc.ProductDetailsResponse;

import java.util.List;

public interface CartService {

    List<CartDTO> getAllItems();

    List<CartDTO> getItemsByUserId(String userId);

    CartDTO addItems(CartDTO item);

    CartDTO updateItems(CartDTO item);

    void deleteItems(Long id);

    CartDTO getItemById(Long id);

    String getUserCartSummaryAndSendToGrpc(String userId);

    ProductDetailsResponse fetchProductDetailsForFrontend(String barcode);

}
