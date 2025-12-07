import Sales from '../models/Sales.js';

// @desc    Get all sales with search, filter, sort, and pagination
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res) => {
  try {
    const {
      search,
      customerRegion,
      gender,
      minAge,
      maxAge,
      productCategory,
      tags,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = {};

    // Search functionality (Customer Name or Phone Number)
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by customer region (multi-select)
    if (customerRegion) {
      const regions = customerRegion.split(',');
      query.customerRegion = { $in: regions };
    }

    // Filter by gender (multi-select)
    if (gender) {
      const genders = gender.split(',');
      query.gender = { $in: genders };
    }

    // Filter by age range
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    // Filter by product category (multi-select)
    if (productCategory) {
      const categories = productCategory.split(',');
      query.productCategory = { $in: categories };
    }

    // Filter by tags (multi-select)
    if (tags) {
      const tagList = tags.split(',');
      query.tags = { $in: tagList };
    }

    // Filter by payment method (multi-select)
    if (paymentMethod) {
      const methods = paymentMethod.split(',');
      query.paymentMethod = { $in: methods };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sorting
    let sort = {};
    if (sortBy === 'date-desc') {
      sort.date = -1;
    } else if (sortBy === 'date-asc') {
      sort.date = 1;
    } else if (sortBy === 'quantity-desc') {
      sort.quantity = -1;
    } else if (sortBy === 'quantity-asc') {
      sort.quantity = 1;
    } else if (sortBy === 'name-asc') {
      sort.customerName = 1;
    } else if (sortBy === 'name-desc') {
      sort.customerName = -1;
    } else {
      sort.date = -1; // Default: newest first
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const sales = await Sales.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Sales.countDocuments(query);

    // Calculate summary statistics
    const summaryData = await Sales.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$totalAmount' },
          totalDiscount: { $sum: { $subtract: ['$totalAmount', '$finalAmount'] } },
        },
      },
    ]);

    const summary = summaryData[0] || {
      totalQuantity: 0,
      totalAmount: 0,
      totalDiscount: 0,
    };

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      summary: {
        totalUnitsSold: summary.totalQuantity,
        totalAmount: summary.totalAmount,
        totalDiscount: summary.totalDiscount,
      },
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get filter options
// @route   GET /api/sales/filters
// @access  Private
export const getFilterOptions = async (req, res) => {
  try {
    const regions = await Sales.distinct('customerRegion');
    const genders = await Sales.distinct('gender');
    const categories = await Sales.distinct('productCategory');
    const paymentMethods = await Sales.distinct('paymentMethod');
    const allTags = await Sales.distinct('tags');

    res.status(200).json({
      success: true,
      filters: {
        customerRegions: regions.sort(),
        genders: genders.sort(),
        productCategories: categories.sort(),
        paymentMethods: paymentMethods.sort(),
        tags: allTags.sort(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single sale by ID
// @route   GET /api/sales/:id
// @access  Private
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
