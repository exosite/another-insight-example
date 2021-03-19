# Insight Example

An example of how to build an External Insight Module (EIM) in nodeJS and built as a Docker container.

This example also adds some boilerplate so that you can skip right to defining the External Insight Module Functions (EIMF).

## Local Debugging

### Directly

To run the server locally:

```sh
npm start
```

To view the Swagger UI interface:

```sh
open http://localhost:8080/docs
```

### Via Docker

```sh
docker build . -t example-insight
docker run --rm -it -p 5000:5000 example-insight
```

## Running

For each platform, we assume that you already have an account, and have installed and configured the tools.

### Heroku

```sh
# 1. Create a new application for the External Insight Module to run in
heroku create
# 2. Get the host name name out:
heroku apps:info --json | jq -r .app.web_url
```

Use the host name to update the `host:` key in the following files:

- insight_service.yaml
- api/swagger.yaml

```sh
# 3. Commit the host updates
git commit -a -m 'Update Host name keys'
# 4. Build and push code
git push heroku master
# 5. Test to see if it is running should return the string "ok":
curl https://<hostname>/api/v1/
```

### AWS

Follow these instructions here to get running on ECS or Fargate:
[Using the Amazon ECS command line interface](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html)

This will get the server up and running, but without a DNS name. You will need to setup DNS with your current hosting
service. Using that name to update the `host:` key in the following files: `insight_service.yaml` and `api/swagger.yaml`.
Then re-deploying if necessary.

### Azure

TODO.

## Adding to Exchange and ExoSense®

Once the External Insight Module is up and running, we can add it to Exchange and then to ExoSense.

### Spot check the interface

Load the interface definition from `https://<the host name>/api-docs`, look for the top level `host:` key. Make
sure that it matches the host name in the URL. If it does not, go back and update the two swagger files and
re-deploy the service.

### Create Exchange Element

- In Murano, go to IoT Marketplace and click on Publish on the left
- Parameters:
  - Access: Private
  - Element name: Recommend including 'Insight' in the name.
  - Element type: Service
  - Element Variation: ExoSense Insight
  - Configuration File (YAML) URL: `https://<the host name>/api-docs`
  - ... (fill the rest out as you see fit)

### Add Insight To ExoSense

Go to the ExoSense instance Solution in Murano, and click the orange "Enable
Services" button at the top right. Find the Service you just created and enable
it. Your Insight is now available to use in ExoSense!
