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
exports.RidersController = void 0;
const common_1 = require("@nestjs/common");
const riders_service_1 = require("./riders.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RidersController = class RidersController {
    ridersService;
    constructor(ridersService) {
        this.ridersService = ridersService;
    }
    findAll() {
        return this.ridersService.findAll();
    }
    findOne(id) {
        return this.ridersService.findOne(id);
    }
    create(data) {
        return this.ridersService.create(data);
    }
    updateStatus(id, body) {
        return this.ridersService.updateStatus(id, body.status);
    }
    getAvailableOrders(req) {
        return this.ridersService.getAvailableOrders(req.user.id);
    }
    getMyActiveOrders(req) {
        return this.ridersService.getMyActiveOrders(req.user.id);
    }
    acceptOrder(req, orderId) {
        return this.ridersService.acceptOrder(req.user.id, orderId);
    }
    rejectOrder(req, orderId, body) {
        return this.ridersService.rejectOrder(req.user.id, orderId, body?.reason);
    }
    updateMyOrderStatus(req, orderId, body) {
        return this.ridersService.updateMyOrderStatus(req.user.id, orderId, body.status);
    }
};
exports.RidersController = RidersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('me/orders/available'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "getAvailableOrders", null);
__decorate([
    (0, common_1.Get)('me/orders/active'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "getMyActiveOrders", null);
__decorate([
    (0, common_1.Post)('me/orders/:orderId/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "acceptOrder", null);
__decorate([
    (0, common_1.Post)('me/orders/:orderId/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "rejectOrder", null);
__decorate([
    (0, common_1.Post)('me/orders/:orderId/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], RidersController.prototype, "updateMyOrderStatus", null);
exports.RidersController = RidersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('riders'),
    __metadata("design:paramtypes", [riders_service_1.RidersService])
], RidersController);
//# sourceMappingURL=riders.controller.js.map