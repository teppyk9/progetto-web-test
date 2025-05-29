-- Drop tables in reverse order of creation to avoid dependency issues if they exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS artisans;
DROP TABLE IF EXISTS users;

-- Create a table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for artisans
CREATE TABLE artisans (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descrizione TEXT,
    email VARCHAR(255) UNIQUE, -- Can be NULL as per model
    "userId" INTEGER REFERENCES users(id), -- Anticipated foreign key
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descrizione TEXT,
    prezzo DECIMAL(10, 2) NOT NULL,
    "immagineUrl" VARCHAR(255),
    categoria VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0,
    "artisanId" INTEGER REFERENCES artisans(id), -- Anticipated foreign key
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for cart_items (representing items in a user's cart)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    "productId" INTEGER NOT NULL REFERENCES products(id),
    quantita INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    "dataOrdine" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stato VARCHAR(255) NOT NULL DEFAULT 'Pending',
    totale DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for order_items (representing items within an order)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL REFERENCES orders(id),
    "productId" INTEGER NOT NULL REFERENCES products(id),
    quantita INTEGER NOT NULL DEFAULT 1,
    "prezzoAlMomentoDellOrdine" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
