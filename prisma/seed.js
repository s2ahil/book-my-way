import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main() {
  let seats = [];

  // 11 rows of 7 seats each
  for (let row = 1; row <= 11; row++) {
    for (let seat = 1; seat <= 7; seat++) {
      seats.push({ row, seat, isBooked: false });
    }
  }

  // Last row (Row 12) has only 3 seats
  for (let seat = 1; seat <= 3; seat++) {
    seats.push({ row: 12, seat, isBooked: false });
  }

  // Insert seats into the database
  await prisma.seat.createMany({
    data: seats,
  });

  console.log("✅ Successfully inserted 80 seats into the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//   npx prisma db seed