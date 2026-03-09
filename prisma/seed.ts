import { AdminRole, ListingStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_DEV_PASSWORD_HASH =
  "scrypt$welcom-sudak-dev-salt$fc876d6bef7b9854027aaaf86d6ce8c6071d34417956906bf57ff452e90b7593fd7c52b00bad068418722dc5102ac3f222713e323bc665aa2bf5d952bcbd7644";

const categories = [
  { slug: "attractions", title: "Достопримечательности", sortOrder: 1 },
  { slug: "food", title: "Еда", sortOrder: 2 },
  { slug: "shops", title: "Магазины", sortOrder: 3 },
  { slug: "services", title: "Сервисы", sortOrder: 4 },
] as const;

const subcategoriesByCategory: Record<string, Array<{ slug: string; title: string; sortOrder: number }>> = {
  attractions: [
    { slug: "nature", title: "Природа", sortOrder: 1 },
    { slug: "culture", title: "Культура", sortOrder: 2 },
  ],
  food: [
    { slug: "cafes", title: "Кафе", sortOrder: 1 },
    { slug: "restaurants", title: "Рестораны", sortOrder: 2 },
  ],
  shops: [
    { slug: "souvenirs", title: "Сувениры", sortOrder: 1 },
    { slug: "grocery", title: "Продукты", sortOrder: 2 },
  ],
  services: [
    { slug: "auto", title: "Автоуслуги", sortOrder: 1 },
    { slug: "health", title: "Здоровье", sortOrder: 2 },
  ],
};

type ListingSeed = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  subcategorySlug?: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  priceLabel?: string;
  priceFrom?: number;
  priceTo?: number;
  workingHoursText?: string;
  hasDelivery?: boolean;
  hasTakeaway?: boolean;
  isFeatured?: boolean;
  status?: ListingStatus;
  coverImageUrl?: string;
  images: Array<{ url: string; alt?: string }>;
};

