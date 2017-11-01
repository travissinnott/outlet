# outlet

A reverse-engineered WebSocket server for controlling Wifi smart outlets.  I bought a couple of these [Etekcity Wifi Smart Plug Mini Outlets](https://www.amazon.com/gp/product/B06XSTJST6) and was thrilled to discover they use a simple WebSocket command and control protocol without encryption. Overall the app they provide is not bad, but I want to control my outlets!

The idea of this project is to provide a framework for managing these outlets.


# protocol

These are observations from packet sniffing data after the initial provisioning of the outlet. 

## Boot sequence

When the outlet is plugged in, the following sequence of events happen:

1. DHCP request
2. DNS request for server2.vesync.com
3. HTTP GET http://server2.vesync.com:17273/gnws HTTP/1.1
    1. Websocket upgrade

```
GET /gnws HTTP/1.1
Host: server2.vesync.com:17273
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
deviceVersion:5

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

## initial handshake

As soon as the WebSocket connection is established, the outlet sends the JSON message below.  I have randomized the account number and device uuid:

```
{
"account":"1234567",
"id":"443c878f-f675-4c90-98e8-2f4566914d39",
"deviceName":"vesync_wifi_outlet",
"deviceVersion":"1.5",
"deviceVersionCode":5,
"type":"wifi-switch",
"apptype":"switch-measure",
"firmName":"cosytek_firm_a",
"firmVersion":"1.89",
"firmVersionCode":89,
"key":0,
"relay":"open"
}
```

The server reply:

```
{"uri":"/loginReply","error":0,"wd":3,"year":2017,"month":11,"day":1,"ms":62125134,"hh":0,"hl":0,"lh":0,"ll":0}
```

## Periodic message sent from server
```
{"uri":"/ka"}
```
Outlet acknowledges message without reply

## Periodic updates sent from the outlet to the server:
```
{
"uri":"/report",
"e":"324",
"t":"b7"
}
```
Server acknowleges message without reply

## Periodic message 2
Request from outlet:
```
{"uri":"/ka","rssi":-39}
```

Server acknowleges message then sends response:
```
{"uri":"/kr","error":0,"wd":3,"year":2017,"month":11,"day":1,"ms":62482912}
```

Three seconds later the outlet sends:
```
{
"uri":"/report",
"e":"320",
"t":"b6"
}
```
Server acknowleges message without reply.

## Another message from outlet
```
{"uri":"/ka","rssi":-38}
```

Server acknowleges message then sends reply (within 70ms):

```
{"uri":"/kr","error":0,"wd":3,"year":2017,"month":11,"day":1,"ms":62666011}
```

Outlet acknowleges message.  Then 3 seconds later sends:

```
{
"uri":"/report",
"e":"320",
"t":"b6"
}
```

Server acknowleges message.

## Other variations

```
{
"uri":"/report",
"e":"34e",
"t":"b6"
}
{
"uri":"/report",
"e":"af5",
"t":"b6"
}
{
"uri":"/report",
"e":"af9",
"t":"b6"
}
{"uri":"/ka","rssi":-46}
```

Next step: decipher the meaning and encoding of these fields.


