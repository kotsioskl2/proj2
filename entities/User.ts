export class User {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor(id: number, name: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Method to display user information
    displayInfo(): void {
        console.log(`User: ${this.name}, Email: ${this.email}`);
    }
}