const listings: ListingSeed[] = [
  {
    slug: "genuezskaya-krepost",
    title: "Генуэзская крепость",
    shortDescription: "Главный исторический символ Судака.",
    description: "Крепость на горе с панорамными видами и музейной инфраструктурой.",
    categorySlug: "attractions",
    subcategorySlug: "culture",
    district: "Центр",
    address: "ул. Генуэзская крепость, 1",
    latitude: 44.8434,
    longitude: 34.9582,
    workingHoursText: "Ежедневно 09:00-20:00",
    isFeatured: true,
    status: ListingStatus.published,
    coverImageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    images: [
      { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", alt: "Крепость общий вид" },
      { url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c", alt: "Стены крепости" },
    ],
  },
  {
    slug: "mys-alchak",
    title: "Мыс Алчак",
    shortDescription: "Маршрут для прогулки и фото.",
    description: "Экотропа с видами на бухту, подходит для самостоятельного посещения.",
    categorySlug: "attractions",
    subcategorySlug: "nature",
    district: "Алчак",
    latitude: 44.8331,
    longitude: 34.9963,
    workingHoursText: "Круглосуточно",
    status: ListingStatus.published,
    coverImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    images: [
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", alt: "Вид с мыса" },
      { url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda", alt: "Тропа на Алчаке" },
    ],
  },
  {
    slug: "gora-sokol",
    title: "Гора Сокол",
    shortDescription: "Популярная точка для активного отдыха.",
    description: "Маршруты разной сложности, открываются виды на Новый Свет и бухты.",
    categorySlug: "attractions",
    subcategorySlug: "nature",
    district: "Новый Свет",
    workingHoursText: "Светлое время суток",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", alt: "Гора Сокол" },
      { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", alt: "Тропа в горах" },
    ],
  },
  {
    slug: "kafe-bereg",
    title: "Кафе Берег",
    shortDescription: "Легкие блюда и кофе у набережной.",
    description: "Кафе с летней верандой, завтраки и местные десерты.",
    categorySlug: "food",
    subcategorySlug: "cafes",
    district: "Набережная",
    address: "Набережная, 12",
    phone: "+7 978 000-00-01",
    hasTakeaway: true,
    priceLabel: "Средний чек",
    priceFrom: 500,
    priceTo: 1000,
    workingHoursText: "Ежедневно 08:00-23:00",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", alt: "Интерьер кафе" },
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", alt: "Кофе и десерт" },
    ],
  },
  {
    slug: "restoran-arka",
    title: "Ресторан Арка",
    shortDescription: "Семейный ресторан с морской кухней.",
    description: "Меню из морепродуктов и локальной кухни, вечерние столики по брони.",
    categorySlug: "food",
    subcategorySlug: "restaurants",
    district: "Центр",
    address: "ул. Ленина, 7",
    phone: "+7 978 000-00-02",
    websiteUrl: "https://example.com/arka",
    hasDelivery: true,
    hasTakeaway: true,
    priceLabel: "Средний чек",
    priceFrom: 1200,
    priceTo: 2500,
    workingHoursText: "Ежедневно 11:00-00:00",
    isFeatured: true,
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", alt: "Зал ресторана" },
      { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe", alt: "Подача блюд" },
    ],
  },
  {
    slug: "pizza-volna",
    title: "Пицца Волна",
    shortDescription: "Быстрая пицца для пляжного перекуса.",
    description: "Пиццерия рядом с пляжем, удобный формат takeaway.",
    categorySlug: "food",
    subcategorySlug: "cafes",
    district: "Набережная",
    phone: "+7 978 000-00-03",
    hasDelivery: true,
    hasTakeaway: true,
    priceLabel: "Средний чек",
    priceFrom: 400,
    priceTo: 900,
    workingHoursText: "Ежедневно 10:00-22:00",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1513104890138-7c749659a591", alt: "Пицца в коробке" },
      { url: "https://images.unsplash.com/photo-1594007654729-407eedc4be65", alt: "Витрина пиццерии" },
    ],
  },
  {
    slug: "lavka-suvenirov-bukhta",
    title: "Лавка Сувениров Бухта",
    shortDescription: "Подарки и памятные вещи из Крыма.",
    description: "Магазин с магнитами, керамикой и локальными сувенирами.",
    categorySlug: "shops",
    subcategorySlug: "souvenirs",
    district: "Центр",
    address: "ул. Морская, 5",
    workingHoursText: "Ежедневно 09:00-21:00",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", alt: "Полки с сувенирами" },
      { url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef", alt: "Подарочные наборы" },
    ],
  },
  {
    slug: "market-u-doma",
    title: "Маркет У Дома",
    shortDescription: "Продукты и базовые товары ежедневно.",
    description: "Небольшой продуктовый магазин рядом с жилым кварталом.",
    categorySlug: "shops",
    subcategorySlug: "grocery",
    district: "Спальный район",
    address: "ул. Победы, 18",
    workingHoursText: "Ежедневно 07:00-23:00",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1542838132-92c53300491e", alt: "Продуктовые ряды" },
      { url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58", alt: "Кассовая зона" },
    ],
  },
  {
    slug: "sto-sudak-auto",
    title: "СТО Sudak Auto",
    shortDescription: "Базовое обслуживание и срочный ремонт.",
    description: "Диагностика, шиномонтаж и экспресс-ремонт для туристов.",
    categorySlug: "services",
    subcategorySlug: "auto",
    district: "Выезд из города",
    address: "ул. Транспортная, 3",
    phone: "+7 978 000-00-04",
    websiteUrl: "https://example.com/sudak-auto",
    workingHoursText: "Пн-Сб 09:00-19:00",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc", alt: "Сервисная зона" },
      { url: "https://images.unsplash.com/photo-1613214149922-f1809c99b414", alt: "Ремонт авто" },
    ],
  },
  {
    slug: "apteka-24",
    title: "Аптека 24",
    shortDescription: "Круглосуточная аптека рядом с центром.",
    description: "Лекарства, товары первой необходимости и консультация фармацевта.",
    categorySlug: "services",
    subcategorySlug: "health",
    district: "Центр",
    address: "ул. Курортная, 9",
    phone: "+7 978 000-00-05",
    workingHoursText: "Круглосуточно",
    status: ListingStatus.published,
    images: [
      { url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88", alt: "Витрина аптеки" },
      { url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de", alt: "Ассортимент аптечки" },
    ],
  },
];

async function main() {
  await prisma.adminUser.upsert({
    where: { email: "admin@welcom-sudak.local" },
    update: {
      name: "Welcome Sudak Admin",
      passwordHash: ADMIN_DEV_PASSWORD_HASH,
      role: AdminRole.admin,
      isActive: true,
    },
    create: {
      email: "admin@welcom-sudak.local",
      name: "Welcome Sudak Admin",
      passwordHash: ADMIN_DEV_PASSWORD_HASH,
      role: AdminRole.admin,
      isActive: true,
    },
  });

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        title: category.title,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        slug: category.slug,
        title: category.title,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
    categoryIds.set(category.slug, upserted.id);
  }

  const subcategoryIds = new Map<string, string>();
  for (const category of categories) {
    const categoryId = categoryIds.get(category.slug);
    if (!categoryId) continue;

    const subcategories = subcategoriesByCategory[category.slug] ?? [];
    for (const subcategory of subcategories) {
      const upserted = await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId,
            slug: subcategory.slug,
          },
        },
        update: {
          title: subcategory.title,
          sortOrder: subcategory.sortOrder,
          isActive: true,
        },
        create: {
          categoryId,
          slug: subcategory.slug,
          title: subcategory.title,
          sortOrder: subcategory.sortOrder,
          isActive: true,
        },
      });
      subcategoryIds.set(`${category.slug}:${subcategory.slug}`, upserted.id);
    }
  }

  const seededListingIds: string[] = [];
  for (const listing of listings) {
    const categoryId = categoryIds.get(listing.categorySlug);
    if (!categoryId) continue;

    const subcategoryId = listing.subcategorySlug
      ? subcategoryIds.get(`${listing.categorySlug}:${listing.subcategorySlug}`)
      : undefined;

    const upserted = await prisma.listing.upsert({
      where: { slug: listing.slug },
      update: {
        title: listing.title,
        shortDescription: listing.shortDescription,
        description: listing.description,
        categoryId,
        subcategoryId: subcategoryId ?? null,
        district: listing.district ?? null,
        address: listing.address ?? null,
        latitude: listing.latitude,
        longitude: listing.longitude,
        phone: listing.phone ?? null,
        websiteUrl: listing.websiteUrl ?? null,
        instagramUrl: listing.instagramUrl ?? null,
        priceLabel: listing.priceLabel ?? null,
        priceFrom: listing.priceFrom ?? null,
        priceTo: listing.priceTo ?? null,
        workingHoursText: listing.workingHoursText ?? null,
        hasDelivery: listing.hasDelivery ?? false,
        hasTakeaway: listing.hasTakeaway ?? false,
        isFeatured: listing.isFeatured ?? false,
        status: listing.status ?? ListingStatus.published,
        coverImageUrl: listing.coverImageUrl ?? null,
        images: {
          deleteMany: {},
          create: listing.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: index,
          })),
        },
      },
      create: {
        slug: listing.slug,
        title: listing.title,
        shortDescription: listing.shortDescription,
        description: listing.description,
        categoryId,
        subcategoryId: subcategoryId ?? null,
        district: listing.district ?? null,
        address: listing.address ?? null,
        latitude: listing.latitude,
        longitude: listing.longitude,
        phone: listing.phone ?? null,
        websiteUrl: listing.websiteUrl ?? null,
        instagramUrl: listing.instagramUrl ?? null,
        priceLabel: listing.priceLabel ?? null,
        priceFrom: listing.priceFrom ?? null,
        priceTo: listing.priceTo ?? null,
        workingHoursText: listing.workingHoursText ?? null,
        hasDelivery: listing.hasDelivery ?? false,
        hasTakeaway: listing.hasTakeaway ?? false,
        isFeatured: listing.isFeatured ?? false,
        status: listing.status ?? ListingStatus.published,
        coverImageUrl: listing.coverImageUrl ?? null,
        images: {
          create: listing.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: index,
          })),
        },
      },
      include: { images: true },
    });

    seededListingIds.push(upserted.id);
  }

  await prisma.issueReport.deleteMany({
    where: {
      listingId: { in: seededListingIds },
    },
  });

  const issueTargets = [
    { slug: "kafe-bereg", type: "outdated_hours", message: "Расписание на двери отличается от карточки." },
    { slug: "market-u-doma", type: "wrong_address", message: "Магазин переехал на соседнюю улицу." },
    { slug: "sto-sudak-auto", type: "phone_unreachable", message: "Номер не отвечает в рабочее время." },
  ];

  for (const issue of issueTargets) {
    const listing = await prisma.listing.findUnique({ where: { slug: issue.slug }, select: { id: true } });
    if (!listing) continue;

    await prisma.issueReport.create({
      data: {
        listingId: listing.id,
        type: issue.type,
        message: issue.message,
        contact: "demo-user@example.com",
      },
    });
  }

  console.log("Seed completed: 4 categories, 8 subcategories, 10 listings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
