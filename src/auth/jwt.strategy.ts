import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: '4f45ac06b41f76f2f8b5b6220cded3ecf0545be21cdd5f1c9827edca46fd9d3d',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Token is invalid or missing required fields');
    }

    return { userId: payload.sub, email: payload.email, role: payload.role,restaurantId:payload.restaurantId };
  }
}
