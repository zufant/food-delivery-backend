import { Controller, Get, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('restaurants') 
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

    @Get("/all")
    @UseGuards(JwtAuthGuard) 
    async getAllRestaurants(): Promise<Partial<Restaurant>[]> {
        return this.restaurantService.getAllRestaurants(); 
    }
}
