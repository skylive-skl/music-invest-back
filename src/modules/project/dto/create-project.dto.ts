import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Album', description: 'The title of the project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This album will blow your mind', description: 'Detailed project description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10000, description: 'Funding goal in USD' })
  @IsNumber()
  @Min(1)
  fundingGoal: number;

  @ApiProperty({ example: 50, description: 'Percentage of revenue to share with investors', minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  revenueSharePercent: number;

  @ApiProperty({ example: 12, description: 'Duration of the project in months', minimum: 1 })
  @IsNumber()
  @Min(1)
  durationMonths: number;
}
