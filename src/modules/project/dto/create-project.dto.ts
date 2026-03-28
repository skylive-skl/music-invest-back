import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  fundingGoal: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  revenueSharePercent: number;

  @IsNumber()
  @Min(1)
  durationMonths: number;
}
