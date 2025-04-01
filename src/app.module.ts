import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './menu-item-catagory/menu-item-catagory.entity';
import { MenuItem } from './menu-items/menu-item.entity';
import { Order } from './orders/order.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { User } from './users/user.entity';
import { Role } from './users/role/role.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MenuItemCategoryController } from './menu-item-catagory/menu-item-category.controller';
import { MenuItemsController } from './menu-items/menu-items.controller';
import { MenuItemsService } from './menu-items/menu-items.service';
import { UsersService } from './users/users.service';
import { MenuItemCategoryService } from './menu-item-catagory/menu-item-category.service';
import { RoleService } from './users/role/role.service';
import { RoleController } from './users/role/role.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { RestaurantController } from './restaurants/restaurant.controller';
import { RestaurantService } from './restaurants/restaurant.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: 'admin',
      database: 'food_delivery',
      entities: [
        Category,
        MenuItem,
        Order,
        Restaurant,
        User,
        Role
      ],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([
      Category,
      MenuItem,
      Order,
      Restaurant,
      User,
      Role,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '4f45ac06b41f76f2f8b5b6220cded3ecf0545be21cdd5f1c9827edca46fd9d3d', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AppController,AuthController,MenuItemCategoryController,MenuItemsController,RoleController,RestaurantController],
  providers: [JwtStrategy,AppService,AuthService,MenuItemsService,UsersService,Restaurant,MenuItemCategoryService,RoleService, RestaurantService],
  exports: [JwtStrategy, PassportModule],
})
export class AppModule {}
