// routes to handle contact model URLs

const express = require("express");
const router = express.Router();
const {
    listContacts, 
    createContact, 
    retrieveContact, 
    updateContact, 
    deleteContact
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

// using validateToken middleware to validate token on all the urls
router.use(validateToken);
router.route("/").get(listContacts).post(createContact);
router.route("/:id").get(retrieveContact).put(updateContact).delete(deleteContact);

module.exports = router;