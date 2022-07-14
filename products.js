db.products.insertMany(
  [
    {
      _id: 1,
      name: "Macbook Pro 2022",
      price: new NumberLong(22000000),
      category: "laptop"
    },
    {
      _id: 2,
      name: "Lenovo Think Pad i7",
      price: new NumberLong(20000000),
      category: "laptop"
    },
    {
      _id: 3,
      name: "Iphone 13 Pro Max",
      price: new NumberLong(21000000),
      category: "handphone"
    },
    {
      _id: 4,
      name: "Ayam Bakar Madu",
      price: new NumberLong(25000),
      category: "food"
    },
    {
      _id: 5,
      name: "Ice Dolce Latte",
      price: new NumberLong(13000),
      category: "drink"
    }
  ]
)

// Find with in 
// SELECT * FROM products WHERE category in ('food', 'drink') AND price > 10000
db.products.find({
  category: {
    $in: ["food", "drink"]
  },
  price: {
    $gt: 10000
  }
})


// Logical Operator
// AND, OR, NOR, NOT
// $and, $or, $nor, $not

// db.collection.find({ $operator : [ { expression } ] })

db.products.find({
  $and: [
    {
      category: {
        $in: ["food", "drink"]
      },
      price: {
        $gt: 10000
      }
    }
  ]
})

db.products.find({
  category: {
    $not: {
      $in: ["food", "drink"]
    }
  }
})

db.products.find({
  category: {
    $nin: ["food", "drink"]
  }
})

db.products.find({
  $and: [
    {
      $or: [
        {
          category: "food"
        },
        {
          category: "drink"
        }
      ]
    },
    {
      price: {
        $gt: 10000
      }
    }
  ]
})

// Evaluation Operator
// $expr = aggregation operation
// $jsonSchema = Validasi BSON
// $mod = sisa bagi
// $regex = regular expression
// $text = pencarian menggunakan textx
// $where = pengambilan document menggunakan JavaScript Function

// $expr
// SELECT * FROM products WHERE price > 10000
db.products.find({
  $expr: {
    $gt: ["$price", 10000]
  }
})

// $jsonSchema
// SELECT * FROM products WHERE name is not null and category is not null
db.products.find({
  $jsonSchema: {
    required: ["name"],
    properties: {
      price: {
        bsonType: "long"
      }
    }
  }
})

// $mod
// SELECT * FROM products WHERE price % 5 = 0
db.products.find({
  price: {
    $mod: [5, 0]
  }
})

// $regex
db.products.insertMany(
  [
    {
      _id: 6,
      name: "Ayam Bakar Kecap",
      price: new NumberLong(23000),
      category: "food"
    },
    {
      _id: 7,
      name: "Ayam Bakar Taliwang",
      price: new NumberLong(30000),
      category: "food"
    }
  ]
)

// SELECT * FROM product WHERE name ILIKE '%Ayam%'
db.products.find({
  name: {
    $regex: /ayam/,
    $options: "i"
  }
})

// SELECT * FROM product WHERE name LIKE 'A%'
db.products.find({
  name: {
    $regex: /^A/
  }
})

// SELECT * FROM product WHERE name LIKE '%g'
db.products.find({
  name: {
    $regex: /G$/
  }
})

// $text = pencarian berdasarkan wording / kata
// Buat index dahulu
db.products.createIndex({
  name: "text"
})

// SELECT * FROM products WHERE (name like '%ayam%' or name like '%lenovo%') 
db.products.find({
  $text: {
    $search: "ayam lenovo"
  }
})

// SELECT * FROM products WHERE name like '%ayam lenovo%'
db.products.find({
  $text: {
    $search: '"ayam lenovo"'
  }
})

// $where
// SELECT * FROM products WHERE _id = 7
db.products.find({
  $where: function () {
    return this._id == 7
  }
})


// Pagination
// Menampilkan data di halaman 1 dengan record atau document sebanyak 2
db.products.find().limit(2)

// Offset
// Menampilkan dari row setelah 3 sebanyak 5 data
db.products.find().skip(3).limit(5)

// Sort | 1 = ASC | -1 = DESC
db.products.find().skip(3).limit(5).sort({
  name: 1
})

db.products.find().sort({ name: 1 })

// Explain
db.products.find().sort({ name: 1 }).explain("executionStats")

// Embedded Document
db.products.insertMany(
  [
    {
      _id: 8,
      name: "Logitec Mouse Anywhere 3",
      price: new NumberLong(999000),
      category: "gadget",
    },
    {
      _id: 9,
      name: "Uniqlo T-Shirt",
      price: new NumberLong(129000),
      category: "fashion",
      size: {
        h: 100,
        w: 150,
        uom: "cm"
      }
    },
    {
      _id: 10,
      name: "Moc T-Shirt",
      price: new NumberLong(129000),
      category: "fashion",
      size: {
        h: 8.5,
        w: 11,
        uom: "in"
      }
    },
  ])

db.products.find({
  "size.h": {
    $lt: 10,
  },
  "size.uom": "in"
})

// Join

// Aggregation
// count, distinct, sum, group

// Select Count = Hitung Jumlah Row
db.products.countDocuments({})

// Distinct
db.products.distinct("category")

// SUM GROUP BY
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      total: {
        $sum: "$price"
      }
    }
  }
])

// COUNT GROUP BY
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      total: {
        $sum: 1
      }
    }
  }
])

// AVG
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      total: {
        $avg: "$price"
      }
    }
  }
])

// Transaksi: qty & price => price * qty
// SELECT category, sum(price * 5) as subTotal where size.uom = 'cm' group by category order by subTotal desc
db.products.aggregate([
  {
    $match: { "size.uom": "cm" }
  },
  {
    $group: {
      _id: "$category",
      subTotal: {
        $sum: { $multiply: ["$price", 5] }
      }
    }
  },
  {
    $sort: { subTotal: -1 }
  }
])


// WHERE
db.products.aggregate([
  {
    $match: {
      category: "food"
    }
  },
  {
    $group: {
      _id: "$category",
      total: {
        $sum: 1
      }
    }
  }
])


// ARRAY OPERATOR