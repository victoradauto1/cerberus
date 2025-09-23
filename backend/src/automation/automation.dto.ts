/*istanbul ignore file */

import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString, ValidateNested} from 'class-validator';
import { ChainId } from 'commons/models/chainId';
import { Exchange } from 'commons/models/exchange';

class ConditionDTO {
  @IsString()
  field: string;

  @IsString()
  operator: string;

  @IsString()
  value: string;
}

export class AutomationDTO {
  @IsString()
  name: string;

  @IsString()
  poolId: string;

  @IsString()
  nextAmount: string;

  @ValidateNested()
  @Type(()=> ConditionDTO)
  openCondition: ConditionDTO;

  @Optional()  
  @ValidateNested()
  @Type(()=> ConditionDTO)
  closeCondition?: ConditionDTO;

  @IsBoolean()
  @Optional()  
  isOpened: boolean;
  
  @IsBoolean()
  @Optional()  
  isActive: boolean;

  @IsInt()
  exchange: Exchange;

  @IsInt()
  network: ChainId;
}
