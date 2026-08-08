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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentMethodDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const payment_method_entity_1 = require("../entities/payment-method.entity");
class CreatePaymentMethodDto {
    type;
    bankName;
    accountNumber;
    accountHolderName;
    isActive;
}
exports.CreatePaymentMethodDto = CreatePaymentMethodDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: payment_method_entity_1.PaymentMethodType, example: payment_method_entity_1.PaymentMethodType.BANK }),
    (0, class_validator_1.IsEnum)(payment_method_entity_1.PaymentMethodType),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bank BCA' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PT Eventix Indonesia' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "accountHolderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePaymentMethodDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-payment-method.dto.js.map