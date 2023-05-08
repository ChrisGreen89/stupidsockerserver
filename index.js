const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
});
console.log(`Listening on 8080`)

wss.on('connection', function connection(ws, request, client) {
    console.log("Connection")
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        var rpcBody = JSON.parse(data);
        console.log(rpcBody);
        if (rpcBody && rpcBody.Message && rpcBody.Message.toLowerCase() === 'ping') {
            var response = new RpcMessage();
            response.Message = "pong"
            ws.send(JSON.stringify(response))
        }
        else if (rpcBody && rpcBody.Message && rpcBody.Message.toLowerCase() === 'checkin') {
            var response = new RpcMessage();
            response.Message = 'checkinresponse'
            console.log('sending check in response')
            ws.send(JSON.stringify(response))
        }
        else {
            console.log(`Received message ${data}`);
        }
    });

});

class RpcMessage {
    Message = ''
    Params = {}
    Id = ''
}