const express = require('express');

const router = express.Router();
// router.use(express.json());
const users_db = require('./userDb');
const post_db = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
    const user = req.body;
    if (user.name) {
        users_db.insert(user)
            .then(user => res.status(201).json(user))
            .catch(err => res.status(500).json({error: "There was an error while saving the user to the database"}))
    } else {
        res.status(400).json({errorMessage: "Please provide name for the user."});
    }
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
    const id = req.params.id;
    const post = req.body;
    users_db.getById(id)
        .then(user => {
            if (post.text) {
                post_db.insert(post)
                    .then(post => res.status(201).json(post))
                    .catch(err => res.status(500).json({error: "There was an error while saving the comment to the database"}))
            } else {
                res.status(400).json({errorMessage: "Please provide text for the comment."})
            }
        })
        .catch(err => res.status(404).json({message: "The user with the specified ID does not exist."}))
});

router.get('/', (req, res) => {
    users_db.get()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({error: "The users information could not be retrieved."}))
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    users_db.getById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404)
                    .json({message: 'The user with the specified ID does not exist.'});
            }
        })
        .catch(err =>
            res.status(500)
                .json({errorMessage: 'The user information could not be retrieved.'}))
});

router.get('/:id/posts', validateUserId, (req, res) => {
    users_db.getUserPosts(req.params.id)
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({error: "The posts information could not be retrieved."}))

});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    if (id) {
        users_db.remove(id)
            .then(user => res.status(200).json(user))
            .catch(err => res.status(500).json({error: "The user could not be removed"}))
    } else {
        res.status(404).json({message: "The post with the specified ID does not exist."});
    }

});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    if (id) {
        if (req.body.name) {
            users_db.update(id, req.body)
                .then(user => res.status(200).json(user))
                .catch(err => res.status(500).json({error: "The post information could not be modified."}))
        } else {
            res.status(400).json({errorMessage: "Please provide name for the user."});
        }
    } else {
        res.status(404).json({message: "The user with the specified ID does not exist."});
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;
    users_db.getById(id)
        .then(user => next())
        .catch(err => res.status(400).json({message: "invalid user id"}));
}

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "missing user data"})
    } else if (!req.body.name) {
        res.status(400).json({message: "missing required name field"})
    }

    next();
}

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "missing post data"})
    } else if (!req.body.text) {
        res.status(400).json({message: "missing required text field"})
    }

    next();
}

module.exports = router;
