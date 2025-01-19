import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from './Listing';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Listing, (listing: Listing) => listing.user)
  listings: Listing[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(id: number, name: string, email: string, username: string, password: string, role: string, createdAt: Date = new Date()) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.listings = [];
  }

  // Method to display user information
  displayInfo(): void {
    console.log(`User: ${this.name}, Email: ${this.email}`);
  }
}