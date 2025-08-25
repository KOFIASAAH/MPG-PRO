import { PrismaClient, Role, AssayMethod, CashDisbursementStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Branches
  const tarkwa = await prisma.branch.upsert({
    where: { code: 'TKA' },
    update: {},
    create: { name: 'Tarkwa', code: 'TKA', location: 'Tarkwa, Western Region' },
  })

  const obuasi = await prisma.branch.upsert({
    where: { code: 'OBS' },
    update: {},
    create: { name: 'Obuasi', code: 'OBS', location: 'Obuasi, Ashanti Region' },
  })

  const prestea = await prisma.branch.upsert({
    where: { code: 'PRA' },
    update: {},
    create: { name: 'Prestea', code: 'PRA', location: 'Prestea, Western Region' },
  })

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.ADMIN,
      hashedPassword,
    },
  })

  const hof = await prisma.user.upsert({
    where: { email: 'hof@example.com' },
    update: {},
    create: {
      email: 'hof@example.com',
      name: 'Head of Finance',
      role: Role.HEAD_OF_FINANCE,
      hashedPassword,
    },
  })

  const bm_tarkwa = await prisma.user.upsert({
    where: { email: 'bm_tarkwa@example.com' },
    update: {},
    create: {
      email: 'bm_tarkwa@example.com',
      name: 'Branch Manager (Tarkwa)',
      role: Role.BRANCH_MANAGER,
      branchId: tarkwa.id,
      hashedPassword,
    },
  })

  const teller_tarkwa = await prisma.user.upsert({
      where: { email: 'teller_tarkwa@example.com' },
      update: {},
      create: {
          email: 'teller_tarkwa@example.com',
          name: 'Teller (Tarkwa)',
          role: Role.TELLER,
          branchId: tarkwa.id,
          hashedPassword,
      },
  })

  // Create RateBoard entries
  for (let i = 0; i < 8; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    await prisma.rateBoard.create({
      data: {
        effectiveDate: date,
        pricePerGram: 700.00 - i * 5,
        notes: `Rate for ${date.toDateString()}`,
      },
    })
  }

  // Create sample transactions
  await prisma.cashDisbursement.create({
      data: {
          branchId: tarkwa.id,
          amount: 50000,
          referenceNo: 'CASH001',
          issuedByUserId: hof.id,
          approvedByUserId: hof.id,
          status: CashDisbursementStatus.DISBURSED,
      }
  })

  await prisma.goldReceipt.create({
      data: {
          branchId: tarkwa.id,
          weightGrams: 100.5,
          purityPercent: 92.5,
          pricePerGram: 695.00,
          assayMethod: AssayMethod.XRF,
          receivedByUserId: teller_tarkwa.id,
          images: [],
      }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
