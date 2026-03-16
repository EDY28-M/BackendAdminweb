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
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const merchant_service_1 = require("./merchant.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MerchantController = class MerchantController {
    merchantService;
    constructor(merchantService) {
        this.merchantService = merchantService;
    }
    getOrders(req) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            return [];
        return this.merchantService.getOrdersByMerchant(merchantId);
    }
    getStores(req) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            return [];
        return this.merchantService.getStoresByMerchant(merchantId);
    }
    getCatalogCategories(req, storeId) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            return [];
        return this.merchantService.getCatalogCategories(merchantId, storeId);
    }
    getCatalogCategoriesAll(req, storeId) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            return [];
        return this.merchantService.getCatalogCategoriesAll(merchantId, storeId);
    }
    getCatalog(req, storeId) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            return [];
        return this.merchantService.getCatalogByStore(merchantId, storeId);
    }
    createCatalogCategory(req, data) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.createCatalogCategory(merchantId, data);
    }
    updateCatalogCategory(req, id, data) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.updateCatalogCategory(merchantId, id, data);
    }
    deleteCatalogCategory(req, id) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.deleteCatalogCategory(merchantId, id);
    }
    createCatalogItem(req, data) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.createCatalogItem(merchantId, data);
    }
    updateCatalogItem(req, id, data) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.updateCatalogItem(merchantId, id, data);
    }
    deleteCatalogItem(req, id) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.deleteCatalogItem(merchantId, id);
    }
    updateOrderStatus(req, id, body) {
        const merchantId = req.user?.merchant_id;
        if (!merchantId)
            throw new Error('No merchant');
        return this.merchantService.updateOrderStatus(merchantId, id, body.status);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('stores'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "getStores", null);
__decorate([
    (0, common_1.Get)('catalog/options/categories/:storeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "getCatalogCategories", null);
__decorate([
    (0, common_1.Get)('catalog/categories/list/:storeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "getCatalogCategoriesAll", null);
__decorate([
    (0, common_1.Get)('catalog/:storeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "getCatalog", null);
__decorate([
    (0, common_1.Post)('catalog/categories'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "createCatalogCategory", null);
__decorate([
    (0, common_1.Patch)('catalog/categories/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "updateCatalogCategory", null);
__decorate([
    (0, common_1.Delete)('catalog/categories/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "deleteCatalogCategory", null);
__decorate([
    (0, common_1.Post)('catalog'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "createCatalogItem", null);
__decorate([
    (0, common_1.Patch)('catalog/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "updateCatalogItem", null);
__decorate([
    (0, common_1.Delete)('catalog/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "deleteCatalogItem", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MerchantController.prototype, "updateOrderStatus", null);
exports.MerchantController = MerchantController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('merchant'),
    __metadata("design:paramtypes", [merchant_service_1.MerchantService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map