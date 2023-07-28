IMAGE_NAME = "longvb/ecom-medusa"
TAG = "0.0.1"

# Build the image
build-image:
	docker build -t ${IMAGE_NAME}:${TAG} .

# Push the image
push-image:
	docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} && docker push ${IMAGE_NAME}:${TAG}
