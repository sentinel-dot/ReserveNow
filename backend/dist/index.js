"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const fs_1 = __importDefault(require("fs"));
const socketPath = '/var/run/backend/backend.sock';
// Remove the socket file if it already exists
if (fs_1.default.existsSync(socketPath)) {
    fs_1.default.unlinkSync(socketPath);
}
// Create the server
const server = (0, net_1.createServer)((socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = data.toString().trim();
            console.log(`Received request: ${request}`);
            // Extract the parameter from the request
            const [parameter] = request.split(' ');
            if (!['hand', 'einschr', 'einschr_einw'].includes(parameter)) {
                throw new Error('Invalid parameter');
            }
            let message = "";
            switch (parameter) {
                case 'hand':
                    message = "shake";
                    break;
                case 'einschr':
                    break;
                case 'einschr_einw':
                    break;
                default:
                    throw new Error('Invalid parameter');
            }
            // Send the barcode image buffer to the client
            socket.write(message);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            socket.write(`Error: ${errorMessage}`);
        }
    }));
    socket.on('end', () => {
        console.log('Client disconnected');
    });
}));
// Start the server on the UNIX socket
server.listen(socketPath, () => {
    console.log(`Server running at ${socketPath}`);
});
