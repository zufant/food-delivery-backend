import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './menu-item.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { RoleDecorator } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @UseGuards(JwtAuthGuard) 
  async getAllMenuItems() {
    return this.menuItemsService.getAllMenuItems();
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard)
  getMenuItems(@Param('restaurantId') restaurantId: number): Promise<MenuItem[]> {
    return this.menuItemsService.getMenuItemsByRestaurant(restaurantId);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  createMenuItem(@Body() menuItemData: MenuItem, @Request() req): Promise<MenuItem> {
    const user = req.user;
    return this.menuItemsService.createMenuItem(user, menuItemData, req.user);
  }

  @Get('restaurant')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  GetMenuItemForManager(@Request() req): Promise<MenuItem[]> {
    const user = req.user;
    return this.menuItemsService.getMenuItemsByRestaurant(req.user.restaurantId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  updateMenuItem(
    @Param('id') id: number,
    @Body() menuItemData: MenuItem,
    @Request() req,
  ): Promise<MenuItem> {
  
    return this.menuItemsService.updateMenuItem(id, menuItemData, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  deleteMenuItem(@Param('id') id: number, @Request() req): Promise<void> {
    const user = req.user;
    return this.menuItemsService.deleteMenuItem(id, req.user);
  }

  @Get('category/:categoryId')
  @UseGuards(JwtAuthGuard)
  async getMenuItemsByCategory(@Param('categoryId') categoryId: number) {
    return this.menuItemsService.getMenuItemsByCategory(categoryId);
  }
}
