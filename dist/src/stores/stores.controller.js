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
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const stores_service_1 = require("./stores.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const client_1 = require("@prisma/client");
let StoresController = class StoresController {
    storesService;
    constructor(storesService) {
        this.storesService = storesService;
    }
    findAll() {
        return this.storesService.findAll();
    }
    getMerchants() {
        return this.storesService.getMerchants();
    }
    getCategories() {
        return this.storesService.getCategories();
    }
    findOne(id) {
        return this.storesService.findOne(id);
    }
    update(id, updateData) {
        return this.storesService.update(id, updateData);
    }
    create(createData) {
        return this.storesService.create(createData);
    }
    createCategory(data) {
        return this.storesService.createCategory(data);
    }
    createMerchant(data) {
        return this.storesService.createMerchant(data);
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('options/merchants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "getMerchants", null);
__decorate([
    (0, common_1.Get)('options/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Post)('merchants'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "createMerchant", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
//# sourceMappingURL=stores.controller.js.map