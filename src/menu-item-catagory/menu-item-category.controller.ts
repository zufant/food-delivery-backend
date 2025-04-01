import { Controller, Get, UseGuards, Request, Body, Post, Delete, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { MenuItemCategoryService } from './menu-item-category.service';
import { Category } from './menu-item-catagory.entity';
import { RoleDecorator } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { CategoryDto } from './create-category.dto';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('menu-items/categories/')
export class MenuItemCategoryController {
  constructor(private readonly menuItemCategoryService: MenuItemCategoryService) {}
  
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCategories(@Request() req): Promise<Category[]> {
    return this.menuItemCategoryService.getCategoriesForRestaurant(req.user.restaurantId);
  }

  @Get(':restaurantId')
  @UseGuards(JwtAuthGuard)
  async getCategoriesByRestaurantId(@Param('restaurantId') restaurantId: number): Promise<Category[]> {
    return this.menuItemCategoryService.getCategoriesForRestaurant(restaurantId);
  }

  @Post("add")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  async addCategory(@Body() createCategoryDto: CategoryDto, @Request() req): Promise<Category> {
    return this.menuItemCategoryService.addCategory(createCategoryDto, req.user);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  async updateCatalog(
    @Param('id') id: number,
    @Body() updateCatalogDto: CategoryDto,
    @Request() req,
  ): Promise<Category> {
    return this.menuItemCategoryService.updateCatalog(id, updateCatalogDto, req.user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator(Role.Manager)
  async deleteCatalog(@Param('id') id: number, @Request() req): Promise<void> {
    return this.menuItemCategoryService.deleteCatalog(id, req.user);
  }
}