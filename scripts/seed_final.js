const { Client } = require('pg');
require('dotenv').config();

// ============================================================
// PRODUCT CATALOG — BeautyBliz by Anu (@_beautybliz_)
// Instagram: https://www.instagram.com/_beautybliz_/
// Shop: Fashion Accessories / Bridal Jewellery — Uthukuli
// 65 Posts | 396 Followers
// ============================================================

const PRODUCTS = [
    // ──────────────────────────────────────────────────
    // ORIGINAL 5 PRODUCTS (IDs 1–5)
    // ──────────────────────────────────────────────────
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
    },

    // ──────────────────────────────────────────────────
    // BEAUTYBLIZ INSTAGRAM PRODUCTS (IDs 6–65)
    // Source: @_beautybliz_ — Fashion Accessories / Bridal Jewellery
    // ──────────────────────────────────────────────────

    // --- JHUMKAS & TRADITIONAL EARRINGS ---
    {
        name: 'Antique Kundan Jhumka',
        price: '₹1,299',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.0,
        filter: 'sepia(0.3) saturate(1.4) brightness(1.1)',
        description: 'Antique finish kundan jhumkas with pearl drops, perfect for bridal wear.'
    },
    {
        name: 'Peacock Meenakari Jhumka',
        price: '₹899',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.1,
        filter: 'hue-rotate(120deg) saturate(1.5) brightness(1.0)',
        description: 'Hand-painted peacock meenakari jhumkas in vibrant green and blue enamel.'
    },
    {
        name: 'Temple Bell Jhumka',
        price: '₹1,499',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.2,
        filter: 'sepia(0.2) brightness(1.15)',
        description: 'Traditional South Indian temple bell jhumkas with Lakshmi motif.'
    },
    {
        name: 'Matte Gold Layered Jhumka',
        price: '₹1,799',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.15,
        filter: 'sepia(0.4) brightness(1.0) contrast(1.1)',
        description: 'Multi-layered matte gold finish jhumkas with ghungroo details.'
    },
    {
        name: 'Ruby Stone Jhumka',
        price: '₹999',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.0,
        filter: 'hue-rotate(-30deg) saturate(1.8) brightness(0.95)',
        description: 'Elegant ruby stone studded jhumkas with antique gold plating.'
    },
    {
        name: 'Oxidized Silver Jhumka',
        price: '₹599',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 0.95,
        filter: 'grayscale(0.6) brightness(1.1) contrast(1.3)',
        description: 'Bohemian oxidized silver jhumkas with tribal pattern detailing.'
    },
    {
        name: 'Bridal Kemp Jhumka',
        price: '₹2,499',
        type: 'Traditional Dangle',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 1.3,
        filter: 'hue-rotate(-20deg) saturate(2.0) brightness(0.9)',
        description: 'Heavy bridal kemp stone jhumkas with pearl clusters for wedding ceremonies.'
    },

    // --- CHANDBALI EARRINGS ---
    {
        name: 'Kundan Chandbali',
        price: '₹1,599',
        type: 'Chandbali Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 1.1,
        filter: 'sepia(0.2) saturate(1.3) brightness(1.05)',
        description: 'Crescent moon-shaped kundan chandbali earrings with pearl fringe.'
    },
    {
        name: 'Meenakari Chandbali',
        price: '₹1,399',
        type: 'Chandbali Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 1.0,
        filter: 'hue-rotate(180deg) saturate(1.4) brightness(1.1)',
        description: 'Blue meenakari chandbali with gold filigree and dangling pearls.'
    },
    {
        name: 'Polki Diamond Chandbali',
        price: '₹2,999',
        type: 'Chandbali Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 1.2,
        filter: 'brightness(1.3) contrast(1.1)',
        description: 'Premium polki diamond chandbali earrings for bridal trousseau.'
    },

    // --- STUD EARRINGS ---
    {
        name: 'AD Stone Stud',
        price: '₹499',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.7,
        filter: 'brightness(1.3) contrast(1.2)',
        description: 'American diamond studded earrings in rose gold finish.'
    },
    {
        name: 'Emerald CZ Stud',
        price: '₹699',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.75,
        filter: 'hue-rotate(90deg) saturate(1.6) brightness(1.1)',
        description: 'Gorgeous emerald green CZ stone studs with gold setting.'
    },
    {
        name: 'Floral CZ Stud',
        price: '₹549',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.8,
        filter: 'saturate(1.3) brightness(1.15)',
        description: 'Delicate floral design CZ studs, ideal for everyday elegance.'
    },
    {
        name: 'Kemp Stone Stud',
        price: '₹399',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.7,
        filter: 'hue-rotate(-40deg) saturate(1.8) brightness(1.0)',
        description: 'Traditional South Indian kemp stone studs with temple design.'
    },
    {
        name: 'Pearl Cluster Stud',
        price: '₹449',
        type: 'Stud Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.75,
        filter: 'brightness(1.2) sepia(0.1)',
        description: 'Multi-pearl cluster studs with gold frame for a refined look.'
    },

    // --- DROP & STATEMENT EARRINGS ---
    {
        name: 'Long Crystal Drop',
        price: '₹799',
        type: 'Drop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 1.0,
        filter: 'brightness(1.4) contrast(1.1)',
        description: 'Shimmering crystal drop earrings for party and evening wear.'
    },
    {
        name: 'Silk Thread Tassel',
        price: '₹349',
        type: 'Drop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 1.1,
        filter: 'hue-rotate(300deg) saturate(1.6) brightness(1.0)',
        description: 'Colorful silk thread tassel earrings, handmade with love.'
    },
    {
        name: 'Bahubali Devasena Drop',
        price: '₹1,899',
        type: 'Statement Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: true,
        scale: 1.3,
        filter: 'sepia(0.3) saturate(1.5) brightness(1.0)',
        description: 'Iconic Devasena-style earrings with hair chain, a bridal favorite.'
    },
    {
        name: 'Coin Drop Earring',
        price: '₹799',
        type: 'Drop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 0.95,
        filter: 'sepia(0.5) brightness(1.1)',
        description: 'Antique gold coin drop earrings with Lakshmi engraving.'
    },
    {
        name: 'Leaf Pattern Drop',
        price: '₹649',
        type: 'Drop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 0.9,
        filter: 'hue-rotate(80deg) saturate(1.3) brightness(1.1)',
        description: 'Nature-inspired leaf pattern drop earrings with green stone accent.'
    },

    // --- HOOP & BALI EARRINGS ---
    {
        name: 'Oxidized Bali Hoop',
        price: '₹299',
        type: 'Hoop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.9,
        filter: 'grayscale(0.5) brightness(1.2) contrast(1.2)',
        description: 'Classic oxidized silver bali hoops with carved pattern.'
    },
    {
        name: 'Gold Twisted Hoop',
        price: '₹449',
        type: 'Hoop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.95,
        filter: 'sepia(0.3) brightness(1.2)',
        description: 'Elegant twisted gold-plated hoops for a trendy look.'
    },
    {
        name: 'Pearl Bali Hoop',
        price: '₹549',
        type: 'Hoop Earring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 1.0,
        filter: 'brightness(1.25) sepia(0.1)',
        description: 'Gold bali hoops adorned with tiny pearl beads all around.'
    },

    // --- NECKLACE SETS ---
    {
        name: 'Bridal Choker Necklace Set',
        price: '₹3,499',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.6,
        filter: 'sepia(0.2) saturate(1.5) brightness(1.05)',
        description: 'Grand bridal choker necklace set with matching jhumka earrings and maang tikka.'
    },
    {
        name: 'Kemp Stone Necklace Set',
        price: '₹2,799',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.6,
        filter: 'hue-rotate(-25deg) saturate(1.8) brightness(0.95)',
        description: 'Traditional kemp stone temple necklace set with matching earrings.'
    },
    {
        name: 'Pearl Multi-Layer Necklace',
        price: '₹1,999',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.6,
        filter: 'brightness(1.3) sepia(0.05)',
        description: 'Three-layer pearl necklace with gold pendant and matching studs.'
    },
    {
        name: 'AD Stone Necklace Set',
        price: '₹2,199',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.6,
        filter: 'brightness(1.35) contrast(1.15)',
        description: 'Sparkling American diamond necklace set for engagement and reception.'
    },
    {
        name: 'Mango Mala Necklace',
        price: '₹3,999',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.6,
        filter: 'sepia(0.35) saturate(1.3) brightness(1.0)',
        description: 'Traditional South Indian mango design long necklace (mala) with matching jhumkas.'
    },
    {
        name: 'CZ Flower Necklace Set',
        price: '₹1,599',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.6,
        filter: 'brightness(1.2) saturate(1.2)',
        description: 'Modern CZ flower design necklace set with drop earrings.'
    },

    // --- BANGLES & BRACELETS ---
    {
        name: 'Silk Thread Bangle Set',
        price: '₹699',
        type: 'Bangle Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: false,
        scale: 0.5,
        filter: 'hue-rotate(330deg) saturate(1.5) brightness(1.1)',
        description: 'Set of 6 handmade silk thread bangles in pink and gold combo.'
    },
    {
        name: 'Stone Studded Bangle Pair',
        price: '₹899',
        type: 'Bangle Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: false,
        scale: 0.5,
        filter: 'saturate(1.4) brightness(1.15)',
        description: 'Pair of stone studded gold-plated bangles with intricate jali work.'
    },
    {
        name: 'Oxidized Silver Bangle Set',
        price: '₹499',
        type: 'Bangle Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.5,
        filter: 'grayscale(0.5) brightness(1.2) contrast(1.2)',
        description: 'Set of 4 oxidized silver bangles with elephant and peacock motifs.'
    },
    {
        name: 'Kemp Stone Bangle Pair',
        price: '₹1,199',
        type: 'Bangle Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'hue-rotate(-30deg) saturate(1.6) brightness(1.0)',
        description: 'Traditional kemp stone studded bangle pair with temple design.'
    },
    {
        name: 'Pearl Kada Bangle',
        price: '₹599',
        type: 'Bangle Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.5,
        filter: 'brightness(1.25) sepia(0.1)',
        description: 'Single broad pearl-studded kada bangle with gold plating.'
    },

    // --- MAANG TIKKA ---
    {
        name: 'Bridal Maang Tikka',
        price: '₹799',
        type: 'Maang Tikka',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 0.6,
        filter: 'sepia(0.2) saturate(1.4) brightness(1.1)',
        description: 'Ornate bridal maang tikka with kundan stones and pearl border.'
    },
    {
        name: 'Matha Patti Chain',
        price: '₹1,299',
        type: 'Maang Tikka',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: true,
        scale: 0.6,
        filter: 'brightness(1.2) saturate(1.3)',
        description: 'Full head matha patti chain with central pendant and side chains.'
    },
    {
        name: 'Simple AD Maang Tikka',
        price: '₹449',
        type: 'Maang Tikka',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: true,
        scale: 0.55,
        filter: 'brightness(1.35) contrast(1.1)',
        description: 'Minimalist American diamond maang tikka for engagement look.'
    },

    // --- NOSE PINS ---
    {
        name: 'Gold Nose Ring',
        price: '₹349',
        type: 'Nose Pin',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.4,
        filter: 'sepia(0.3) brightness(1.2)',
        description: 'Elegant gold-plated nose ring with single white stone.'
    },
    {
        name: 'Bridal Nose Ring with Chain',
        price: '₹899',
        type: 'Nose Pin',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: true,
        scale: 0.45,
        filter: 'sepia(0.2) saturate(1.4) brightness(1.05)',
        description: 'Bridal nath (nose ring) with pearl chain connecting to earring.'
    },
    {
        name: 'CZ Nose Stud',
        price: '₹199',
        type: 'Nose Pin',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.35,
        filter: 'brightness(1.4) contrast(1.2)',
        description: 'Tiny sparkling CZ stone nose stud for daily wear.'
    },

    // --- HAIR ACCESSORIES ---
    {
        name: 'Bridal Hair Pin Set',
        price: '₹599',
        type: 'Hair Accessory',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.5,
        filter: 'brightness(1.2) saturate(1.2)',
        description: 'Set of 5 decorative bridal hair pins with pearl and stone work.'
    },
    {
        name: 'Juda Pin with Flowers',
        price: '₹799',
        type: 'Hair Accessory',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: false,
        scale: 0.5,
        filter: 'hue-rotate(-20deg) saturate(1.5) brightness(1.05)',
        description: 'Hair bun (juda) pin decorated with artificial flowers and stones.'
    },
    {
        name: 'Billai Hair Brooch',
        price: '₹499',
        type: 'Hair Accessory',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.25) brightness(1.1)',
        description: 'South Indian bridal billai hair brooch with kemp stones.'
    },

    // --- WAIST CHAINS & ANKLETS ---
    {
        name: 'Gold Waist Chain (Oddiyanam)',
        price: '₹2,999',
        type: 'Waist Chain',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.3) saturate(1.3) brightness(1.05)',
        description: 'Traditional South Indian gold-plated waist chain with temple design.'
    },
    {
        name: 'Pearl Anklet Pair',
        price: '₹449',
        type: 'Anklet',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.5,
        filter: 'brightness(1.25) sepia(0.1)',
        description: 'Dainty pearl anklet pair with gold chain and ghungroo charm.'
    },
    {
        name: 'Silver Anklet (Payal)',
        price: '₹599',
        type: 'Anklet',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.5,
        filter: 'grayscale(0.4) brightness(1.3) contrast(1.1)',
        description: 'Traditional silver payal anklets with musical bells.'
    },

    // --- RINGS ---
    {
        name: 'Adjustable Kundan Ring',
        price: '₹299',
        type: 'Ring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.4,
        filter: 'sepia(0.2) saturate(1.3) brightness(1.1)',
        description: 'Adjustable kundan finger ring with floral setting.'
    },
    {
        name: 'AD Cocktail Ring',
        price: '₹399',
        type: 'Ring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.4,
        filter: 'brightness(1.35) contrast(1.15)',
        description: 'Glamorous American diamond cocktail ring for festive occasions.'
    },

    // --- BRIDAL FULL SETS ---
    {
        name: 'Complete Bridal Set - Gold',
        price: '₹5,999',
        type: 'Bridal Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.25) saturate(1.4) brightness(1.05)',
        description: 'Complete bridal set: necklace, jhumkas, maang tikka, nose ring, and bangles.'
    },
    {
        name: 'Complete Bridal Set - AD',
        price: '₹4,999',
        type: 'Bridal Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.5,
        filter: 'brightness(1.3) contrast(1.15)',
        description: 'Full American diamond bridal set for modern brides: necklace, earrings, tikka.'
    },
    {
        name: 'South Indian Bridal Set',
        price: '₹6,999',
        type: 'Bridal Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.3) saturate(1.5) brightness(1.0)',
        description: 'Premium South Indian bridal set with temple necklace, jhumkas, oddiyanam, and billai.'
    },

    // --- MISC FASHION ACCESSORIES ---
    {
        name: 'Saree Pin / Brooch',
        price: '₹249',
        type: 'Brooch',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955705/vistara_earrings/earring3.png',
        isDangle: false,
        scale: 0.4,
        filter: 'brightness(1.2) saturate(1.3)',
        description: 'Decorative saree pin brooch with CZ stones in gold setting.'
    },
    {
        name: 'Vanki (Armlet)',
        price: '₹1,299',
        type: 'Armlet',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.3) saturate(1.3) brightness(1.05)',
        description: 'Traditional South Indian vanki armlet with kemp stone design.'
    },
    {
        name: 'Kamarbandh (Hip Chain)',
        price: '₹1,799',
        type: 'Waist Chain',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955706/vistara_earrings/earring4.png',
        isDangle: false,
        scale: 0.5,
        filter: 'hue-rotate(-15deg) saturate(1.4) brightness(1.0)',
        description: 'Bridal kamarbandh hip chain with red and green stone work.'
    },
    {
        name: 'Kundan Bajuband',
        price: '₹899',
        type: 'Armlet',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.2) brightness(1.15) saturate(1.2)',
        description: 'Kundan bajuband armlet with adjustable chain for upper arm.'
    },
    {
        name: 'Toe Ring Set',
        price: '₹199',
        type: 'Toe Ring',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.3,
        filter: 'grayscale(0.3) brightness(1.3) contrast(1.1)',
        description: 'Set of 4 adjustable silver toe rings with traditional design.'
    },
    {
        name: 'Hand Harness (Haath Phool)',
        price: '₹999',
        type: 'Hand Harness',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.5,
        filter: 'sepia(0.15) saturate(1.3) brightness(1.1)',
        description: 'Bridal hand harness connecting ring to bracelet with kundan chain.'
    },
    {
        name: 'Charm Bracelet',
        price: '₹399',
        type: 'Bracelet',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955707/vistara_earrings/earring5.png',
        isDangle: false,
        scale: 0.45,
        filter: 'brightness(1.2) contrast(1.1)',
        description: 'Trendy charm bracelet with heart, star, and moon pendants.'
    },
    {
        name: 'Temple Pendant Chain',
        price: '₹999',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955703/vistara_earrings/earring1.png',
        isDangle: false,
        scale: 0.6,
        filter: 'sepia(0.3) brightness(1.1) saturate(1.2)',
        description: 'Simple temple pendant on gold chain, perfect for daily pooja wear.'
    },
    {
        name: 'Choker AD Set',
        price: '₹1,499',
        type: 'Necklace Set',
        image: 'https://res.cloudinary.com/dfen2mxla/image/upload/v1772955704/vistara_earrings/earring2.png',
        isDangle: false,
        scale: 0.6,
        filter: 'brightness(1.3) contrast(1.2)',
        description: 'Elegant American diamond choker set with matching studs.'
    },
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
        console.log(`Successfully seeded ${PRODUCTS.length} products (5 original + ${PRODUCTS.length - 5} from @_beautybliz_).`);
    } catch (err) {
        console.error('Error seeding DB:', err);
    } finally {
        await client.end();
    }
}

seed();
