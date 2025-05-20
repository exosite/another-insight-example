# Insight Example

An example of how to build an External Insight Module (EIM) in nodeJS and built as a Docker container.

This example also adds some boilerplate so that you can skip right to defining the External Insight Module Functions (EIMF).

Additional Information:

- [ExoSense Insight Schema](https://docs.exosite.io/schema/insight_transform_integration_schema/)
- [Building a Custom Insight Guide](https://docs.exosite.io/insights/reference/building-insights-overview/)

## Local Debugging

### Directly

To run the server locally:

```sh
npm start
```

### Via Docker

```sh
docker build . -t example-insight
docker run --rm -it -p 3000:3000 example-insight
```

## Deploying

For each platform, we assume that you already have an account, and have installed and configured the tools.

### AWS

Follow these instructions here to get running on ECS or Fargate:
[Using the Amazon ECS command line interface](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html)

This will get the server up and running, but without a DNS name. You will need to setup DNS with your current hosting
service. Using that name to update the `host:` key in the file: `api/swagger.yaml`.
Then re-deploying if necessary.

### Azure

Follow this tutuoral, but using this repository instead:
[Deploy and run a containerized web app with Azure App Service](https://docs.microsoft.com/en-us/learn/modules/deploy-run-container-app-service/)

This will get the server up and running. Copy the host name that get assigned. Using that name to update the `host:` key
in the file: `api/swagger.yaml`. Then re-deploy.

## Adding to Murano Exchange and ExoSense®

Once the External Insight Module is up and running, we can add it to Murano Exchange and then to ExoSense.

[Building a Custom Insight Guide](https://docs.exosite.io/insights/reference/building-insights-overview/) for more information on publishing.

### Spot check the interface

Load the interface definition from `https://<the host name>/api-docs`, look for the top level `host:` key. Make
sure that it matches the host name in the URL. If it does not, go back and update the swagger file and
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

## Adding to Murano On-Prem and ExoSense®

The container name will be the host name, so pick something with just alphanumeric like: `exampleinsight`. Update the `hosts:` key in the `api/swagger.yaml` file adding the port number if necessary. FE: `host: exampleinsight:3000`

Then change the `schemes:` key to be `http` instead of `https`.

Rebuild the docker image after updating the `swagger.yaml` file. Copy the image over to the on-prem machine and load it into docker.

The container will need to be in the murano container network, which can be added with `--network murano_net`.
FE: `docker run -d --network murano_net --name exampleinsight exampleinsight:latest`

Now install the service into murano so that it is available for solutions to use:
`sudo murano service install exampleinsight http://exampleinsight:3000/swagger.yaml`

Add the Insight to ExoSense with: `sudo murano service add $SID exampleinsight` (get the SID from `sudo murano solution list` if needed)
