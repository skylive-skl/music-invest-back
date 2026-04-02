import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { InvestmentModule } from './modules/investment/investment.module';
import { PayoutModule } from './modules/payout/payout.module';

import { S3Module } from './modules/s3/s3.module';
import { AlbumModule } from './modules/album/album.module';
import { TrackModule } from './modules/track/track.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProjectModule,
    InvestmentModule,
    PayoutModule,
    ScheduleModule.forRoot(),
    S3Module,
    AlbumModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
