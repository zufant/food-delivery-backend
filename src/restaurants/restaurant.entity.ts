import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Category } from '../menu-item-catagory/menu-item-catagory.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  restaurant_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant, { cascade: true })
  menuItems: MenuItem[];

  @OneToMany(() => Category, (category) => category.restaurant, { cascade: true })
  categories: Category[];
}
