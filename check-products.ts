import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  console.log('Checking all products and their codes...\n');
  
  const products = await prisma.product.findMany({
    select: { 
      name: true, 
      code: true,
      category: {
        select: { name: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  console.log(`Found ${products.length} products total:\n`);

  let codesCount = 0;
  const categoryCounts = { AGR: 0, MAR: 0, OTR: 0 };

  products.forEach((product, index) => {
    const codeDisplay = product.code || 'NO CODE';
    const category = product.category?.name || 'Unknown';
    
    console.log(`${(index + 1).toString().padStart(2)}. ${product.name}: ${codeDisplay} (${category})`);
    
    if (product.code) {
      codesCount++;
      const prefix = product.code.split('-')[0];
      if (prefix in categoryCounts) {
        categoryCounts[prefix as keyof typeof categoryCounts]++;
      }
    }
  });

  console.log(`\nSummary:`);
  console.log(`Products with codes: ${codesCount}/${products.length}`);
  console.log(`AGR (Agricultural): ${categoryCounts.AGR}`);
  console.log(`MAR (Marine): ${categoryCounts.MAR}`);
  console.log(`OTR (Other): ${categoryCounts.OTR}`);

  if (codesCount === products.length) {
    console.log(`\nSUCCESS: All products have category-based ERP codes!`);
  } else {
    console.log(`\nWARNING: ${products.length - codesCount} products missing codes`);
  }

  await prisma.$disconnect();
}

checkProducts().catch(console.error);