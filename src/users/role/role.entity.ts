import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  name: string; 
}
