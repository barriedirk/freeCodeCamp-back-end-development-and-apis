import express, { Router} from 'express';
import {inputCleaner, inputValidator} from './middleware.js';

const app = express();
const PORT = 3000;
const router = Router();

router.use(express.urlencoded({ extended: true }));

router.post('/submit', inputCleaner, inputValidator, (req, res) => {
  res.json({
    username: req.body.username,
    comment: req.body.comment
  })
})

app.get('/', (req, res) => {
  res.redirect('/form');
});

app.use('/form', express.static('public'));
app.use('/', router);

app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});