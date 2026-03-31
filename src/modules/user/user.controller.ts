import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.userService.findById(req.user.id);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      balance: user.balance,
      createdAt: user.createdAt,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user wallet balance' })
  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  async getWallet(@Req() req: any) {
    const user = await this.userService.findById(req.user.id);
    if (!user) throw new NotFoundException('User not found');
    return { balance: user.balance };
  }
}
