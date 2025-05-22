
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  film_id: string;

  @Column()
  session_id: string;

  @Column()
  row: number;

  @Column()
  seat: number;

  @Column('double precision')
  price: number;

  @Column({ type: 'timestamp' })
  session_time: Date;

  @ManyToOne(() => Order, (order) => order.tickets)
  order: Order;

  
}