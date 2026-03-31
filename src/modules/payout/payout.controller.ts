import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payouts')
@ApiBearerAuth()
@Controller('payouts')
@UseGuards(JwtAuthGuard)
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @ApiOperation({ summary: 'Submit revenue report for a project' })
  @UseGuards(RolesGuard)
  @Roles('ARTIST', 'ADMIN')
  @Post('revenue')
  async submitRevenue(@Req() req: any, @Body() dto: CreateRevenueReportDto) {
    return this.payoutService.submitRevenue(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get payout history for current user' })
  @Get('history')
  async getPayoutHistory(@Req() req: any) {
    return this.payoutService.getPayoutHistory(req.user.id);
  }
}
