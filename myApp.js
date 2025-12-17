require('dotenv').config();
var express = require('express');
var app = express();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

// Create the Person model
let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["pizza", "burgers", "sushi"]
  });
  
  person.save(function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  
  // 1. Find the person by ID
  Person.findById(personId, function(err, person) {
    if (err) return done(err);
    if (!person) return done(new Error("Person not found"));
    
    // 2. Add "hamburger" to favoriteFoods array
    person.favoriteFoods.push(foodToAdd);
    
    // 3. Save the updated person
    person.save(function(err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};


const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  
  Person.findOneAndUpdate(
    { name: personName },           
    { age: ageToSet },              
    { new: true },                  
    function(err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  // Use findByIdAndRemove() to delete a person by their _id
  Person.findByIdAndRemove(personId, function(err, removedPerson) {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  
  // Use Model.remove() to delete all people with name "Mary"
  Person.remove({ name: nameToRemove }, function(err, result) {
    if (err) return done(err);
    done(null, result);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  
  // Chain query helpers to build complex query
  Person.find({ favoriteFoods: foodToSearch })  // Find people who like burrito
    .sort({ name: 1 })                         // Sort by name ascending (1 = asc, -1 = desc)
    .limit(2)                                  // Limit to 2 results
    .select('-age')                            // Exclude age field (- means exclude)
    .exec(function(err, data) {                // Execute the query
      if (err) return done(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
