import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { InvestmentModule } from './modules/investment/investment.module';
import { PayoutModule } from './modules/payout/payout.module';
import { StreamingModule } from './modules/streaming/streaming.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProjectModule,
    InvestmentModule,
    PayoutModule,
    ScheduleModule.forRoot(),
    StreamingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
