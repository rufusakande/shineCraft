import { Request, Response } from 'express';
import { Category } from '../models';
import { ApiError, formatResponse, formatError } from '../utils/api.utils';
import { Op } from 'sequelize';

class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        throw new ApiError(400, 'Name is required');
      }

      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const category = await Category.create({
        name,
        slug,
        description,
      });

      return res.status(201).json(formatResponse(category));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to create category'));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      if (name) {
        category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        category.name = name;
      }
      if (description !== undefined) {
        category.description = description;
      }

      await category.save();
      return res.json(formatResponse(category));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to update category'));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      await category.destroy();
      return res.json(formatResponse({ message: 'Category deleted successfully' }));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to delete category'));
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const where = search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      } : {};

      const categories = await Category.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });

      return res.json(formatResponse(categories));
    } catch (error) {
      return res.status(500).json(formatError('Failed to fetch categories'));
    }
  }
}

export default new CategoryController();