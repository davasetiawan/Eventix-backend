"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTicketTierDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ticket_tier_dto_1 = require("./create-ticket-tier.dto");
class UpdateTicketTierDto extends (0, swagger_1.PartialType)(create_ticket_tier_dto_1.CreateTicketTierDto) {
}
exports.UpdateTicketTierDto = UpdateTicketTierDto;
//# sourceMappingURL=update-ticket-tier.dto.js.map