// Insert One
db.students.insertOne({
  _id: "S001",
  name: "Zahrul",
  Gender: "M",
  age: 23,
  joinDate: new Date("1998-07-03"),
  idCard: "111",
  senior: true,
})

// Insert Many
db.students.insertMany(
  [
    {
      name: "Ayu",
      Gender: "F",
      age: 23,
      joinDate: new Date("1998-07-03"),
      idCard: "222",
      senior: true,
    },
    {
      name: "Jeremny",
      Gender: "M",
      age: 23,
      joinDate: new Date("1998-07-03"),
      idCard: "333",
      senior: true,
    },
  ]
)

// Comparison Operator | =, > , <, >= , <=, in, !=, not in
// MongoDB             | $eq, $gt, $lt, $gte, $lte, $in, $ne, $nin

// db.collection.find({ field: { $operator: "value" } })

// Mencari age >= 20
// SELECT * FROM students WHERE age >= 20
db.students.find(
  {
    age: {
      $gte: 26
    }
  })

// Find Custom Field
// SELECT name, gender, skill FROM students WHERE age >= 26
// projection
db.students.find(
  {
    age: {
      $gte: 26
    }
  },
  {
    name: 1, // ditampilkan
    gender: 1,
    skill: 1,
    _id: 0, // tidak di tampilkan
  }
)

// SELECT * FROM students WHERE joinDate = "1995-07-03" 
db.students.find(
  {
    joinDate: {
      $eq: ISODate("1995-07-03")
    }
  })

// Find Between Date
db.students.find(
  {
    joinDate: {
      $gte: ISODate("1994-12-12"),
      $lte: ISODate("1996-12-12")
    }
  })


// Find And OR
// SELECT * from student WHERE (gender='M' and age=25) or (gender='F' and age=19)
db.student.find(
  {
    $or: [
      {
        $and: [
          {
            gender: "M"
          },
          {
            age: 25
          }
        ]
      },
      {
        $and: [
          {
            gender: "F"
          },
          {
            age: 19
          }
        ]
      }
    ]
  })

// Regex -> seperti like di RDBMS
// SELECT * FROM student WHERE name like 'B%' (diawali huruf b)
db.student.find(
  {
    name: {
      $regex: /^b/i
    }
  }
)

// SELECT * FROM student WHERE name like '%A' (diakhir huruf A)
db.student.find(
  {
    name: {
      $regex: /a$/i
    }
  }
).pretty()

// SELECT * FROM student WHERE name like '%A%' (mengandung / memikiliki huruf A)
db.student.find(
  {
    name: {
      $regex: "a"
    }
  }
).pretty()

// Pagination
// Ada limit, offset x skip
db.student.find().limit(2) // Halaman 1 maksimal 2 record
db.student.find().skip(2).limit(2) // Halaman 2 maksimal 2 record
db.student.find().skip(4).limit(2) // Halaman 3 maksimal 2 record

// SORT (sort)
// Ascending (1) & Descending (-1)
// dia akan get all dulu setelah itu sorting, setelahnya baru di limit dan skip
db.student.find().skip(2).limit(3).sort({ name: 1 }) // order by name asc

// in
// SELECT * FROM student where age in (19, 25)
db.student.find({
  age: {
    $in: [19, 25]
  }
})

// SELECT * FROM student where age > 25
db.student.find({
  age: {
    $gt: 25
  }
})

// Mencari umur yang lebih dari 25 dan gender nya F ?
// SELECT * FROM student where age > 25 and gender = 'F'
db.student.find({
  age: {
    $gt: 25
  }
}, { gender: "f" }
)

db.student.find({
  $and: [
    {
      "age": {
        $not: {
          $in: [25]
        }
      }
    },
    {
      "gender": {
        $eq: "F"
      }
    }
  ]
})

// Rentang umur
// SELECT * FROM student where age between 20 and 25
db.student.find({
  "age": {
    $gte: 20,
    $lte: 25
  }
})

// Menampilkan field tertentu
// SELECT id, name, age FROM student
// mongodb: 1 (ditampilkan) | 0 (tidak di tampilkan) -> Projection
// _id di mongo selalu di tampilkan, untuk mengatasinya bisa menggunakan projection: _id: 0
db.student.find({}, { _id: 0, name: 1, age: 1 })

// Query Performance
db.student.find({
  "age": {
    $in: [19, 25]
  }
}).explain("executionStats")

// Biasanya di SQL ketika ingin melakukan query performance kita bisa menambahkan index-ing di field
// Fungsinya index tsb bisa meningkatkan kecepatan ketika melakukan query
db.student.createIndex({ age: 1 })