import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Investments')
@ApiBearerAuth()
@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @ApiOperation({ summary: 'Invest in a project' })
  @Roles('USER', 'ARTIST', 'ADMIN')
  @Post()
  async invest(@Req() req: any, @Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentService.invest(req.user.id, createInvestmentDto);
  }

  @ApiOperation({ summary: 'Get current user investments' })
  @Get('my-investments')
  async getMyInvestments(@Req() req: any) {
    return this.investmentService.findUserInvestments(req.user.id);
  }
}
