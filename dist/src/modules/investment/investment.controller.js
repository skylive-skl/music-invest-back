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
exports.InvestmentController = void 0;
const common_1 = require("@nestjs/common");
const investment_service_1 = require("./investment.service");
const create_investment_dto_1 = require("./dto/create-investment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let InvestmentController = class InvestmentController {
    investmentService;
    constructor(investmentService) {
        this.investmentService = investmentService;
    }
    async invest(req, createInvestmentDto) {
        return this.investmentService.invest(req.user.id, createInvestmentDto);
    }
    async getMyInvestments(req) {
        return this.investmentService.findUserInvestments(req.user.id);
    }
};
exports.InvestmentController = InvestmentController;
__decorate([
    (0, roles_decorator_1.Roles)('USER', 'ARTIST', 'ADMIN'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_investment_dto_1.CreateInvestmentDto]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "invest", null);
__decorate([
    (0, common_1.Get)('my-investments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentController.prototype, "getMyInvestments", null);
exports.InvestmentController = InvestmentController = __decorate([
    (0, common_1.Controller)('investments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [investment_service_1.InvestmentService])
], InvestmentController);
//# sourceMappingURL=investment.controller.js.map