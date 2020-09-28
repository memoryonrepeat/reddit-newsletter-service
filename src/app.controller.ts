import { AppService } from './app.service'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger'
import { PreferenceInput } from './dtos/preference-input.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async upsertPreference(@Body() preferenceInput: PreferenceInput) {
    return this.appService.upsertPreference(preferenceInput)
  }
}
