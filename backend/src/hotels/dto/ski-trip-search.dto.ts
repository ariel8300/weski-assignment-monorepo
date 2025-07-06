import { IsNumber, IsString, IsDateString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SkiTripSearchDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  ski_site: number;

  @IsString()
  from_date: string;

  @IsString()
  to_date: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  group_size: number;
}

// This DTO is used for the external API request format
export class SkiTripSearchRequestDto {
  query: SkiTripSearchDto;
} 