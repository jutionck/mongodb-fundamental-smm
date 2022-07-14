db.teachers.insertMany(
  [
    { name: 'Edo', subjects: ['Golang', 'React', 'Flutter'], senior: true },
    { name: 'Jution', subjects: ['Golang', 'Angular', 'PHP'], senior: true },
    { name: 'Fadley', subjects: ['Java', 'JavaScript', 'Flutter'], senior: false },
    { name: 'Tika', subjects: ['Java', 'React', 'Flutter', 'React Native', 'Angular'], senior: true },
    { name: 'Doni', subjects: ['Java', 'React', 'Android Kotlin'], senior: false },
    { name: 'Rifqi', subjects: ['Java', 'React'], senior: false },
  ]
);

// Menghitung jumlah pengajar yang bisa Golang
db.teachers.find({
  subjects: {
    $regex: "Golang"
  }
}).count()

// Menghitung jumlah pengajar yang bisa Golang atau Flutter
db.teachers.find({
  subjects: {
    $in: ["Golang", "Flutter"]
  }
}).count()

// Mencari semua pengajar yang bisa Java dan Flutter 
db.teachers.find({
  subjects: {
    $all: ["Java", "Flutter"]
  }
})

// Mencari pengajar yang memiliki 3 bahasa
db.teachers.find({
  subjects: {
    $size: 3
  }
})

// Menambahkan bahasa baru, Rifqi -> Flutter
db.teachers.updateOne(
  { name: 'Rifqi' },
  {
    $addToSet: {
      subjects: 'Flutter'
    }
  }
)