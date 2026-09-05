-- ============================================================
-- Car Dealership Database Schema
-- PostgreSQL
-- ============================================================

-- Drop tables if they exist (in dependency order: bookings first
-- because it references cars)
DROP TABLE IF EXISTS car_images;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS buy_requests;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS site_content;
DROP TABLE IF EXISTS admins;

-- ============================================================
-- Table: admins
-- Stores admin login credentials (password is bcrypt-hashed)
-- ============================================================
CREATE TABLE admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Table: cars
-- Stores car inventory with pricing in the database so the
-- admin can update it without touching code.
-- ============================================================
CREATE TABLE IF NOT EXISTS cars (
  id            SERIAL PRIMARY KEY,
  brand         VARCHAR(100) NOT NULL,
  model         VARCHAR(100) NOT NULL,
  year          INTEGER NOT NULL,
  price         DECIMAL(12, 2) NOT NULL,
  color         VARCHAR(50),
  fuel_type     VARCHAR(50),
  transmission  VARCHAR(50),
  mileage       INTEGER,
  engine        VARCHAR(100),
  horsepower    INTEGER,
  seats         INTEGER,
  description   TEXT,
  description_ar TEXT,
  image_url     VARCHAR(500),
  availability  BOOLEAN DEFAULT TRUE,
  featured      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Table: car_images
-- Stores multiple gallery images per car. The single primary image
-- (is_primary = true) is also mirrored in cars.image_url for use on
-- listing cards. A car must have at most one primary image.
-- ============================================================
CREATE TABLE IF NOT EXISTS car_images (
  id            SERIAL PRIMARY KEY,
  car_id        INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url     VARCHAR(500) NOT NULL,
  is_primary    BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);

-- ============================================================
-- Table: bookings
-- Stores customer maintenance service booking requests.
-- car_id references the cars table; if a car is deleted the
-- booking's car_id becomes NULL but the booking is kept.
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id                SERIAL PRIMARY KEY,
  customer_name     VARCHAR(150) NOT NULL,
  phone_number      VARCHAR(20) NOT NULL,
  car_id            INTEGER REFERENCES cars(id) ON DELETE SET NULL,
  service_type      VARCHAR(100) NOT NULL,
  preferred_date    DATE NOT NULL,
  preferred_time    TIME NOT NULL,
  notes             TEXT,
  status            VARCHAR(20) DEFAULT 'pending',
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Table: buy_requests
-- Stores customer requests to buy a new car.
-- ============================================================
CREATE TABLE IF NOT EXISTS buy_requests (
  id                SERIAL PRIMARY KEY,
  customer_name     VARCHAR(150) NOT NULL,
  phone_number      VARCHAR(20) NOT NULL,
  email             VARCHAR(255),
  preferred_brand   VARCHAR(50),
  preferred_model   VARCHAR(100),
  preferred_color   VARCHAR(50),
  budget            DECIMAL(12, 2),
  notes             TEXT,
  status            VARCHAR(20) DEFAULT 'new',
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Table: branches
-- Stores dealership branch locations with bilingual (EN/AR) fields.
-- is_active controls whether a branch shows on the public /branches page.
-- ============================================================
CREATE TABLE IF NOT EXISTS branches (
  id                SERIAL PRIMARY KEY,
  name_ar           VARCHAR(200) NOT NULL,
  name_en           VARCHAR(200) NOT NULL,
  address_ar        VARCHAR(300),
  address_en        VARCHAR(300),
  phone             VARCHAR(50),
  mobile            VARCHAR(50),
  email             VARCHAR(255),
  working_hours_ar  VARCHAR(200),
  working_hours_en  VARCHAR(200),
  maps_url          VARCHAR(500),
  latitude          DECIMAL(9, 6),
  longitude         DECIMAL(9, 6),
  image_url         VARCHAR(500),
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Table: site_content
-- Stores editable website text so the admin can update it.
-- Content is stored per language (lang column) so the admin can
-- provide both English and Arabic versions of each section.
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id            SERIAL PRIMARY KEY,
  section_key   VARCHAR(100) NOT NULL,
  lang          VARCHAR(5) NOT NULL DEFAULT 'en',
  content       TEXT NOT NULL,
  updated_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (section_key, lang)
);
