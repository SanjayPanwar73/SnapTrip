const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title:joi.string().required(),
        description:joi.string().allow("", null),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.any().required(), // Accept any type (string from form)
        category: joi.any().required() // Accept any type (ObjectId from form)
    }).required()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
       rating: joi.number().required().min(1).max(5),
       comment: joi.string().required(),
    }).required(),
});