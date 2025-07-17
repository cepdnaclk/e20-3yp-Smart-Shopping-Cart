package com.sb.billservice.model;

public enum BillStatus {

    /**
     * The bill is in the process of being generated.
     */
    IN_PROGRESS,

    /**
     * The bill has been generated and is ready for payment.
     */
    READY,

    /**
     * The bill has been paid.
     */
    PAID,

    /**
     * The bill has been cancelled.
     */
    CANCELLED

}
