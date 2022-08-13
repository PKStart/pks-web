PKStart Web
===========

Running the Web Frontend 
------------------------

### Common code in the `pks-common` repository
Types, interfaces and utils common to all PKStart applications are stored in the `pks-common` [repository](https://github.com/PKStart/pks-common). The code is added to each app's repo as an NPM package directly from Github by the following command:
```shell
npm install git+https://github.com/PKStart/pks-common.git
```
Make sure to reinstall and update this package whenever the common code changes.

- [ ] TODO: create npm script for safe updates

### Environment variables
Since Angular uses its own logic of handling the environments, a little 'hack' was needed to achieve using a `.env` file.

There is a script (`scripts/setenv.js`) which will take care of generating the proper Angular environment files, but we need to take the below two steps every time we introduce a new variable:
* Add both `DEV` and `PROD` variables of the frontend to the same `.env` file, differentiating them with a `_DEV` and `_PROD` suffix on their names (see as in the `.env.example` file).
* Add the keys (names) of these variables to the `variables` array in the `scripts/setenv.js` file.

This also means we must not edit manually or commit the content of the `apps/main/src/environments/` folder, as they are always automatically generated 'on the fly'.

To make use of this trick it is essential to only run or build the main frontend app as described below.

### DEV Server
To run the development server for the frontend, simply use the `npm run start` script and open your browser at [http://localhost:8200](http://localhost:8200).

To run the dev server with the production configuration (thus connecting to the deployed prod API and DB), run the `npm run start:prod` command.


CI pipelines and testing
------------------------

### Github actions
Github action workflows are set up for code quality checks and build. These pipelines are triggered on each push and pull request for the `develop` and `master` branches, and also can be started manually on Github on any branch.

* `code-check-build.yml`: This workflow is responsible for linting, format check and to make sure that builds are passing for each component.


Testing locally
---------------

### Code quality checks
Husky is set up to run the linter and check code formatting before each commit.
These checks however can also be run using the `npm run lint` and `npm run format:check` commands for the entire repository.


Deploying for production
------------------------

The Web frontend is hosted on a static private server.

### Automatic deployment
Automatic deployment is set up using Github Actions in the `web-deploy.yml` file under the workflows folder.

The process will automatically run by pushing to the `master` branch or can be started manually on Github with the dispatch action.

Environment variables are stored on Github as repository secrets.

### Manual deployment
Run the `npm run build` command and simply use FTP as usual :) 
