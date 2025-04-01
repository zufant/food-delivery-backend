import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAllRestaurants(): Promise<Partial<Restaurant>[]> {
    try {
      return await this.restaurantRepository.find({
        select: ['restaurant_id', 'name', 'location'],
      });
    } catch (error) {
      throw new Error('An error occurred while fetching the restaurants');
    }
  }

}
