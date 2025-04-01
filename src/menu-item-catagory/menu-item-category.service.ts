import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from 'src/menu-items/menu-item.entity';
import { Repository } from 'typeorm';
import { Category } from './menu-item-catagory.entity';
import { CategoryDto } from './create-category.dto';

@Injectable()
export class MenuItemCategoryService {
  constructor(
    @InjectRepository(MenuItem) private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async getCategoriesForRestaurant(restaurantId: number): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { restaurant_id: restaurantId },
        select: ['category_id', 'name', 'description'],
      });
  
      if (!categories.length) {
        throw new NotFoundException('No categories found for this restaurant');
      }
  
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addCategory(createCategoryDto: CategoryDto, user: any): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        restaurant_id: user.restaurantId,
      });

      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Category name must be unique within the same restaurant.');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCatalog(id: number, updateCatalogDto: CategoryDto, user: any): Promise<Category> {
    try {
      const catalog = await this.categoryRepository.findOne({ where: { category_id: id } });
  
      if (!catalog) {
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }
  
      if (catalog.restaurant_id !== user.restaurantId) {
        throw new ForbiddenException(`You do not have permission to update this catalog`);
      }
  
      Object.assign(catalog, updateCatalogDto);
      return await this.categoryRepository.save(catalog);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCatalog(id: number, user: any): Promise<void> {
    try {
      const result = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.menuItems', 'menuItem')
        .where('category.category_id = :id', { id })
        .andWhere('category.restaurant_id = :restaurantId', { restaurantId: user.restaurantId })
        .getOne();
        
      if (!result) {
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }
      console.log("this is the result"+(result.menuItems.length>0)?true:false)
      if (result.menuItems.length > 0) {
        throw new ForbiddenException('This catalog has associated menu items and cannot be deleted');
      }
    
      await this.categoryRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
