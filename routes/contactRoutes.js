const express = require("express");
const router = express.Router();
const {
    listContacts, 
    createContact, 
    retrieveContact, 
    updateContact, 
    deleteContact
} = require("../controllers/contactController");

router.route("/").get(listContacts).post(createContact);
router.route("/:id").get(retrieveContact).put(updateContact).delete(deleteContact);

module.exports = router;