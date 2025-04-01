import { MenuItem } from 'src/menu-items/menu-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  user_id: number;

  @Column()
  restaurant_id: number;

  @Column('decimal')
  order_total: number;

  @Column()
  delivery_status: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orders)
  @JoinColumn({ name: 'menu_item_id' }) // This column will link orders to the MenuItem
  menuItem: MenuItem;

  @Column()
  menu_item_id: number;
}
