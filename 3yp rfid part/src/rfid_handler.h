#ifndef RFID_HANDLER_H
#define RFID_HANDLER_H

#include <MFRC522.h>    // ← Required to use MFRC522
extern MFRC522 mfrc522; // ← Declare external reference to RFID reader

void initRFID();
void initBuzzer();
void checkRFIDTag();
void buzzBuzzer();

#endif // RFID_HANDLER_H
