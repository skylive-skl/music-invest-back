import { IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRevenueReportDto {
  @ApiProperty({ example: 'uuid-project-id', description: 'The related project ID' })
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 5000, description: 'Revenue amount generated in the period' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Period start date' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2023-01-31T23:59:59Z', description: 'Period end date' })
  @IsDateString()
  periodEnd: string;
}
