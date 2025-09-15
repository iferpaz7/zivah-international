import { prisma } from '@/lib/prisma';
import {
  Product,
  Category,
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
  PaginatedResponse,
} from '@/types';
import type { Prisma } from '@prisma/client';

export class ProductService {
  // Get paginated products with filters
  static async getProducts(
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    const {
      categoryId,
      isActive,
      isFeatured,
      search,
      minPrice,
      maxPrice,
      origin,
      certifications,
      inStock,
      page = 1,
      pageSize = 10,
    } = filters;

    const where: Prisma.ProductWhereInput = {};

    // Apply filters
    if (categoryId) where.categoryId = categoryId;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;
    if (origin) where.origin = { contains: origin, mode: 'insensitive' };
    if (inStock) where.stockQuantity = { gt: 0 };
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Certifications filter (JSON array contains)
    if (certifications && certifications.length > 0) {
      where.certifications = {
        path: ['$'],
        array_contains: certifications,
      };
    }

    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { quoteItems: true },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: products as Product[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { id: 'asc' },
        },
        quoteItems: {
          include: {
            quote: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return product as Product | null;
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    return product as Product | null;
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return products as Product[];
  }

  // Get products by category
  static async getProductsByCategory(
    categorySlug: string,
    limit?: number
  ): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          slug: categorySlug,
          isActive: true,
        },
      },
      include: {
        category: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      ...(limit && { take: limit }),
    });

    return products as Product[];
  }

  // Create new product
  static async createProduct(data: CreateProductInput): Promise<Product> {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    // Ensure slug is unique
    data.slug = await this.ensureUniqueSlug(data.slug);

    const product = await prisma.product.create({
      data: data as Prisma.ProductCreateInput,
      include: {
        category: true,
      },
    });

    return product as Product;
  }

  // Update product
  static async updateProduct(
    id: number,
    data: UpdateProductInput
  ): Promise<Product> {
    // If name is being updated and no slug provided, regenerate slug
    if (data.name && !data.slug) {
      data.slug = this.generateSlug(data.name);
      data.slug = await this.ensureUniqueSlug(data.slug, id);
    }

    const product = await prisma.product.update({
      where: { id },
      data: data as Prisma.ProductUpdateInput,
      include: {
        category: true,
      },
    });

    return product as Product;
  }

  // Delete product (soft delete)
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Update stock quantity
  static async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
      include: {
        category: true,
      },
    });

    return product as Product;
  }

  // Get low stock products
  static async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: threshold,
          gt: 0,
        },
      },
      include: {
        category: true,
      },
      orderBy: { stockQuantity: 'asc' },
    });

    return products as Product[];
  }

  // Search products with full-text search
  static async searchProducts(
    query: string,
    limit: number = 20
  ): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      take: limit,
    });

    return products as Product[];
  }

  // Get product statistics
  static async getProductStatistics() {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      categoriesCount,
      lowStockCount,
      topSellingProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, isFeatured: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.product.count({
        where: { isActive: true, stockQuantity: { lte: 10, gt: 0 } },
      }),
      prisma.product.findMany({
        include: {
          _count: {
            select: { quoteItems: true },
          },
        },
        orderBy: {
          quoteItems: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    const totalValue = await prisma.product.aggregate({
      where: { isActive: true, basePrice: { not: null } },
      _sum: {
        basePrice: true,
      },
    });

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      categoriesCount,
      totalValue: totalValue._sum.basePrice || 0,
      lowStockProducts: lowStockCount,
      topSellingProducts: topSellingProducts.map((product: any) => ({
        productId: product.id,
        productName: product.name,
        quotesCount: (product as any)._count.quoteItems,
        totalQuantity: 0, // Would need separate query for actual quantities
      })),
    };
  }

  // Utility methods
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  private static async ensureUniqueSlug(
    slug: string,
    excludeId?: number
  ): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const existing = await prisma.product.findFirst({
        where: {
          slug: uniqueSlug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      if (!existing) break;

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}
