// controller to handler Contact model CRUD APIs

// middleware (express async handler) to handle our exceptions inside async express routes
const  asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc List all contacts
//@route GET /api/contacts
//@access private
const listContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, email, phone} = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    // else create contact
    // in ES6 if the key and value are same then we can just use key
    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    })
    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const retrieveContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    if (contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("Current user does not have permission to retrieve other user contacts");
    }

    // else return contact
    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    // adding check for user
    if (contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("Current user does not have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(201).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    // adding check for user
    if (contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("Current user does not have permission to delete other user contacts");
    }

    await contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = {
    listContacts, 
    createContact, 
    retrieveContact,
    updateContact, 
    deleteContact,
};


