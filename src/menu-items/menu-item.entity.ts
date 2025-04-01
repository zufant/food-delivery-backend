import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Category } from 'src/menu-item-catagory/menu-item-catagory.entity';
import { Order } from 'src/orders/order.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, (category) => category.menuItems)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: number;

  // Add reverse relation to Order
  @OneToMany(() => Order, (order) => order.menuItem)
  orders: Order[];
}
