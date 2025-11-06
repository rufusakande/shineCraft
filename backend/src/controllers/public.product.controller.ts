import { Request, Response } from 'express';
import { Product, Category } from '../models';
import { ApiError, formatResponse, formatError } from '../utils/api.utils';
import { Op } from 'sequelize';

class PublicProductController {
  async list(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        categoryId,
        search,
        sort = 'newest',
        minPrice,
        maxPrice,
      } = req.query;

      const where: any = {};
      
      // Search filter
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      // Category filter
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = minPrice;
        if (maxPrice) where.price[Op.lte] = maxPrice;
      }

      // Sorting
      let order: any[];
      switch (sort) {
        case 'price-asc':
          order = [['price', 'ASC']];
          break;
        case 'price-desc':
          order = [['price', 'DESC']];
          break;
        case 'oldest':
          order = [['createdAt', 'ASC']];
          break;
        default: // 'newest'
          order = [['createdAt', 'DESC']];
      }

      const products = await Product.findAndCountAll({
        where,
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }],
        order,
        limit: +limit,
        offset: (+page - 1) * +limit,
        attributes: {
          exclude: ['categoryId', 'updatedAt']
        }
      });

      return res.json(formatResponse({
        items: products.rows,
        meta: {
          total: products.count,
          page: +page,
          totalPages: Math.ceil(products.count / +limit),
          hasMore: (+page * +limit) < products.count
        }
      }));
    } catch (error) {
      return res.status(500).json(formatError('Failed to fetch products'));
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      const product = await Product.findOne({
        where: { slug },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }],
        attributes: {
          exclude: ['categoryId', 'updatedAt']
        }
      });

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      return res.json(formatResponse(product));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to fetch product'));
    }
  }
}

export default new PublicProductController();