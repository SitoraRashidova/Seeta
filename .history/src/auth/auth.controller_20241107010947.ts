import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  HttpStatus,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from '../admin/models/admin.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminService } from '../admin/admin.service';
import { Response, Request } from 'express';
import { SignInDto } from './dto/admin-signin.dto';
import { CookieGetter } from '../common/decorators/cookieGetter.decorator';
import { AdminCreatorGuard } from '../common/guards/admin_creator.guard';
import { Learner } from '../learner/models/learner.model';
import { CreateLearnerDto } from '../learner/dto/create-learner.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signupAdmin')
  @ApiOperation({ summary: "" })
  @ApiResponse({
    status: 201,
    description: 'Create Admin',
    type: Admin,
  })
  async adminSignUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.adminSignUp(createAdminDto, res);
    return res.status(201).json(result);
  }

  @Post('signinAdmin')
  @ApiOperation({ summary: 'Admin tizimga kirish' })
  @ApiResponse({
    status: 200,
    description: 'Admin signin',
    type: Admin,
  })
  async adminSignIn(@Body() adminSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.adminSignIn(adminSignInDto, res);
  }

  @ApiOperation({ summary: "ma'lumotlarni tokenga o'zgartirish" })
  @Post('refreshTokenAdmin/:id')
  async refreshToken(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(id, refresh_token, res);
  }

  @Post('signoutAdmin/:id')
  @ApiOperation({ summary: 'Admin tizimdan chiqishi' })
  @ApiResponse({
    status: 200,
    description: 'Admin signout',
  })
  async adminSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.adminSignOut(refreshToken, res, +id);
  }

  //==================== LEARNER ===========================

  @Post('signupLearner')
  @ApiOperation({ summary: 'Add new Learner' })
  @ApiResponse({
    status: 201,
    description: 'Create Learner',
    type: Learner,
  })
  async learnerSignUp(
    @Body() createLearnerDto: CreateLearnerDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.learnerSignUp(createLearnerDto, res);
    return res.status(201).json(result);
  }

  @ApiOperation({ summary: 'The link to activate learner' })
  @Get('activate/:link')
  activateLearner(@Param('link') link: string, @Res() res: Response) {
    return this.authService.activateLearner(link, res);
  }

  @Post('signinLearner')
  @ApiOperation({ summary: 'Learner tizimga kirish' })
  @ApiResponse({
    status: 200,
    description: 'Learner signin',
    type: Learner,
  })
  async learnerSignIn(
    @Body() learnerSignInDto: SignInDto,
    @Res() res: Response,
  ) {
    return this.authService.learnerSignIn(learnerSignInDto, res);
  }

  @Post('signoutLearner/:id')
  @ApiOperation({ summary: 'Learner tizimdan chiqishi' })
  @ApiResponse({
    status: 200,
    description: 'Learner signout',
  })
  async learnerSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.learnerSignOut(refreshToken, res, +id);
  }

  @ApiOperation({ summary: "ma'lumotlarni tokenga o'zgartirish" })
  @Post('refreshTokenLearner/:id')
  async refreshTokenLearner(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenLearner(id, refresh_token, res);
  }
}