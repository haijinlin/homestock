const isLocal = process.env.DATABASE_URL?.startsWith("file:");
const { PrismaClient } = isLocal
  ? require("@prisma/client")
  : require("../node_modules/@prisma/postgres-client");

const prisma = new PrismaClient();

const defaultCategories = [
  "Bathroom",
  "Cleaning",
  "Kitchen",
  "Laundry",
  "Pantry",
  "Personal care",
  "Other",
];

const householdSupplies = [
  {
    name: "Laundry detergent",
    category: "Laundry",
    quantity: 2,
    unit: "bottles",
    minStock: 1,
    location: "Laundry cupboard",
    notes: "General-purpose liquid detergent",
  },
  {
    name: "Hand wash",
    category: "Personal care",
    quantity: 3,
    unit: "bottles",
    minStock: 1,
    location: "Bathroom cupboard",
    notes: "Refill bottles",
  },
  {
    name: "Shampoo",
    category: "Personal care",
    quantity: 2,
    unit: "bottles",
    minStock: 1,
    location: "Bathroom cupboard",
    notes: null,
  },
  {
    name: "Body wash",
    category: "Personal care",
    quantity: 2,
    unit: "bottles",
    minStock: 1,
    location: "Bathroom cupboard",
    notes: null,
  },
  {
    name: "Toothpaste",
    category: "Personal care",
    quantity: 3,
    unit: "tubes",
    minStock: 1,
    location: "Bathroom cupboard",
    notes: null,
  },
  {
    name: "Toilet paper",
    category: "Bathroom",
    quantity: 12,
    unit: "rolls",
    minStock: 6,
    location: "Linen cupboard",
    notes: null,
  },
  {
    name: "Kitchen paper",
    category: "Kitchen",
    quantity: 4,
    unit: "rolls",
    minStock: 2,
    location: "Kitchen pantry",
    notes: null,
  },
  {
    name: "Tissues",
    category: "Bathroom",
    quantity: 4,
    unit: "boxes",
    minStock: 2,
    location: "Linen cupboard",
    notes: null,
  },
  {
    name: "Dishwashing liquid",
    category: "Kitchen",
    quantity: 2,
    unit: "bottles",
    minStock: 1,
    location: "Under kitchen sink",
    notes: null,
  },
  {
    name: "Garbage bags",
    category: "Kitchen",
    quantity: 2,
    unit: "rolls",
    minStock: 1,
    location: "Under kitchen sink",
    notes: "Kitchen bin size",
  },
  {
    name: "Dental floss",
    category: "Personal care",
    quantity: 2,
    unit: "packs",
    minStock: 1,
    location: "Bathroom cupboard",
    notes: null,
  },
  {
    name: "Cleaning spray",
    category: "Cleaning",
    quantity: 2,
    unit: "bottles",
    minStock: 1,
    location: "Cleaning cupboard",
    notes: "Multi-purpose surface cleaner",
  },
];

async function main() {
  for (const name of defaultCategories) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (!existing) await prisma.category.create({ data: { name } });
  }

  let created = 0;

  for (const item of householdSupplies) {
    const existing = await prisma.item.findFirst({
      where: { name: item.name },
      select: { id: true },
    });

    if (!existing) {
      await prisma.item.create({ data: item });
      created += 1;
    }
  }

  console.log(
    `Seed complete: created ${created}, skipped ${householdSupplies.length - created}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
