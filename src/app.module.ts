import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { InvestmentModule } from './modules/investment/investment.module';
import { PayoutModule } from './modules/payout/payout.module';
import { StreamingModule } from './modules/streaming/streaming.module';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProjectModule,
    InvestmentModule,
    PayoutModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    StreamingModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
