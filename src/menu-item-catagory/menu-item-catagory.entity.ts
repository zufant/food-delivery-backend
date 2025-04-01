import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { MenuItem } from '../menu-items/menu-item.entity';

@Entity()
@Unique(['name', 'restaurant_id'])
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: number;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];
}
