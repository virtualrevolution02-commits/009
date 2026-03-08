const { Client } = require('pg');
require('dotenv').config();

const PRODUCTS = [
    {
        name: 'Imperial Gold Jhumka',
        price: '₹99,999',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.0,
        filter: '',
        description: 'Traditional handcrafted golden jhumkas with intricate floral patterns.'
    },
    {
        name: 'Diamond Teardrop Elegance',
        price: '₹1,85,000',
        type: 'Drop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 0.9,
        filter: 'grayscale(1) brightness(1.5) contrast(1.2)',
        description: 'Exquisite teardrop diamonds set in 18k white gold for a royal look.'
    },
    {
        name: 'Classic Pearl Studs',
        price: '₹25,000',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.8,
        filter: 'grayscale(1) brightness(1.2)',
        description: 'Timeless Akoya pearls on a minimalist gold base, perfect for any occasion.'
    },
    {
        name: 'Ruby Oval Dangle',
        price: '₹2,45,000',
        type: 'Statement Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: true,
        scale: 1.1,
        filter: 'hue-rotate(-50deg) saturate(2) brightness(0.9) drop-shadow(0px 2px 5px rgba(150,0,0,0.5))',
        description: 'Vibrant Burmese rubies surrounded by a halo of micro-diamonds.'
    },
    {
        name: 'Silver Hoops minimal',
        price: '₹15,000',
        type: 'Hoop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 1.0,
        filter: 'grayscale(1) brightness(1.5) contrast(1.2)',
        description: 'Modern sterling silver hoops designed for a sophisticated everyday look.'
    }
];

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function seed() {
    try {
        await client.connect();
        console.log('Connected to Neon PostgreSQL DB');

        await client.query(`DROP TABLE IF EXISTS products CASCADE;`);

        await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        type VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        "isDangle" BOOLEAN NOT NULL,
        scale NUMERIC(4,2) NOT NULL,
        filter TEXT NOT NULL,
        description TEXT
      );
    `);
        console.log('Created products table with description column.');

        for (const p of PRODUCTS) {
            await client.query(
                `INSERT INTO products (name, price, type, image, "isDangle", scale, filter, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [p.name, p.price, p.type, p.image, p.isDangle, p.scale, p.filter, p.description]
            );
        }
        console.log('Successfully seeded 5 products with INR prices and descriptions.');
    } catch (err) {
        console.error('Error seeding DB:', err);
    } finally {
        await client.end();
    }
}

seed();
