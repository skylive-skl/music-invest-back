import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
