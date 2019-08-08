# Insight Example

## Running the server

### Locally

To run the server locally:

```
npm start
```

To view the Swagger UI interface:

```
open http://localhost:8080/docs
```

### Via Docker

```sh
docker build . -t example-insight
docker run --rm -it -p 5000:5000 example-insight
```

### Heroku

```sh
heroku login
heroku create
git push heroku master
```
