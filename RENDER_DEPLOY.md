# Deploy to Render

1. Push this project to a GitHub repository. Include `package-lock.json`; do not
   include `node_modules`, `venv`, `.env` files, or generated `dist` files.
2. In Render, choose **New → Blueprint**, connect the repository, and approve
   the `render.yaml` configuration.
3. Wait for the Docker build and deployment to finish, then open the `onrender.com`
   URL shown on the Render service page.

The Docker image builds the React app and serves it with the FastAPI backend.
The browser uses same-origin API and chart URLs, so no local `localhost` URL is
needed after deployment.
