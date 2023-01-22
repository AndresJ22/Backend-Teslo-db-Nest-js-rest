import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
     @PrimaryGeneratedColumn('uuid')
     id:string;

     @Column('text', {
          unique: true
     })
     email: string;

     @Column('text',{
          select: false
     })
     password: string;

     @Column('text')
     fullName: string;

     @Column('bool', {
          default: false
     })
     isActive: boolean;

     @Column('text', {
          array: true,
          default:['user']
     })
     roles: string[];
     
     @OneToMany(
          () => Product,
          (product) => product.user,
          {
               cascade: true, eager: true
          }
     )
     products?: Product[];

     @BeforeInsert() 
     checkFieldsBeforeInsert() {
          this.email = this.email.toLowerCase().trim();
     }
     
     @BeforeUpdate()
     checkFieldsBeforeUpdate() {
         this.checkFieldsBeforeInsert();
     }
}
