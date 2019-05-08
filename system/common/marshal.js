/* TODO
Translate from MQTT string-only message to a native data type following these rules:
string  - topic includes "/text" 
boolean - message is "true" or "false"
boolean - message is 1 or 0 AND topic includes "/on"
number  - message parses as integer
string  - default
*/