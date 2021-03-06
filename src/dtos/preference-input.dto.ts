import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean
} from 'class-validator'

export class PreferenceInput {
  constructor(partial: Partial<PreferenceInput>) {
    Object.assign(this, partial)
  }

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sub1: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sub2: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sub3: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active: boolean = true

  @ApiProperty({ default: 'email', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['email', 'slack'])
  type: string = 'email'

  @ApiProperty({ default: 8, required: false })
  @IsOptional()
  @IsIn(Array.from(Array(24).keys()))
  hour: number = 8

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsIn(Array.from(Array(60).keys()))
  minute: number = 0
}
