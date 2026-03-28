"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let StreamingGateway = class StreamingGateway {
    server;
    logger = new common_1.Logger('StreamingGateway');
    handleConnection(client) {
        this.logger.log(`Client connected for streaming events: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handlePlayTrack(data) {
        this.logger.log(`User ${data.userId} started playing track ${data.trackId}`);
        this.server.emit('trackStatsUpdated', {
            trackId: data.trackId,
            event: 'PLAY',
            timestamp: new Date().toISOString(),
        });
        return { event: 'playing', data: data.trackId };
    }
};
exports.StreamingGateway = StreamingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StreamingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('playTrack'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StreamingGateway.prototype, "handlePlayTrack", null);
exports.StreamingGateway = StreamingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], StreamingGateway);
//# sourceMappingURL=streaming.gateway.js.map