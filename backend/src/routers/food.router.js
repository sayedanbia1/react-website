import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';

const router = Router();

router.get(
  '/',
  handler(async (req, res) => {
    const PAGE_SIZE= 20;
    const page =parseInt(req.query.page || "0");
    const foods = await FoodModel.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
    res.send(foods);
  })
);

router.get(
  '/tags',
  handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: '$tags',
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);

    res.send(tags);
  })
);

router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, 'i');

    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const foods = await FoodModel.find({ tags: tag });
    res.send(foods);
  })
);

router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
    res.send(food);
  })
);

export default router;
