const { Product, Category, Subcategory } = require("../models");
const { Op } = require("sequelize");

async function index(req, res) {
  try {
    const { 
      categoryId, 
      subcategoryId, 
      includeCategory, 
      includeSubcategory,
      search,
      discountedOnly,
      page = 1,
      limit = 50
    } = req.query;
    
    const whereCondition = { isActive: true };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }
    if (subcategoryId) {
      whereCondition.subcategoryId = subcategoryId;
    }
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (discountedOnly === 'true') {
      whereCondition.discountPercentage = { [Op.gt]: 0 };
    }
    
    const includeOptions = [];

    if (includeCategory === 'true') {
      includeOptions.push({
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      });
    }

    if (includeSubcategory === 'true') {
      includeOptions.push({
        model: Subcategory,
        as: 'subcategory',
        attributes: ['id', 'name'],
        required: false
      });
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      include: includeOptions,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      message: "Productos obtenidos exitosamente",
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error en index products:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

async function show(req, res) {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      message: "Producto obtenido exitosamente",
      data: product
    });

  } catch (error) {
    console.error('Error en show product:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

async function store(req, res) {
  try {
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      subcategoryId, 
      stock = 0,
      imageUrl,
      isActive = true,
      discountPercentage = 0
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        error: "Nombre, precio y categoría son requeridos"
      });
    }

    if (price < 0) {
      return res.status(400).json({
        error: "El precio no puede ser negativo"
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: "El stock no puede ser negativo"
      });
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({
        error: "El descuento debe estar entre 0 y 100"
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        error: "La categoría especificada no existe"
      });
    }

    if (subcategoryId) {
      const subcategory = await Subcategory.findByPk(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          error: "La subcategoría especificada no existe"
        });
      }

      if (subcategory.categoryId !== categoryId) {
        return res.status(400).json({
          error: "La subcategoría no pertenece a la categoría especificada"
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      subcategoryId,
      stock,
      imageUrl,
      isActive,
      discountPercentage
    });

    const productWithRelations = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      data: productWithRelations
    });

  } catch (error) {
    console.error('Error en store product:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      subcategoryId, 
      stock,
      imageUrl,
      isActive,
      discountPercentage
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        error: "El precio no puede ser negativo"
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        error: "El stock no puede ser negativo"
      });
    }

    if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
      return res.status(400).json({
        error: "El descuento debe estar entre 0 y 100"
      });
    }

    if (categoryId && categoryId !== product.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({
          error: "La categoría especificada no existe"
        });
      }
    }

    if (subcategoryId !== undefined) {
      if (subcategoryId) {
        const subcategory = await Subcategory.findByPk(subcategoryId);
        if (!subcategory) {
          return res.status(400).json({
            error: "La subcategoría especificada no existe"
          });
        }
        
        const finalCategoryId = categoryId || product.categoryId;
        if (subcategory.categoryId !== finalCategoryId) {
          return res.status(400).json({
            error: "La subcategoría no pertenece a la categoría especificada"
          });
        }
      }
    }

    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      categoryId: categoryId || product.categoryId,
      subcategoryId: subcategoryId !== undefined ? subcategoryId : product.subcategoryId,
      stock: stock !== undefined ? stock : product.stock,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
      isActive: isActive !== undefined ? isActive : product.isActive,
      discountPercentage: discountPercentage !== undefined ? discountPercentage : product.discountPercentage
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.json({
      message: "Producto actualizado exitosamente",
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error en update product:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    await product.update({ isActive: false });

    res.json({
      message: "Producto eliminado exitosamente"
    });

  } catch (error) {
    console.error('Error en destroy product:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

async function updateStock(req, res) {
  try {
    const { id } = req.params;
    const { stock, operation = 'set' } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        error: "El stock debe ser un número positivo"
      });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    let newStock;
    
    switch (operation) {
      case 'add':
        newStock = product.stock + parseInt(stock);
        break;
      case 'subtract':
        newStock = product.stock - parseInt(stock);
        if (newStock < 0) {
          return res.status(400).json({
            error: "No hay suficiente stock para esta operación"
          });
        }
        break;
      case 'set':
      default:
        newStock = parseInt(stock);
        break;
    }

    await product.update({ stock: newStock });

    res.json({
      message: "Stock actualizado exitosamente",
      data: {
        id: product.id,
        name: product.name,
        previousStock: product.stock,
        newStock: newStock,
        operation: operation
      }
    });

  } catch (error) {
    console.error('Error en updateStock product:', error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  updateStock,
};
