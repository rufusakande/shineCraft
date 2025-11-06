import { Request, Response } from 'express';
import { Product, Category } from '../models';
import { ApiError, formatResponse, formatError } from '../utils/api.utils';
import { Op } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';

class ProductController {
  async create(req: Request, res: Response) {
    try {
      const { title, description, price, stock, categoryId, sku, featured } = req.body;
      const files = req.files as Express.Multer.File[];

      // Validation
      if (!title) throw new ApiError(400, 'Title is required');
      if (!price || price <= 0) throw new ApiError(400, 'Valid price is required');
      if (!categoryId) throw new ApiError(400, 'Category ID is required');
      if (!sku) throw new ApiError(400, 'SKU is required');

      // Check if category exists
      const category = await Category.findByPk(categoryId);
      if (!category) throw new ApiError(404, 'Category not found');

      // Process images
      const images = req.body.images || [];

      // Generate slug
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const product = await Product.create({
        title,
        slug,
        description,
        price,
        stock: stock || 0,
        categoryId,
        sku,
        featured: featured || false,
        images
      });

      return res.status(201).json(formatResponse(product));
    } catch (error) {
      // Clean up uploaded files if there's an error
      if (req.files) {
        const files = Array.isArray(req.files) ? req.files : [req.files];
        await Promise.all(
          files.map(file =>
            fs.unlink(file.path).catch(() => {})
          )
        );
      }

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to create product'));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, price, stock, categoryId, sku, featured } = req.body;
      const files = req.files as Express.Multer.File[];

      const product = await Product.findByPk(id);
      if (!product) throw new ApiError(404, 'Product not found');

      // Validation
      if (price && price <= 0) throw new ApiError(400, 'Valid price is required');
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) throw new ApiError(404, 'Category not found');
      }

      // Process new images
      let images = product.images;
      if (files && files.length > 0) {
        const newImages = files.map(file => `/uploads/${file.filename}`);
        images = [...product.images, ...newImages];
      }

      // Update product
      if (title) product.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      await product.update({
        title: title || product.title,
        description: description || product.description,
        price: price || product.price,
        stock: stock !== undefined ? stock : product.stock,
        categoryId: categoryId || product.categoryId,
        sku: sku || product.sku,
        featured: featured !== undefined ? featured : product.featured,
        images
      });

      return res.json(formatResponse(product));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to update product'));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) throw new ApiError(404, 'Product not found');

      // Delete associated images
      await Promise.all(
        product.images.map(image =>
          fs.unlink(path.join(__dirname, '../..', image)).catch(() => {})
        )
      );

      await product.destroy();
      return res.json(formatResponse({ message: 'Product deleted successfully' }));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to delete product'));
    }
  }

  async list(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        categoryId,
        minPrice,
        maxPrice,
        featured
      } = req.query;

      const where: any = {};

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (categoryId) where.categoryId = categoryId;
      if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
      if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
      if (featured !== undefined) where.featured = featured === 'true';

      const products = await Product.findAndCountAll({
        where,
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']],
        limit: +limit,
        offset: (+page - 1) * +limit
      });

      return res.json(formatResponse({
        items: products.rows,
        total: products.count,
        page: +page,
        totalPages: Math.ceil(products.count / +limit)
      }));
    } catch (error) {
      return res.status(500).json(formatError('Failed to fetch products'));
    }
  }
}

export default new ProductController();