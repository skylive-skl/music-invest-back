import { IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRevenueReportDto {
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;
}
