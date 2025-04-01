import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(loginDto: any) {
    const user = await this.validateUser(loginDto.email, loginDto.password); 
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.user_id, role: user.role.name, restaurantId: user.restaurant_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
