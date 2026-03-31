import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({ example: 'uuid-project-id', description: 'The ID of the project to invest in' })
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 100, description: 'Investment amount in USD', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;
}
