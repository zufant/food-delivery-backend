import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuItemDto } from './menu-item.interface';
import { JwtService } from '@nestjs/jwt';
import { Category } from 'src/menu-item-catagory/menu-item-catagory.entity';
import { Order } from 'src/orders/order.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem) private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Category) private orderRepository: Repository<Order>,
    private jwtService: JwtService,
  ) {}

  async getMenuItemsByRestaurant(restaurantId: number, page: number = 1, pageSize: number = 10): Promise<MenuItem[]> {
    try {
      return await this.menuItemsRepository.createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.category', 'category')
        .leftJoinAndSelect('menuItem.restaurant', 'restaurant')
        .where('restaurant.restaurant_id = :restaurantId', { restaurantId })
        .select([
          'menuItem.item_id AS itemId',
          'menuItem.name AS name',
          'menuItem.description AS description',
          'menuItem.price AS price',
          'category.category_id AS categoryId',
          'category.name AS categoryName',
          'restaurant.name AS restaurantName',
          'restaurant.location AS restaurantAddress',
          'restaurant.restaurant_id AS restaurantId',
        ])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getRawMany();
    } catch (error) {
      console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error);
      throw new InternalServerErrorException('Failed to retrieve menu items. Please try again later.');
    }
  }

  async getAllMenuItems() {
    try {
      return await this.menuItemsRepository.createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.category', 'category')  
        .leftJoinAndSelect('menuItem.restaurant', 'restaurant')
        .select([
         'menuItem.item_id AS itemId',
          'menuItem.name AS name',
          'menuItem.description AS description',
          'menuItem.price AS price',
          'category.category_id AS categoryId',
          'category.name AS categoryName',
          'restaurant.name AS restaurantName',
          'restaurant.location AS restaurantAddress',
          'restaurant.restaurant_id AS restaurantId',
        ])
        .getRawMany();  
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new InternalServerErrorException('Failed to retrieve menu items. Please try again later.');
    }
  }

  async createMenuItem(token: string, menuItemData: Partial<MenuItemDto>, user: any): Promise<MenuItem> {
    try {
      const { role, restaurantId } = user;
      if (role !== 'Manager') {
        throw new ForbiddenException('Only managers can create menu items');
      }
      if (!restaurantId) {
        throw new ForbiddenException('Manager does not have an associated restaurant');
      }
      const existingMenuItem = await this.menuItemsRepository.findOne({
        where: {
          name: menuItemData.name,
          restaurant_id: restaurantId,
        },
      });
      if (existingMenuItem) {
        throw new ConflictException('A menu item with this name already exists in your restaurant');
      }
      const menuItem = this.menuItemsRepository.create({
        ...menuItemData,
        restaurant: { restaurant_id: restaurantId },
      });
      return await this.menuItemsRepository.save(menuItem);
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateMenuItem(id: number, menuItemData: Partial<MenuItemDto>, user: any): Promise<MenuItem> {
    try {
      const { role, restaurantId } = user;
      const item = await this.menuItemsRepository.findOne({ where: { item_id: id }, relations: ['restaurant'] });
      if (!item) {
        throw new NotFoundException('Menu item not found');
      }
      if (role !== 'Manager' || restaurantId !== item.restaurant.restaurant_id) {
        throw new ForbiddenException('You can only update items from your own restaurant');
      }
      const existingMenuItem = await this.menuItemsRepository.findOne({
        where: {
          name: menuItemData.name,
          restaurant_id: restaurantId, 
        },
      });
      console.log("this is the item id"+ id + "......."+existingMenuItem?.item_id)
      if (existingMenuItem && existingMenuItem.item_id!=id) {
        throw new ConflictException('A menu item with this name already exists in your restaurant');
      }
      await this.menuItemsRepository.update(id, menuItemData);
      const updatedItem = await this.menuItemsRepository.findOneBy({ item_id: id });
      if (!updatedItem) {
        throw new NotFoundException('Menu item not found after update');
      }
      return updatedItem;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
  
  async deleteMenuItem(id: number, user: any): Promise<void> {
    try {
      const { role, restaurantId } = user;
  
      const item = await this.menuItemsRepository.findOne({
        where: { item_id: id },
        relations: ['restaurant', 'orders', 'category'],
      });
  
      if (!item) {
        throw new NotFoundException('Menu item not found');
      }
  
      if (role !== 'Manager' || restaurantId !== item.restaurant.restaurant_id) {
        throw new ForbiddenException('You can only delete items from your own restaurant');
      }
  
      if (item.orders && item.orders.length > 0) {
        throw new ConflictException('Menu item cannot be deleted because it is associated with an order');
      }
  
      await this.menuItemsRepository.delete(id);
  
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
  
  async getMenuItemsByCategory(categoryId: number) {
    try {
      const menuItems = await this.menuItemsRepository.createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.category', 'category')  
        .leftJoinAndSelect('menuItem.restaurant', 'restaurant')
        .select([
          'menuItem.item_id', 
          'menuItem.name AS name',
          'menuItem.description AS description',
          'menuItem.price AS price',
          'category.category_id AS categoryId',
          'category.name AS categoryName', 
          'restaurant.name AS restaurantName',  
          'restaurant.location AS restaurantAddress',
          'restaurant.restaurant_id AS restaurant_id', 
        ])
        .where('category.category_id = :categoryId', { categoryId })
        .getRawMany();  
      if (!menuItems.length) {
        throw new NotFoundException(`No menu items found for category ID ${categoryId}`);
      }
      return menuItems;
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
